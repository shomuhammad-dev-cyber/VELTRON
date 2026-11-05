// ==============================================================================
// VALIXEN API: /api/v1/reports
// Institutional Auditable Statements, Regulatory Records & Cryptographic Proof
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { AdvancedReportsService } from '@/server/services/reports.service';
import { resolveUserId } from '@/lib/api/auth-helper';
import { z } from 'zod';

const GenerateReportSchema = z.object({
  reportType: z.enum(['MONTHLY_STATEMENT', 'ANNUAL_WEALTH_TAX', 'PORTFOLIO_RISK_AUDIT', 'ESG_ASSET_DIVERSITY']),
  period: z.string().min(2),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const reports = await AdvancedReportsService.getUserReports(userId);
  return successResponse({ reports }, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const body = await req.json();
  const { reportType, period } = GenerateReportSchema.parse(body);

  const report = await AdvancedReportsService.generateReport(userId, reportType, period);
  return successResponse({ report }, 201);
});
