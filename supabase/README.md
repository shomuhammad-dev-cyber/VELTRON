# 🏛️ VELTRON — Supabase Backend & Database Architecture

This directory contains the production database architecture for the **VELTRON** financial ecosystem.

---

## ⚡ 1. Fast Setup (Supabase Dashboard)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project named **VELTRON**.
2. Navigate to **SQL Editor** from the left navigation menu.
3. Open [`schema.sql`](./schema.sql), copy its entire content, and paste it into the Supabase SQL Editor.
4. Click **Run** (`Ctrl+Enter` / `Cmd+Enter`). All 30+ relational tables, enums, indexes, and constraints will be instantiated within seconds.

---

## 🔑 2. Environment Variables Configuration

In your Supabase project settings:

1. **Project Settings → API:**
   - Copy **Project URL** ➔ `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public key** ➔ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role secret** ➔ `SUPABASE_SERVICE_ROLE_KEY`

2. **Project Settings → Database:**
   - Under **Connection string → URI**:
     - Mode: **Transaction** (port 6543) ➔ `DATABASE_URL`
     - Mode: **Session** / Direct (port 5432) ➔ `DIRECT_URL`

Add these keys to your `.env.local` or Vercel Environment Variables:

```env
# Supabase Client Credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Supabase PostgreSQL Connection Pooler (Prisma)
DATABASE_URL="postgresql://postgres.[project-id]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-id]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

---

## 🛡️ 3. Automatic Row-Level Security (RLS) & Realtime

- All authentication events can be subscribed to via `@supabase/supabase-js`.
- Browser client is located at: `src/lib/supabase/client.ts`
- Server admin client is located at: `src/lib/supabase/server.ts`
- Prisma ORM is automatically configured to use Supabase connection pooler with zero changes required.
