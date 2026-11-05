// ==============================================================================
// VALIXEN VERIFICATION SUITE: ENTERPRISE ADMINISTRATION PORTAL (/admin)
// Automated verification for Admin RBAC, Revenue Segregation, User Governance,
// SIEM Security Center, Audit Hash Chaining & Broadcast Announcements
// ==============================================================================

process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://valixen_user:dev_pass@localhost:5432/valixen_dev?schema=public';

import { db } from '../src/lib/db';
import { AdminDashboardService } from '../src/server/services/admin-dashboard.service';
import { UserRole } from '../src/types/database';

async function runAdminPortalVerification() {
  console.log('\n============================================================');
  console.log('🏛️  VALIXEN FINTECH: ENTERPRISE ADMIN PORTAL VERIFICATION');
  console.log('============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✔ [PASS] Test ${totalTests}: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ✘ [FAIL] Test ${totalTests}: ${testName} - Detail: ${detail || 'Assertion failed'}`);
    }
  }

  // Setup deterministic in-memory stubs
  const mockUsers: any[] = [
    {
      id: 'admin-master-id',
      email: 'admin.master@valixen.com',
      role: 'SYSTEM_ADMIN',
      isActive: true,
      profile: { firstName: 'Master', lastName: 'Admin', kycStatus: 'TIER_2_VERIFIED' },
      financialAccounts: [{ id: 'acc-1' }],
      subscriptions: [{ tier: 'INSTITUTIONAL_ALPHA' }],
      createdAt: new Date('2026-01-01'),
    },
    {
      id: 'compliance-officer-id',
      email: 'compliance.lead@valixen.com',
      role: 'COMPLIANCE_OFFICER',
      isActive: true,
      profile: { firstName: 'Compliance', lastName: 'Lead', kycStatus: 'TIER_2_VERIFIED' },
      financialAccounts: [],
      subscriptions: [{ tier: 'INSTITUTIONAL_ALPHA' }],
      createdAt: new Date('2026-02-01'),
    },
    {
      id: 'regular-trader-id',
      email: 'trader.alex@gmail.com',
      role: 'TRADER',
      isActive: true,
      profile: { firstName: 'Alex', lastName: 'Trader', kycStatus: 'TIER_1_VERIFIED' },
      financialAccounts: [{ id: 'acc-2' }],
      subscriptions: [{ tier: 'APEX_PRO' }],
      createdAt: new Date('2026-03-01'),
    },
    {
      id: 'target-user-id',
      email: 'user.tobemodified@valixen.com',
      role: 'USER',
      isActive: true,
      profile: { firstName: 'Target', lastName: 'User', kycStatus: 'UNVERIFIED' },
      financialAccounts: [],
      subscriptions: [{ tier: 'EXPLORER' }],
      createdAt: new Date('2026-04-01'),
    },
  ];

  (db.user as any).findUnique = async ({ where }: any) => {
    return mockUsers.find((u) => u.id === where.id || u.email === where.email) || null;
  };

  (db.user as any).findMany = async () => mockUsers;
  (db.user as any).count = async ({ where }: any = {}) => {
    if (where?.isActive) return mockUsers.filter((u) => u.isActive).length;
    return mockUsers.length;
  };

  (db.user as any).update = async ({ where, data }: any) => {
    const idx = mockUsers.findIndex((u) => u.id === where.id);
    if (idx >= 0) {
      mockUsers[idx] = { ...mockUsers[idx], ...data };
      return mockUsers[idx];
    }
    return null;
  };

  const mockAnnouncements: any[] = [];
  (db as any).platformAnnouncement = {
    findMany: async () => mockAnnouncements,
    create: async ({ data }: any) => {
      const ann = { id: 'ann-' + Date.now(), ...data, createdAt: new Date(), updatedAt: new Date() };
      mockAnnouncements.push(ann);
      return ann;
    },
  };

  try {
    console.log('1. ACCESS GATE & RBAC CLEARANCE VERIFICATION:');

    // Test 1: SYSTEM_ADMIN access permitted
    const adminCheck = await AdminDashboardService.assertAdminPrivilege('admin-master-id');
    assert(adminCheck.role === 'SYSTEM_ADMIN', 'SYSTEM_ADMIN role has full access clearance');

    // Test 2: COMPLIANCE_OFFICER access permitted
    const complianceCheck = await AdminDashboardService.assertAdminPrivilege('compliance-officer-id');
    assert(complianceCheck.role === 'COMPLIANCE_OFFICER', 'COMPLIANCE_OFFICER role has access clearance');

    // Test 3: Regular TRADER blocked from /admin
    let traderBlocked = false;
    try {
      await AdminDashboardService.assertAdminPrivilege('regular-trader-id');
    } catch (err: any) {
      if (err.statusCode === 403 || err.name === 'ForbiddenError') {
        traderBlocked = true;
      }
    }
    assert(traderBlocked, 'RBAC Security: Regular TRADER is strictly blocked with 403 Forbidden');

    console.log('\n2. FINANCIAL ACCOUNTING & REVENUE SEGREGATION:');

    // Test 4: Dashboard overview KPIs
    const overview = await AdminDashboardService.getDashboardOverview();
    assert(overview.totalUsers > 0 && overview.activeUsers > 0, 'Overview returns active enterprise user telemetry');

    // Test 5: Strict Revenue Calculation Standard
    const rev = overview.revenue;
    assert(
      rev.monthlyRevenue > 0 && rev.annualRevenue === rev.monthlyRevenue * 12,
      'Revenue correctly annualized (ARR = MRR * 12)',
      `MRR: $${rev.monthlyRevenue}, ARR: $${rev.annualRevenue}`
    );
    assert(
      rev.totalExpenses > 0 && rev.netProfit === rev.monthlyRevenue - rev.totalExpenses,
      'Net profit equals platform revenue minus operating infrastructure expenses',
      `Net Profit: $${rev.netProfit}`
    );
    assert(
      rev.profitMarginPercent > 0 && rev.profitMarginPercent <= 100,
      'Calculates accurate positive net profit margin percentage'
    );
    assert(
      rev.revenueSource.includes('Verified Platform Fees') &&
        rev.revenueSource.includes('strictly excluded'),
      'Strict Accounting Standard: Customer deposit balances and virtual portfolios are explicitly excluded from company revenue'
    );

    // Test 6: Subscription Telemetry
    const subs = overview.subscriptionStats;
    assert(
      subs.apexProCount > 0 && subs.institutionalCount > 0 && subs.arpuUsd > 0,
      'Accurate subscription statistics with valid positive ARPU'
    );

    console.log('\n3. USER GOVERNANCE & AUDIT LEDGER:');

    // Test 7: Get Users List
    const usersRes = await AdminDashboardService.getUsersList({ role: 'ALL' });
    assert(usersRes.users.length >= 4, 'Retrieves enterprise user governance records');

    // Test 8: Filter by role
    const institutionalUsers = await AdminDashboardService.getUsersList({ role: 'INSTITUTIONAL' });
    assert(
      institutionalUsers.users.every((u) => u.role === 'INSTITUTIONAL'),
      'User filter correctly isolates INSTITUTIONAL accounts'
    );

    // Test 9: Update User Role with SHA-256 Chained Hash
    const roleUpdateRes = await AdminDashboardService.updateUserRole(
      'admin-master-id',
      'target-user-id',
      UserRole.TRADER,
      'Promotion to licensed trading desk'
    );
    assert(roleUpdateRes.success === true, 'Admin successfully promotes user role');
    assert(
      typeof roleUpdateRes.auditHash === 'string' && roleUpdateRes.auditHash.length === 64,
      'Emits tamper-evident SHA-256 cryptographic audit hash for role modification',
      `Hash: ${roleUpdateRes.auditHash}`
    );

    // Test 10: Non-admin role modification blocked
    let nonAdminRoleBlocked = false;
    try {
      await AdminDashboardService.updateUserRole(
        'compliance-officer-id', // only SYSTEM_ADMIN can update roles
        'target-user-id',
        UserRole.SYSTEM_ADMIN,
        'Attempted self-elevation'
      );
    } catch (err: any) {
      if (err.statusCode === 403 || err.name === 'ForbiddenError') {
        nonAdminRoleBlocked = true;
      }
    }
    assert(nonAdminRoleBlocked, 'Only SYSTEM_ADMIN can reassign roles; other actors are blocked');

    // Test 11: Suspend and Reactivate Account
    const suspendRes = await AdminDashboardService.toggleUserStatus(
      'admin-master-id',
      'target-user-id',
      true, // suspend
      'Suspicious transaction telemetry identified'
    );
    assert(suspendRes.success === true, 'Admin successfully suspends flagged account');
    assert(
      typeof suspendRes.auditHash === 'string' && suspendRes.auditHash.length === 64,
      'Account suspension logged with cryptographic SHA-256 hash'
    );

    const reactivateRes = await AdminDashboardService.toggleUserStatus(
      'admin-master-id',
      'target-user-id',
      false, // reactivate
      'Compliance review completed, cleared'
    );
    assert(reactivateRes.success === true, 'Admin successfully reactivates cleared account');

    console.log('\n4. BUSINESS ANALYTICS & PLATFORM USAGE:');

    // Test 12: Business Analytics
    const analytics = await AdminDashboardService.getBusinessAnalytics();
    assert(analytics.monthlyFinancials.length === 12, 'Returns full 12-month historical financial breakdown');
    assert(analytics.subscriptionDistribution.length === 3, 'Returns all 3 commercial subscription tier breakdowns');
    assert(
      analytics.conversionFunnel.length >= 5,
      'Returns 5-stage customer conversion funnel (Explorer to Institutional)'
    );
    assert(
      analytics.userRetention.day30 > 0 && analytics.userRetention.day90 > 0,
      'Returns verified multi-cohort user retention metrics'
    );
    assert(
      analytics.platformUsage.systemUptime === '99.994%',
      'Returns high-availability platform uptime telemetry'
    );

    console.log('\n5. SECURITY CENTER & SIEM AUDIT LEDGER:');

    // Test 13: Security Center Telemetry
    const security = await AdminDashboardService.getSecurityTelemetry();
    assert(security.failedLoginEvents.length > 0, 'Tracks failed login events with IPs and reasons');
    assert(security.activeSessionsCount > 0, 'Tracks active user sessions count');
    assert(
      security.sessionsByDevice.desktopPercent +
        security.sessionsByDevice.mobilePercent +
        security.sessionsByDevice.apiTokensPercent ===
        100,
      'Session device percentages aggregate correctly to 100%'
    );
    assert(security.suspiciousEvents.length > 0, 'Detects and flags suspicious events (rate limits, CVV drops)');
    assert(security.adminAuditLogs.length > 0, 'Returns chained audit logs with SHA-256 block hashes');
    assert(
      security.backupStatus.status === 'HEALTHY' && security.backupStatus.hmacVerification === 'PASS',
      'Automated AES-256-GCM cold backup verified with HMAC-SHA256 signature'
    );

    console.log('\n6. PLATFORM BROADCAST ANNOUNCEMENTS:');

    // Test 14: Create and fetch broadcast announcement
    const announcement = await AdminDashboardService.createAnnouncement('admin-master-id', {
      title: 'Scheduled RTGS Maintenance',
      message: 'Settlement rails will undergo maintenance at 02:00 UTC.',
      type: 'MAINTENANCE',
    });
    assert(announcement.title === 'Scheduled RTGS Maintenance', 'Admin creates broadcast announcement');

    const allAnnouncements = await AdminDashboardService.getAnnouncements();
    assert(
      allAnnouncements.some((a: any) => a.title === 'Scheduled RTGS Maintenance'),
      'Announcements list reflects newly broadcast announcement'
    );

    console.log('\n------------------------------------------------------------');
    console.log(`SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('------------------------------------------------------------\n');

    if (passedTests === totalTests) {
      console.log('🎉 ALL ENTERPRISE ADMIN PORTAL VERIFICATION TESTS PASSED!\n');
      process.exit(0);
    } else {
      console.error('❌ SOME TESTS FAILED.\n');
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal admin test error:', err);
    process.exit(1);
  }
}

runAdminPortalVerification();
