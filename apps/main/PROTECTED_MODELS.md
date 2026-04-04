# Protected Models

This document lists all the models that are considered protected and should not be removed or modified without explicit instruction.

## Core Input / Funnel Models (ALWAYS KEEP)
These models receive user input and are business-critical.

- `Lead`: Captures leads from various sources.
- `ChoiceResponse`: Stores user responses to choices presented to them.
- `EarlyAccessUser`: Manages users who have signed up for early access.
- `WaitlistEntry`: Manages users on the waitlist.
- `ContactUs`: Stores contact messages from users.

## Core Domain Models (KEEP)
These models represent active product functionality.

- `User`: Represents user accounts.
- `Account`: Represents user accounts from different providers.
- `Session`: Manages user sessions.
- `VerificationToken`: Stores tokens for email verification.
- `Owner`: Represents property owners.
- `Property`: Represents properties in the marketplace.
- `PropertyDocument`: Stores documents related to properties.

**Audit Status:** All models currently in `schema.prisma` fall into one of these two protected categories. No legacy models were identified for removal.
