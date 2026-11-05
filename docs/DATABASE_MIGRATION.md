# 🏛️ VALIXEN FinTech: PostgreSQL Database Migration & Maintenance Guide

This document outlines the step-by-step procedures for provisioning, migrating, securing, and maintaining the production PostgreSQL database for the VALIXEN FinTech platform.

---

## 📋 1. Managed PostgreSQL Provider Requirements

For enterprise stability, high availability, and compliance, VALIXEN requires PostgreSQL 15+ hosted on a managed database tier:
- **Recommended Managed Providers:**
  - **Neon.tech:** Native serverless branching, connection pooling (PgBouncer), automatic autoscaling, zero-downtime point-in-time recovery.
  - **Supabase PostgreSQL:** Built-in connection pooling, pgvector, and automated daily snapshots.
  - **AWS RDS / Aurora PostgreSQL (Multi-AZ):** Institutional enterprise resilience with KMS customer-managed encryption at rest.

### Minimum Database Sizing:
- **vCPU:** 2+ cores (Autoscaling recommended)
- **RAM:** 4GB+ (High concurrency pool)
- **Storage:** NVMe SSD with automatic storage scaling
- **SSL Enforcement:** `sslmode=require` mandatory on all production connection strings.

---

## ⚡ 2. Environment Configuration

In your production environment variables (e.g. Vercel / Railway / Docker):

```bash
# Transaction pooler for serverless functions (port 6543 or pgbouncer=true)
DATABASE_URL="postgresql://valixen_admin:SECURE_PASSWORD@ep-valixen-production.us-east-1.aws.neon.tech/valixen_prod?sslmode=require&pgbouncer=true"

# Direct URL for running schema migrations (bypasses PgBouncer transaction mode)
DIRECT_URL="postgresql://valixen_admin:SECURE_PASSWORD@ep-valixen-production.us-east-1.aws.neon.tech/valixen_prod?sslmode=require"
```

---

## 🚀 3. Executing Migrations

### Automated CI/CD Execution:
In Vercel or your deployment pipeline, the build script automatically triggers:
```bash
npm run postinstall    # Generates Prisma client
npm run prisma:migrate # Applies verified migration ledger
```

### Manual CLI Execution:
To apply migrations and synchronize the schema from your local terminal:
```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Deploy migrations to target PostgreSQL instance
npx prisma migrate deploy

# 3. Or run the all-in-one production migration runner:
npx tsx scripts/migrate-production.ts
```

---

## 🛡️ 4. Applying PostgreSQL Row Level Security (RLS)

VALIXEN enforces a defense-in-depth security model: even if an application SQL query is formed without a `WHERE user_id = ...` clause, PostgreSQL's kernel enforces table-level isolation through **Row Level Security (RLS)**.

The RLS policy definition is located in:
[`prisma/migrations/rls_policies.sql`](file:///C:/Users/user/.gemini/antigravity/scratch/valixen/prisma/migrations/rls_policies.sql)

### Tables Protected by RLS:
1. `financial_accounts` — Users can only select and update their own accounts.
2. `transactions` — Users can only query transactions tied to their financial accounts.
3. `portfolios` — Simulated and real trading portfolios isolated by user ID.
4. `virtual_trades` — Simulated orders and positions isolated by user ID.
5. `user_profiles` — PII and KYC documents protected.
6. `audit_logs` — Tamper-evident ledger read-restricted to `SYSTEM_ADMIN` and `COMPLIANCE_OFFICER`.

To apply or re-verify RLS policies directly in PostgreSQL:
```bash
psql "$DATABASE_URL" -f prisma/migrations/rls_policies.sql
```

---

## 💾 5. Cryptographic Cold Storage Backups

VALIXEN includes a zero-knowledge, envelope-encrypted database snapshot utility:
[`scripts/backup-encrypted.ts`](file:///C:/Users/user/.gemini/antigravity/scratch/valixen/scripts/backup-encrypted.ts)

### How It Works:
1. Generates an ephemeral 256-bit Data Encryption Key (DEK).
2. Encrypts database SQL dump with **AES-256-GCM** with 96-bit unique IV and 128-bit authentication tag.
3. Wraps DEK with Master Key Encryption Key (KEK).
4. Generates tamper-evident **HMAC-SHA256** checksum.

### Running a Backup:
```bash
npm run backup
```
Backups are archived into cold storage with an accompanying manifest containing the SHA-256 integrity hash.

---

## 🔄 6. Zero-Downtime Rollback Plan

If a database schema change needs to be rolled back in production:
1. **Never drop columns destructively:** Follow the Expand and Contract pattern.
2. Revert to the previous application deployment version on Vercel (instant 1-second atomic rollback).
3. If data restoration is required, restore from the latest verified snapshot using your managed provider's point-in-time recovery (PITR) or the AES-256-GCM cold archive.
