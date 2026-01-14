# Database Schema Replacement and Rewiring Plan

This document outlines the plan for replacing the legacy database schema with the new, approved schema.

## 1. Legacy Schema Inventory & Removal Plan

The following legacy models will be removed from `comfhutt-next/prisma/schema.prisma`:

- `WaitlistEntry`
- `Lead`
- `ChoiceResponse`
- `ContactUs`
- `EarlyAccessUser`

The following files that use these models will be modified:

- `comfhutt-next/src/lib/actions/auth.ts`
- `comfhutt-next/src/app/admin/dashboard/page.tsx`
- `comfhutt-next/src/app/api/choices/route.ts`
- `comfhutt-next/src/app/api/contact/route.ts`

## 2. Input → New Table Mapping

This section maps the user inputs to the new database tables.

### Choices Page

- **Source File**: `comfhutt-next/src/app/api/choices/route.ts`
- **Handler**: `POST`
- **Target Table**: `choices_responses`
- **Fields Written**: `lead_id`, `choice_key`, `choice_value`
- **Deduplication**: A `users_leads` record is created or updated based on the user's email. The `lead_id` from this record is then used to create a new `choices_responses` record.

### Early Access Form

- **Source File**: `comfhutt-next/src/lib/actions/waitlist.ts` (to be created)
- **Handler**: `POST`
- **Target Table**: `early_access_requests`
- **Fields Written**: `lead_id`, `investment_range`, `city`, `intent_level`, `notes`
- **Deduplication**: A `users_leads` record is created or updated based on the user's email. The `lead_id` from this record is then used to create a new `early_access_requests` record.

### Contact Us Form

- **Source File**: `comfhutt-next/src/app/api/contact/route.ts`
- **Handler**: `POST`
- **Target Table**: `contact_messages`
- **Fields Written**: `lead_id`, `subject`, `message`
- **Deduplication**: A `users_leads` record is created or updated based on the user's email. The `lead_id` from this record is then used to create a new `contact_messages` record.

## 3. Rewiring Summary

The following is a summary of the required code changes:

- **`comfhutt-next/prisma/schema.prisma`**:
    - Remove the legacy models.
    - Add the new models: `users_leads`, `lead_events`, `choices_responses`, `early_access_requests`, `contact_messages`, and `page_sessions`.
- **`comfhutt-next/src/app/api/choices/route.ts`**:
    - Replace the `Lead` and `ChoiceResponse` models with `users_leads` and `choices_responses`.
    - Implement the logic to create or update a `users_leads` record and then create a `choices_responses` record.
- **`comfhutt-next/src/app/api/contact/route.ts`**:
    - Add logic to create or update a `users_leads` record and then create a `contact_messages` record.
- **`comfhutt-next/src/lib/actions/waitlist.ts`**:
    - This file will be created to handle the early access form submission.
    - It will replace the `WaitlistEntry` model with `users_leads` and `early_access_requests`.
- **`comfhutt-next/src/lib/actions/auth.ts`**:
    - Remove the logic that links a `WaitlistEntry` to a `User`.
- **`comfhutt-next/src/app/admin/dashboard/page.tsx`**:
    - Update the dashboard to use the new `users_leads` table instead of `WaitlistEntry`.

## 4. Final SQL (DEV only)

The following SQL will be generated to create the new tables in the development database.

```sql
-- Create users_leads table
CREATE TABLE users_leads (
    id UUID PRIMARY KEY,
    email TEXT,
    phone TEXT,
    name TEXT,
    source TEXT,
    first_seen_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ,
    environment TEXT
);

CREATE INDEX idx_users_leads_email ON users_leads(email);

-- Create lead_events table
CREATE TABLE lead_events (
    id UUID PRIMARY KEY,
    lead_id UUID REFERENCES users_leads(id),
    event_type TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    environment TEXT
);

CREATE INDEX idx_lead_events_lead_id ON lead_events(lead_id);

-- Create choices_responses table
CREATE TABLE choices_responses (
    id UUID PRIMARY KEY,
    lead_id UUID REFERENCES users_leads(id),
    choice_key TEXT,
    choice_value TEXT,
    created_at TIMESTAMPTZ,
    environment TEXT
);

CREATE INDEX idx_choices_responses_lead_id ON choices_responses(lead_id);

-- Create early_access_requests table
CREATE TABLE early_access_requests (
    id UUID PRIMARY KEY,
    lead_id UUID REFERENCES users_leads(id),
    investment_range TEXT,
    city TEXT,
    intent_level TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ,
    environment TEXT
);

CREATE INDEX idx_early_access_requests_lead_id ON early_access_requests(lead_id);

-- Create contact_messages table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY,
    lead_id UUID REFERENCES users_leads(id),
    subject TEXT,
    message TEXT,
    responded BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ,
    environment TEXT
);

CREATE INDEX idx_contact_messages_lead_id ON contact_messages(lead_id);

-- Create page_sessions table
CREATE TABLE page_sessions (
    id UUID PRIMARY KEY,
    lead_id UUID REFERENCES users_leads(id),
    page TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ,
    environment TEXT
);

CREATE INDEX idx_page_sessions_lead_id ON page_sessions(lead_id);
```

## 5. Deployment Checklist

1.  Apply the new schema to the DEV database.
2.  Run migrations in the DEV environment.
3.  Deploy the updated code to the DEV environment.
4.  Thoroughly test all the rewired data flows.
5.  Manually apply the new schema to the PROD database.
6.  Deploy the updated code to the PROD environment.
7.  Verify that all data flows are working correctly in the PROD environment.
8.  Remove the legacy tables from the DEV and PROD databases.

## 6. Production Safety Rules

-   All schema changes must be reviewed and approved by the principal database engineer.
-   The `DIRECT_URL` must never be used in the runtime code.
-   Schema drift between the DEV and PROD databases must be monitored and prevented.
-   Regular backups of the PROD database must be taken.
-   A rollback plan must be in place before any schema changes are applied to the PROD database.
