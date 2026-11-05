-- ==============================================================================
-- VALIXEN DATABASE SECURITY: POSTGRESQL ROW LEVEL SECURITY (RLS) POLICIES
-- Zero-Trust Data Isolation Architecture for Financial & User Records
-- ==============================================================================

-- 1. Helper function for setting application session context securely
CREATE OR REPLACE FUNCTION set_app_user_context(
  p_user_id UUID,
  p_user_role TEXT DEFAULT 'USER'
) RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', p_user_id::text, false);
  PERFORM set_config('app.current_user_role', p_user_role, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. ENABLE ROW LEVEL SECURITY ON FINANCIAL TABLES
ALTER TABLE "financial_accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "portfolios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "virtual_trades" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- FINANCIAL ACCOUNTS POLICIES
-- ------------------------------------------------------------------------------
-- Regular Users: Can only SELECT their own accounts
CREATE POLICY financial_accounts_user_select_policy ON "financial_accounts"
  FOR SELECT
  USING (
    "user_id" = current_setting('app.current_user_id', true)::uuid
    OR current_setting('app.current_user_role', true) IN ('SYSTEM_ADMIN', 'COMPLIANCE_OFFICER')
  );

-- Regular Users: Can only UPDATE non-frozen accounts belonging to them
CREATE POLICY financial_accounts_user_update_policy ON "financial_accounts"
  FOR UPDATE
  USING (
    "user_id" = current_setting('app.current_user_id', true)::uuid
    AND "status" = 'ACTIVE'
  )
  WITH CHECK (
    "user_id" = current_setting('app.current_user_id', true)::uuid
    AND "status" = 'ACTIVE'
  );

-- Admins: Unrestricted control
CREATE POLICY financial_accounts_admin_all_policy ON "financial_accounts"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'SYSTEM_ADMIN'
  );

-- ------------------------------------------------------------------------------
-- TRANSACTIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY transactions_user_select_policy ON "transactions"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "financial_accounts"
      WHERE "financial_accounts"."id" = "transactions"."source_account_id"
        AND "financial_accounts"."user_id" = current_setting('app.current_user_id', true)::uuid
    )
    OR current_setting('app.current_user_role', true) IN ('SYSTEM_ADMIN', 'COMPLIANCE_OFFICER')
  );

-- ------------------------------------------------------------------------------
-- PORTFOLIOS & VIRTUAL TRADES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY portfolios_user_isolation_policy ON "portfolios"
  FOR ALL
  USING (
    "user_id" = current_setting('app.current_user_id', true)::uuid
    OR current_setting('app.current_user_role', true) = 'SYSTEM_ADMIN'
  );

CREATE POLICY virtual_trades_user_isolation_policy ON "virtual_trades"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "portfolios"
      WHERE "portfolios"."id" = "virtual_trades"."portfolio_id"
        AND "portfolios"."user_id" = current_setting('app.current_user_id', true)::uuid
    )
    OR current_setting('app.current_user_role', true) = 'SYSTEM_ADMIN'
  );

-- ------------------------------------------------------------------------------
-- USER PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY user_profiles_isolation_policy ON "user_profiles"
  FOR ALL
  USING (
    "user_id" = current_setting('app.current_user_id', true)::uuid
    OR current_setting('app.current_user_role', true) = 'SYSTEM_ADMIN'
  );

-- ------------------------------------------------------------------------------
-- AUDIT LOGS POLICIES (Append-Only; Deletion Forbidden for all users)
-- ------------------------------------------------------------------------------
CREATE POLICY audit_logs_insert_policy ON "audit_logs"
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY audit_logs_select_policy ON "audit_logs"
  FOR SELECT
  USING (
    current_setting('app.current_user_role', true) IN ('SYSTEM_ADMIN', 'COMPLIANCE_OFFICER')
    OR "user_id" = current_setting('app.current_user_id', true)::uuid
  );

-- ------------------------------------------------------------------------------
-- SAVINGS GOALS & FINANCIAL REPORTS POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE "savings_goals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "financial_report_records" ENABLE ROW LEVEL SECURITY;

CREATE POLICY savings_goals_user_isolation_policy ON "savings_goals"
  FOR ALL
  USING (
    "user_id" = current_setting('app.current_user_id', true)::uuid
    OR current_setting('app.current_user_role', true) = 'SYSTEM_ADMIN'
  );

CREATE POLICY financial_reports_user_isolation_policy ON "financial_report_records"
  FOR ALL
  USING (
    "user_id" = current_setting('app.current_user_id', true)::uuid
    OR current_setting('app.current_user_role', true) IN ('SYSTEM_ADMIN', 'COMPLIANCE_OFFICER')
  );

-- Explicitly revoke DELETE permissions on audit logs to guarantee immutable history
REVOKE DELETE, TRUNCATE ON "audit_logs" FROM PUBLIC, "postgres";
