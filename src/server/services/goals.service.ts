// ==============================================================================
// VALIXEN SMART SAVINGS GOALS SERVICE
// High-Yield Automated Wealth Target Engine & Milestone Velocity Analytics
// ==============================================================================

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { ValidationError, NotFoundError } from '@/lib/api/errors';

export interface CreateGoalInput {
  title: string;
  targetAmount: number;
  initialDeposit?: number;
  currency?: string;
  category: string;
  targetDate: string;
  autoSaveFrequency?: string;
  autoSaveAmount?: number;
}

export interface SavingsGoalDTO {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  category: string;
  targetDate: string;
  daysRemaining: number;
  autoSaveFrequency: string;
  autoSaveAmount: number;
  progressPercent: number;
  isReached: boolean;
  velocityStatus: 'AHEAD_OF_SCHEDULE' | 'ON_TRACK' | 'BEHIND_PACE' | 'GOAL_ACHIEVED';
  suggestedMonthlyPace: number;
  createdAt: string;
}

export class SmartSavingsGoalsService {
  /**
   * Retrieves all goals with dynamic velocity modeling
   */
  public static async getUserGoals(userId: string): Promise<SavingsGoalDTO[]> {
    const goals = await (db as any).savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();

    return goals.map((g) => {
      const target = Number(g.targetAmount);
      const current = Number(g.currentAmount);
      const progressPercent = target > 0 ? Number(Math.min((current / target) * 100, 100).toFixed(1)) : 0;
      const targetDate = new Date(g.targetDate);
      const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      const monthsRemaining = Math.max(1, daysRemaining / 30);
      const remainingAmount = Math.max(0, target - current);
      const suggestedMonthlyPace = Number((remainingAmount / monthsRemaining).toFixed(2));

      let velocityStatus: SavingsGoalDTO['velocityStatus'] = 'ON_TRACK';
      if (current >= target) {
        velocityStatus = 'GOAL_ACHIEVED';
      } else if (g.autoSaveAmount && Number(g.autoSaveAmount) * monthsRemaining >= remainingAmount) {
        velocityStatus = 'AHEAD_OF_SCHEDULE';
      } else if (daysRemaining < 30 && progressPercent < 70) {
        velocityStatus = 'BEHIND_PACE';
      }

      return {
        id: g.id,
        title: g.title,
        targetAmount: target,
        currentAmount: current,
        currency: g.currency,
        category: g.category,
        targetDate: g.targetDate.toISOString().slice(0, 10),
        daysRemaining,
        autoSaveFrequency: g.autoSaveFrequency,
        autoSaveAmount: Number(g.autoSaveAmount),
        progressPercent,
        isReached: g.isReached || current >= target,
        velocityStatus,
        suggestedMonthlyPace,
        createdAt: g.createdAt.toISOString(),
      };
    });
  }

  /**
   * Creates a new sovereign savings goal
   */
  public static async createGoal(userId: string, input: CreateGoalInput): Promise<SavingsGoalDTO> {
    if (!input.title || input.title.trim().length < 2) {
      throw new ValidationError('Goal title must be at least 2 characters.');
    }
    if (input.targetAmount <= 0) {
      throw new ValidationError('Target amount must be greater than zero.');
    }

    const targetDate = new Date(input.targetDate);
    if (isNaN(targetDate.getTime()) || targetDate <= new Date()) {
      throw new ValidationError('Target date must be a valid future date.');
    }

    const initial = input.initialDeposit && input.initialDeposit > 0 ? input.initialDeposit : 0;

    const created = await (db as any).savingsGoal.create({
      data: {
        userId,
        title: input.title.trim(),
        targetAmount: new Prisma.Decimal(input.targetAmount),
        currentAmount: new Prisma.Decimal(initial),
        currency: input.currency || 'USD',
        category: input.category || 'EMERGENCY_FUND',
        targetDate,
        autoSaveFrequency: input.autoSaveFrequency || 'MONTHLY',
        autoSaveAmount: new Prisma.Decimal(input.autoSaveAmount || 0),
        isReached: initial >= input.targetAmount,
      },
    });

    const list = await this.getUserGoals(userId);
    const found = list.find((g) => g.id === created.id);
    return found || list[0];
  }

  /**
   * Contributes capital toward a savings goal
   */
  public static async contributeToGoal(userId: string, goalId: string, amount: number) {
    if (amount <= 0) throw new ValidationError('Contribution amount must be greater than zero.');

    const goal = await (db as any).savingsGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) throw new NotFoundError('Savings goal not found.');

    const currentNum = Number(goal.currentAmount);
    const targetNum = Number(goal.targetAmount);
    const nextAmount = currentNum + amount;
    const isReached = nextAmount >= targetNum;

    const updated = await (db as any).savingsGoal.update({
      where: { id: goal.id },
      data: {
        currentAmount: new Prisma.Decimal(nextAmount),
        isReached,
        reachedAt: isReached && !goal.isReached ? new Date() : goal.reachedAt,
      },
    });

    return {
      success: true,
      goalId: updated.id,
      newBalance: Number(updated.currentAmount),
      isReached: updated.isReached,
    };
  }

  /**
   * Deletes a savings goal
   */
  public static async deleteGoal(userId: string, goalId: string) {
    const goal = await (db as any).savingsGoal.findFirst({
      where: { id: goalId, userId },
    });
    if (!goal) throw new NotFoundError('Savings goal not found.');

    await (db as any).savingsGoal.delete({ where: { id: goal.id } });
    return { success: true };
  }
}
