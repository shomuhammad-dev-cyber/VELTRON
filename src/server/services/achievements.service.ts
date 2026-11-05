// ==============================================================================
// VALIXEN ACHIEVEMENT SYSTEM SERVICE
// Institutional Progression, Gamified Mastery Badges & XP Level Architecture
// ==============================================================================

import { db } from '@/lib/db';

export interface AchievementItemDTO {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'TRADING' | 'SAVING' | 'EDUCATION' | 'SECURITY' | 'COMMUNITY';
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  icon: string;
  xpReward: number;
  currentProgress: number;
  targetValue: number;
  progressPercent: number;
  isUnlocked: boolean;
  unlockedAt?: string | null;
}

export interface UserProgressionOverview {
  userLevel: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  levelProgressPercent: number;
  totalUnlockedCount: number;
  totalAchievementsCount: number;
  achievements: AchievementItemDTO[];
}

export const CATALOG_ACHIEVEMENTS: Omit<AchievementItemDTO, 'id' | 'currentProgress' | 'progressPercent' | 'isUnlocked' | 'unlockedAt'>[] = [
  {
    code: 'FIRST_VIRTUAL_ORDER',
    title: 'First Quantum Execution',
    description: 'Place your first realistic order in the paper trading simulator with zero risk.',
    category: 'TRADING',
    tier: 'BRONZE',
    icon: 'TrendingUp',
    xpReward: 100,
    targetValue: 1,
  },
  {
    code: 'DIVERSIFIED_HEDGER',
    title: 'Multi-Asset Hedger',
    description: 'Maintain active positions across at least 3 distinct asset classes simultaneously.',
    category: 'TRADING',
    tier: 'SILVER',
    icon: 'Layers',
    xpReward: 250,
    targetValue: 3,
  },
  {
    code: 'SIX_FIGURE_PORTFOLIO',
    title: 'Centurion Virtual Allocator',
    description: 'Grow your virtual trading portfolio value to $110,000.00 or higher (+10% return).',
    category: 'TRADING',
    tier: 'GOLD',
    icon: 'DollarSign',
    xpReward: 500,
    targetValue: 110000,
  },
  {
    code: 'SMART_GOAL_ACHIEVER',
    title: 'Wealth Horizon Achiever',
    description: 'Create and fully fund your first Smart Savings Goal to 100% completion.',
    category: 'SAVING',
    tier: 'GOLD',
    icon: 'Target',
    xpReward: 400,
    targetValue: 1,
  },
  {
    code: 'ACADEMY_SCHOLAR',
    title: 'Quantitative Scholar',
    description: 'Complete 3 comprehensive courses in the Financial Academy with verified quiz scores.',
    category: 'EDUCATION',
    tier: 'SILVER',
    icon: 'GraduationCap',
    xpReward: 300,
    targetValue: 3,
  },
  {
    code: 'CYBER_FORTRESS',
    title: 'Cybersecurity Citadel',
    description: 'Verify your identity security posture, enable Argon2id passkeys, and inspect SOC telemetry.',
    category: 'SECURITY',
    tier: 'PLATINUM',
    icon: 'ShieldCheck',
    xpReward: 750,
    targetValue: 1,
  },
  {
    code: 'COMMUNITY_THOUGHT_LEADER',
    title: 'Verified Market Voice',
    description: 'Publish your first research dispatch or receive 25+ upvotes from verified community peers.',
    category: 'COMMUNITY',
    tier: 'DIAMOND',
    icon: 'Sparkles',
    xpReward: 1000,
    targetValue: 25,
  },
];

export class AchievementsService {
  /**
   * Calculates overall user gamification level and achievement statuses
   */
  public static async getUserProgression(userId: string): Promise<UserProgressionOverview> {
    const list: AchievementItemDTO[] = CATALOG_ACHIEVEMENTS.map((a, idx) => {
      // Deterministic demo unlocks reflecting user activity
      const isUnlocked = idx <= 2;
      const currentProgress = isUnlocked ? a.targetValue : Math.round(a.targetValue * 0.4);
      const progressPercent = isUnlocked ? 100 : Math.round((currentProgress / a.targetValue) * 100);

      return {
        ...a,
        id: `ach-${idx + 1}`,
        currentProgress,
        progressPercent,
        isUnlocked,
        unlockedAt: isUnlocked ? new Date(Date.now() - (idx + 1) * 86400000).toISOString() : null,
      };
    });

    const totalXp = list
      .filter((a) => a.isUnlocked)
      .reduce((acc, curr) => acc + curr.xpReward, 450); // Baseline XP

    // Level curve: 500 XP per level
    const userLevel = Math.max(1, Math.floor(totalXp / 500) + 1);
    const currentLevelBaseXp = (userLevel - 1) * 500;
    const nextLevelXp = userLevel * 500;
    const xpInCurrentLevel = totalXp - currentLevelBaseXp;
    const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 500) * 100));

    const titles = ['Explorer Novice', 'Apprentice Allocator', 'Strategic Trader', 'Sovereign Quant', 'Institutional Titan'];
    const levelTitle = titles[Math.min(userLevel - 1, titles.length - 1)];

    return {
      userLevel,
      levelTitle,
      currentXp: totalXp,
      nextLevelXp,
      levelProgressPercent,
      totalUnlockedCount: list.filter((a) => a.isUnlocked).length,
      totalAchievementsCount: list.length,
      achievements: list,
    };
  }
}
