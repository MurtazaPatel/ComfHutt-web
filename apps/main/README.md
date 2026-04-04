# ComfHutt Web Platform

## Overview
ComfHutt is a modern web platform built with Next.js 15 (App Router), React, TypeScript, and Tailwind CSS. It features a robust authentication system, waitlist management, and a responsive, high-performance UI.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** Auth.js (NextAuth v5 Beta)
- **Validation:** Zod + React Hook Form
- **Containerization:** Docker + Docker Compose

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional, for local DB)
- PostgreSQL (if not using Docker)

### Environment Variables
Create a `.env` file in the root directory (`comfhutt-next/.env`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/comfhutt?schema=public"
AUTH_SECRET="your-super-secret-key-generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# Email Server (Optional - for Magic Links)
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@comfhutt.com"
```

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the database:**
   If you have Docker installed:
   ```bash
   docker compose up -d db
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker Deployment

To build and run the entire application stack using Docker:

```bash
docker compose up --build
```

## Authentication Flow

- **Sign Up:** Users can sign up using Email/Password or OAuth providers (Google, Apple, LinkedIn).
- **Sign In:** Secure login flow with credential validation and error handling.
- **Waitlist Integration:** If a user signs up with an email that is already on the waitlist, their account is automatically linked, and their waitlist status is updated to "approved".
- **Protected Routes:**
  - `/dashboard`: Accessible only to authenticated users.
  - `/admin`: Accessible only to users with the `admin` role.

## Admin Dashboard

To access the admin dashboard, you must manually update a user's role to `admin` in the database:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

Visit `/admin/dashboard` to view platform metrics.

## YC Demo Script

1. **Create Account:** Go to `/auth/register` and sign up with a new email.
2. **Dashboard:** You will be redirected to `/dashboard`. Note your User ID and Waitlist status (if applicable).
3. **Waitlist Logic:** Sign out. Add a new email to the waitlist (via API or future landing page form). Then register with that same email. The system will link the records.
4. **Admin View:** Log in as an admin (after DB update) and visit `/admin/dashboard` to see user counts.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, database client, and server actions.
- `src/auth.ts`: Auth.js configuration.
- `prisma/schema.prisma`: Database schema definition.

## License
[MIT](LICENSE)
