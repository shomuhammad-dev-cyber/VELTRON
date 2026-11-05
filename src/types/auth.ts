// ==============================================================================
// VALIXEN AUTHENTICATION & SESSION CONTEXT
// ==============================================================================

export type UserRole = 'USER' | 'TRADER' | 'VIP_CLIENT' | 'INSTITUTIONAL' | 'COMPLIANCE_OFFICER' | 'SYSTEM_ADMIN';

export interface AuthSessionUser {
  id: string;
  email: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  kycStatus: string;
  countryCode?: string;
}

export interface AuthenticatedRequestContext {
  user: AuthSessionUser;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
}
