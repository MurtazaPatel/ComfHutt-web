# DEV Environment Verification Plan

This document outlines the steps to manually verify that the application endpoints are correctly reading and writing to the new database schema in the DEV environment.

## 1. Choices Page

1.  Navigate to the Choices page in the application.
2.  Fill out the form and submit it.
3.  Verify that a new record is created in the `users_leads` table with the `source` set to `CHOICES`.
4.  Verify that a new record is created in the `choices_responses` table with the correct `lead_id` and choice data.

## 2. Early Access Form

1.  Navigate to the Early Access page in the application.
2.  Fill out the form and submit it.
3.  Verify that a new record is created in the `users_leads` table with the `source` set to `EARLY_ACCESS`.
4.  Verify that a new record is created in the `early_access_requests` table with the correct `lead_id` and form data.

## 3. Contact Us Form

1.  Navigate to the Contact Us page in the application.
2.  Fill out the form and submit it.
3.  Verify that a new record is created in the `users_leads` table with the `source` set to `CONTACT`.
4.  Verify that a new record is created in the `contact_messages` table with the correct `lead_id` and message data.

## 4. User Registration

1.  Register a new user.
2.  Verify that a new record is created in the `User` table.
3.  Verify that no record is created in the `WaitlistEntry` table.

## 5. Admin Dashboard

1.  Navigate to the Admin Dashboard.
2.  Verify that the "Total Leads" count matches the number of records in the `users_leads` table.
3.  Verify that the "Waitlist Entries" card has been removed or replaced.
