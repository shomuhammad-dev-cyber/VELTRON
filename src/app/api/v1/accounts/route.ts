// ==============================================================================
// VALIXEN FINANCIAL ACCOUNTS ROUTE HANDLER
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { CreateFinancialAccountSchema } from '@/lib/api/validator';
import { AccountService } from '@/server/services/account.service';
import { enforceRateLimit } from '@/server/middleware/rate-limiter';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  await enforceRateLimit(clientIp);

  // In production, extracted from authenticated session token
  const demoUserId = req.nextUrl.searchParams.get('userId') || 'demo-institutional-user';

  const accounts = await AccountService.getUserAccounts(demoUserId);
  return successResponse(accounts);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  await enforceRateLimit(clientIp);

  const body = await req.json();
  const validated = CreateFinancialAccountSchema.parse(body);

  const demoUserId = 'demo-institutional-user';
  const newAccount = await AccountService.createAccount({
    userId: demoUserId,
    accountName: validated.accountName,
    type: validated.type,
    currency: validated.currency,
  });

  return successResponse(newAccount, 201);
});
