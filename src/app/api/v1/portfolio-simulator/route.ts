// ==============================================================================
// VALIXEN API: /api/v1/portfolio-simulator
// Multi-Asset Macro Strategy Presets & Custom Convexity Allocation Engine
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { PortfolioSimulatorService } from '@/server/services/portfolio-simulator.service';
import { z } from 'zod';

const CustomSimulationSchema = z.object({
  weights: z.record(z.string(), z.number()),
  startingCapital: z.number().positive().default(100000),
});

export const GET = withErrorHandler(async () => {
  const strategies = PortfolioSimulatorService.getStrategies();
  return successResponse({ strategies }, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { weights, startingCapital } = CustomSimulationSchema.parse(body);

  const simulation = PortfolioSimulatorService.simulateCustom(weights, startingCapital);
  return successResponse({ simulation }, 200);
});
