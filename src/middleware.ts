// ==============================================================================
// VALIXEN EDGE MIDDLEWARE: DEFENSE-IN-DEPTH SECURITY GATEWAY
// CSP, HSTS, Clickjacking, Route Protection & Role Verification
// ==============================================================================

import { NextResponse, type NextRequest } from 'next/server';
import { applySecurityHeaders } from '@/lib/security/headers';

const PROTECTED_PREFIXES = ['/terminal', '/settings/security'];
const ADMIN_PREFIXES = ['/admin', '/compliance'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Handle CORS Preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    const preflightResponse = new NextResponse(null, { status: 204 });
    return applySecurityHeaders(preflightResponse, origin, pathname);
  }

  // Reject development-only or test endpoints in production
  if (process.env.NODE_ENV === 'production') {
    if (pathname.startsWith('/api/dev/') || pathname.startsWith('/api/mock/')) {
      return NextResponse.json(
        { error: 'Endpoint is disabled in production environment.' },
        { status: 404 }
      );
    }
  }

  // 1. Check if the path requires authentication or administrative authorization
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAdmin = ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected || isAdmin) {
    // 2. Extract session token from secure cookies
    const sessionToken =
      request.cookies.get('__Secure-authjs.session-token')?.value ||
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('valixen_session')?.value;

    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', encodeURI(pathname));
      const redirectResponse = NextResponse.redirect(loginUrl);
      return applySecurityHeaders(redirectResponse, origin, pathname);
    }

    // 3. Admin / Compliance route protection
    if (isAdmin) {
      const roleCookie = request.cookies.get('valixen_role')?.value;
      if (roleCookie !== 'SYSTEM_ADMIN' && roleCookie !== 'COMPLIANCE_OFFICER') {
        const unauthorizedUrl = new URL('/login?error=AccessDenied', request.url);
        const redirectResponse = NextResponse.redirect(unauthorizedUrl);
        return applySecurityHeaders(redirectResponse, origin, pathname);
      }
    }
  }

  // 4. Inject full suite of enterprise security headers onto response
  const response = NextResponse.next();
  return applySecurityHeaders(response, origin, pathname);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.svg, .png, .jpg)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
