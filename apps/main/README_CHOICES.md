# Choices Module Setup Guide

## 1. Environment Variables
Ensure the following variables are set in your `.env` file (local) and Vercel project settings:
```bash
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..." # If using Supabase transaction pooler
```

## 2. Database Migration
Since this project uses Prisma, you should sync the schema changes:

```bash
# Generate Prisma Client
npx prisma generate

# Create Migration (Local)
npx prisma migrate dev --name add_choices_tables

# Deploy to Production (Vercel)
npx prisma migrate deploy
```

*Note: The raw SQL for these tables is also provided in `migrations/001_create_choices_tables.sql` for reference or manual execution in Supabase SQL Editor.*

## 3. Testing
To run the tests for this module:
```bash
# Install testing dependencies if missing
npm install -D @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# Run tests
npm test src/components/__tests__/ChoicesCard.test.tsx
npm test src/app/api/choices/__tests__/route.test.ts
```

## 4. Usage
The component is available at the route `/choice`.
You can import the `ChoicesCard` component to embed it elsewhere:

```tsx
import ChoicesCard from "@/components/ChoicesCard";

export default function MyPage() {
  return <ChoicesCard />;
}
```

## 5. Security Notes
- Rate limiting is currently implemented in-memory (`src/app/api/choices/route.ts`). For scale, move this to Edge Middleware with Upstash Redis.
- Input validation is handled via Zod on both client and server.