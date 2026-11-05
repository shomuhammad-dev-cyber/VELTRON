// ==============================================================================
// VALIXEN CYBERSECURITY FRAMEWORK: ROLE-BASED ACCESS CONTROL (RBAC)
// Fine-Grained Institutional Permissions & Server-Side Authorization Matrix
// ==============================================================================

import { UserRole } from '@/types/database';
import { ForbiddenError, UnauthorizedError } from '@/lib/api/errors';

export enum Permission {
  // Identity & Profile
  VIEW_OWN_PROFILE = 'VIEW_OWN_PROFILE',
  UPDATE_OWN_PROFILE = 'UPDATE_OWN_PROFILE',

  // Financial Banking
  VIEW_OWN_ACCOUNTS = 'VIEW_OWN_ACCOUNTS',
  CREATE_CHECKING_ACCOUNT = 'CREATE_CHECKING_ACCOUNT',
  EXECUTE_INTERNAL_TRANSFER = 'EXECUTE_INTERNAL_TRANSFER',
  REQUEST_WITHDRAWAL = 'REQUEST_WITHDRAWAL',
  VIEW_TRANSACTIONS = 'VIEW_TRANSACTIONS',

  // Trading & Markets
  VIEW_MARKET_TELEMETRY = 'VIEW_MARKET_TELEMETRY',
  EXECUTE_VIRTUAL_TRADE = 'EXECUTE_VIRTUAL_TRADE',
  EXECUTE_LIVE_ORDER = 'EXECUTE_LIVE_ORDER',
  ACCESS_LEVERAGE_MARGIN = 'ACCESS_LEVERAGE_MARGIN',

  // Compliance & AML Audit
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  AUDIT_USER_ACCOUNTS = 'AUDIT_USER_ACCOUNTS',
  FLAG_SUSPICIOUS_ACTIVITY = 'FLAG_SUSPICIOUS_ACTIVITY',
  EXPORT_COMPLIANCE_REPORT = 'EXPORT_COMPLIANCE_REPORT',

  // Administrative Control
  MANAGE_USER_ROLES = 'MANAGE_USER_ROLES',
  FREEZE_USER_ACCOUNT = 'FREEZE_USER_ACCOUNT',
  VIEW_SYSTEM_METRICS = 'VIEW_SYSTEM_METRICS',
  CONFIGURE_SECURITY_POLICY = 'CONFIGURE_SECURITY_POLICY',
  EXECUTE_EMERGENCY_SHUTDOWN = 'EXECUTE_EMERGENCY_SHUTDOWN',
}

// Comprehensive Role-Permission Mapping Matrix
export const ROLE_PERMISSIONS: Record<UserRole, Set<Permission>> = {
  [UserRole.USER]: new Set([
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_OWN_ACCOUNTS,
    Permission.CREATE_CHECKING_ACCOUNT,
    Permission.EXECUTE_INTERNAL_TRANSFER,
    Permission.VIEW_TRANSACTIONS,
    Permission.VIEW_MARKET_TELEMETRY,
    Permission.EXECUTE_VIRTUAL_TRADE,
  ]),

  [UserRole.TRADER]: new Set([
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_OWN_ACCOUNTS,
    Permission.CREATE_CHECKING_ACCOUNT,
    Permission.EXECUTE_INTERNAL_TRANSFER,
    Permission.REQUEST_WITHDRAWAL,
    Permission.VIEW_TRANSACTIONS,
    Permission.VIEW_MARKET_TELEMETRY,
    Permission.EXECUTE_VIRTUAL_TRADE,
    Permission.EXECUTE_LIVE_ORDER,
  ]),

  [UserRole.VIP_CLIENT]: new Set([
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_OWN_ACCOUNTS,
    Permission.CREATE_CHECKING_ACCOUNT,
    Permission.EXECUTE_INTERNAL_TRANSFER,
    Permission.REQUEST_WITHDRAWAL,
    Permission.VIEW_TRANSACTIONS,
    Permission.VIEW_MARKET_TELEMETRY,
    Permission.EXECUTE_VIRTUAL_TRADE,
    Permission.EXECUTE_LIVE_ORDER,
    Permission.ACCESS_LEVERAGE_MARGIN,
  ]),

  [UserRole.INSTITUTIONAL]: new Set([
    Permission.VIEW_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_OWN_ACCOUNTS,
    Permission.CREATE_CHECKING_ACCOUNT,
    Permission.EXECUTE_INTERNAL_TRANSFER,
    Permission.REQUEST_WITHDRAWAL,
    Permission.VIEW_TRANSACTIONS,
    Permission.VIEW_MARKET_TELEMETRY,
    Permission.EXECUTE_VIRTUAL_TRADE,
    Permission.EXECUTE_LIVE_ORDER,
    Permission.ACCESS_LEVERAGE_MARGIN,
    Permission.VIEW_AUDIT_LOGS,
  ]),

  [UserRole.COMPLIANCE_OFFICER]: new Set([
    Permission.VIEW_OWN_PROFILE,
    Permission.VIEW_MARKET_TELEMETRY,
    Permission.VIEW_AUDIT_LOGS,
    Permission.AUDIT_USER_ACCOUNTS,
    Permission.FLAG_SUSPICIOUS_ACTIVITY,
    Permission.EXPORT_COMPLIANCE_REPORT,
    Permission.FREEZE_USER_ACCOUNT,
  ]),

  [UserRole.SYSTEM_ADMIN]: new Set([
    ...Object.values(Permission), // Full operational administrative capability
  ]),
};

/**
 * Checks whether a role possesses a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.has(permission);
}

/**
 * Server-side authorization assertion. Throws ForbiddenError if user lacks permission.
 */
export function assertPermission(
  user: { id?: string; role?: UserRole } | null | undefined,
  permission: Permission
): void {
  if (!user || !user.role) {
    throw new UnauthorizedError('Authentication required to verify permissions.');
  }

  if (!hasPermission(user.role, permission)) {
    throw new ForbiddenError(
      `Access denied: Role '${user.role}' lacks the required '${permission}' authorization.`
    );
  }
}

/**
 * Asserts that the authenticated user possesses one of the allowed roles.
 */
export function assertRole(
  user: { id?: string; role?: UserRole } | null | undefined,
  allowedRoles: UserRole[]
): void {
  if (!user || !user.role) {
    throw new UnauthorizedError('Authentication required to verify operational role.');
  }

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(
      `Access denied: Operation requires one of the following roles: [${allowedRoles.join(
        ', '
      )}]. Current role: '${user.role}'.`
    );
  }
}
