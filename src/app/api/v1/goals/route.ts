// ==============================================================================
// VALIXEN API: /api/v1/goals
// Smart Savings Goals, Velocity Tracking & Automated Contributions
// ==============================================================================

import { NextRequest } from 'next/server';
import { withErrorHandler } from '@/lib/api/error-handler';
import { successResponse } from '@/lib/api/response';
import { SmartSavingsGoalsService } from '@/server/services/goals.service';
import { resolveUserId } from '@/lib/api/auth-helper';
import { z } from 'zod';

const CreateGoalSchema = z.object({
  action: z.enum(['CREATE', 'CONTRIBUTE', 'DELETE']).default('CREATE'),
  goalId: z.string().optional(),
  title: z.string().min(2).optional(),
  targetAmount: z.number().positive().optional(),
  initialDeposit: z.number().nonnegative().optional(),
  currency: z.string().default('USD').optional(),
  category: z.string().default('EMERGENCY_FUND').optional(),
  targetDate: z.string().optional(),
  autoSaveFrequency: z.string().default('MONTHLY').optional(),
  autoSaveAmount: z.number().nonnegative().optional(),
  amount: z.number().positive().optional(),
});

export const GET = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const goals = await SmartSavingsGoalsService.getUserGoals(userId);
  return successResponse({ goals }, 200);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const userId = await resolveUserId(req);
  const body = await req.json();
  const validated = CreateGoalSchema.parse(body);

  if (validated.action === 'CONTRIBUTE') {
    if (!validated.goalId || !validated.amount) {
      throw new Error('goalId and amount are required for contribution.');
    }
    const result = await SmartSavingsGoalsService.contributeToGoal(userId, validated.goalId, validated.amount);
    return successResponse(result, 200);
  }

  if (validated.action === 'DELETE') {
    if (!validated.goalId) throw new Error('goalId is required for deletion.');
    const result = await SmartSavingsGoalsService.deleteGoal(userId, validated.goalId);
    return successResponse(result, 200);
  }

  if (!validated.title || !validated.targetAmount || !validated.targetDate) {
    throw new Error('title, targetAmount, and targetDate are required to create a goal.');
  }

  const created = await SmartSavingsGoalsService.createGoal(userId, {
    title: validated.title,
    targetAmount: validated.targetAmount,
    initialDeposit: validated.initialDeposit,
    currency: validated.currency,
    category: validated.category || 'EMERGENCY_FUND',
    targetDate: validated.targetDate,
    autoSaveFrequency: validated.autoSaveFrequency,
    autoSaveAmount: validated.autoSaveAmount,
  });

  return successResponse({ goal: created }, 201);
});
