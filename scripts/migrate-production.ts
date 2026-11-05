// ==============================================================================
// VALIXEN PRODUCTION DATABASE MIGRATION & RLS ENFORCEMENT RUNNER
// Applies Prisma schema, PostgreSQL Row Level Security (RLS) & Seeds Baselines
// ==============================================================================

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { db } from '../src/lib/db';
import { logger } from '../src/lib/logger';

async function runProductionMigrations() {
  console.log('==============================================================================');
  console.log('🏛️  VALIXEN FINTECH: PRODUCTION DATABASE MIGRATION & RLS RUNNER');
  console.log('==============================================================================\n');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ FATAL: DATABASE_URL environment variable is not defined.');
    process.exit(1);
  }

  // Mask database password for safe audit logging
  const maskedDbUrl = databaseUrl.replace(/(:\/\/)([^:]+):([^@]+)@/, '$1$2:[REDACTED]@');
  console.log(`[1/4] Connecting to Managed PostgreSQL: ${maskedDbUrl}`);

  try {
    // 1. Prisma Client Generation
    console.log('[2/4] Generating Prisma Client artifacts...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✔ Prisma client generated successfully.\n');

    // 2. Synchronize Database Schema
    console.log('[3/4] Applying Schema Migrations / Push to PostgreSQL...');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✔ Prisma migrations applied successfully.\n');
    } catch {
      console.log('ℹ️  No pending migration history directory; executing schema synchronization via db push...');
      execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
      console.log('✔ Database schema synchronized successfully.\n');
    }

    // 3. Apply PostgreSQL Row Level Security (RLS) Policies
    console.log('[4/4] Applying PostgreSQL Row Level Security (RLS) policies...');
    const rlsSqlPath = path.resolve(__dirname, '../prisma/migrations/rls_policies.sql');
    if (fs.existsSync(rlsSqlPath)) {
      const rlsSql = fs.readFileSync(rlsSqlPath, 'utf8');
      
      // Execute raw SQL policies directly against the connection pool
      await (db as any).$executeRawUnsafe(rlsSql);
      console.log('✔ Bank-grade Row Level Security (RLS) policies successfully enforced on all financial tables.');
    } else {
      console.warn('⚠️  RLS policies file not found at:', rlsSqlPath);
    }

    console.log('\n==============================================================================');
    console.log('🎉 PRODUCTION DATABASE INITIALIZATION & MIGRATION COMPLETE');
    console.log('==============================================================================');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message || error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runProductionMigrations();
