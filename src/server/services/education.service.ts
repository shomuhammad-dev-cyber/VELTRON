// ==============================================================================
// VALIXEN FINANCIAL EDUCATION & ACADEMY SERVICE
// Interactive Lessons, Verified Curriculum, Quizzes & Progress Tracking
// ==============================================================================

import { db } from '@/lib/db';
import { NotFoundError, ValidationError } from '@/lib/api/errors';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonDetail {
  id: string;
  order: number;
  title: string;
  duration: string;
  content: string;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  isCompleted?: boolean;
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  xpReward: number;
  icon: string;
  lessonsCount: number;
  completedLessonsCount: number;
  progressPercent: number;
  isCompleted: boolean;
  lessons: LessonDetail[];
}

// Built-in Institutional Curriculum
const DEFAULT_COURSES: CourseDetail[] = [
  {
    id: 'course-banking-fundamentals',
    slug: 'banking-fundamentals',
    title: 'Modern Banking & Liquidity Architecture',
    description: 'Master the mechanics of modern digital banking, clearing houses, settlement networks, and liquid vault custody.',
    category: 'BANKING_FUNDAMENTALS',
    level: 'BEGINNER',
    duration: '35 min',
    xpReward: 150,
    icon: 'Landmark',
    lessonsCount: 3,
    completedLessonsCount: 0,
    progressPercent: 0,
    isCompleted: false,
    lessons: [
      {
        id: 'lesson-bf-1',
        order: 1,
        title: 'How Central Banks & Interbank Settlements Function',
        duration: '10 min',
        content: `Commercial banking relies on a dual-tier monetary architecture. Central banks—such as the Central Bank of Uzbekistan (CBU), the Federal Reserve, and the European Central Bank—issue base reserves (M0), while licensed commercial banks provision deposit credit (M1/M2).

When you transfer funds between institutions, transactions settle through domestic automated clearing houses (ACH), real-time gross settlement systems (RTGS), or international messaging backbones like SWIFT. Understanding clearing velocity and counterparty risk is fundamental to institutional treasury management.`,
        keyTakeaways: [
          'Central bank base money (reserves) underpins commercial bank liquidity.',
          'RTGS systems settle transactions individually and immediately with zero settlement risk.',
          'Clearing velocity determines how quickly liquidity becomes available for redeployment.',
        ],
        quiz: [
          {
            id: 'q-bf-1-1',
            question: 'What distinguishes Real-Time Gross Settlement (RTGS) from batch ACH clearing?',
            options: [
              'RTGS batches transactions once every 24 hours',
              'RTGS settles transactions individually and immediately with instant finality',
              'RTGS is exclusively used for consumer credit cards',
              'RTGS requires high-risk leveraged margins',
            ],
            correctIndex: 1,
            explanation: 'RTGS processes and finalizes transfers individually on a gross basis without netting, ensuring instant and immutable settlement.',
          },
        ],
      },
      {
        id: 'lesson-bf-2',
        order: 2,
        title: 'Liquidity Pools, Reserve Ratios & Capital Buffers',
        duration: '12 min',
        content: `Under modern Basel III accords and Central Bank prudential regulations, financial institutions must maintain robust Liquidity Coverage Ratios (LCR) and Net Stable Funding Ratios (NSFR).

For personal and corporate wealth, liquidity refers to the immediacy with which an asset can be converted into sovereign legal tender without causing a material price impact. Cash, treasury bills, and high-yield vaults represent tier-1 liquidity.`,
        keyTakeaways: [
          'Liquidity represents the velocity and zero-haircut convertibility of an asset.',
          'Capital buffers protect against unexpected withdrawal shocks or market contractions.',
          'High-Yield Vaults provide yield while retaining near-instantaneous redemption windows.',
        ],
        quiz: [
          {
            id: 'q-bf-2-1',
            question: 'Why is liquidity runway considered the foundation of financial health?',
            options: [
              'It guarantees 100% investment profits in bear markets',
              'It allows an entity to service obligations without being forced to liquidate assets at distressed prices',
              'It permanently eliminates the need for budgeting',
              'It replaces sovereign currency with debt instruments',
            ],
            correctIndex: 1,
            explanation: 'An adequate liquidity runway shields your portfolio from forced asset liquidations during macroeconomic downturns.',
          },
        ],
      },
      {
        id: 'lesson-bf-3',
        order: 3,
        title: 'Open Banking APIs & Cryptographic Tokenization',
        duration: '13 min',
        content: `Modern FinTech platforms like VALIXEN leverage Open Banking APIs (such as Plaid or regional banking protocols) to securely sync financial telemetry.

Crucially, zero raw payment credentials (CVV, CVC, or PIN) are ever stored. Secure payment vaults utilize asymmetric tokenization (e.g. Stripe Vault tokens), replacing 16-digit PANs with surrogate cryptographic reference hashes.`,
        keyTakeaways: [
          'PCI-DSS Level 1 compliance strictly prohibits the storage of card CVV/CVC and PINs.',
          'Tokenization substitutes raw account credentials with non-reversible surrogate tokens.',
          'Read-only OAuth scopes ensure platforms cannot initiate unconfirmed transactions.',
        ],
        quiz: [
          {
            id: 'q-bf-3-1',
            question: 'Under PCI-DSS standards, which data point is STRICTLY prohibited from being stored after authorization?',
            options: [
              'Account Holder Full Name',
              'Card Expiration Year',
              'Card Verification Value (CVV / CVC) and PIN',
              'Masked Card Last 4 Digits',
            ],
            correctIndex: 2,
            explanation: 'PCI-DSS strictly prohibits the persistence of Card Verification Values (CVV/CVC) and personal identification numbers (PIN) under any circumstances.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-budgeting-mastery',
    slug: 'budgeting-mastery',
    title: 'Algorithmic Budgeting & Cash Flow Control',
    description: 'Implement mathematically grounded personal cash flow budgeting, the 50/30/20 prudence framework, and burn-rate reduction.',
    category: 'BUDGETING',
    level: 'BEGINNER',
    duration: '30 min',
    xpReward: 120,
    icon: 'PieChart',
    lessonsCount: 2,
    completedLessonsCount: 0,
    progressPercent: 0,
    isCompleted: false,
    lessons: [
      {
        id: 'lesson-bm-1',
        order: 1,
        title: 'The 50/30/20 Prudence Framework Explained',
        duration: '14 min',
        content: `The 50/30/20 framework categorizes all after-tax inflows into three disciplined allocations:
1. 50% Essential Needs: Housing, core utilities, baseline sustenance, and mandatory obligations.
2. 30% Discretionary Outlays: Lifestyle enhancements, subscriptions, and optional technology.
3. 20% Capital Preservation & Wealth Accumulation: Compounding in high-yield vaults, debt liquidation, and long-term asset allocation.

Disciplined adherents preserve cash flow surplus and withstand inflationary shocks.`,
        keyTakeaways: [
          'Needs must never exceed 50% of recurring net monthly revenue.',
          'A minimum of 20% should be routed automatically to wealth-compounding vehicles.',
          'Tracking category percentages exposes recurring subscription leakages.',
        ],
        quiz: [
          {
            id: 'q-bm-1-1',
            question: 'If your monthly net revenue is $10,000, how much should be allocated to wealth accumulation under 50/30/20?',
            options: ['$1,000 (10%)', '$2,000 (20%)', '$3,000 (30%)', '$5,000 (50%)'],
            correctIndex: 1,
            explanation: 'Under the 50/30/20 rule, exactly 20% ($2,000 of $10,000) is allocated to capital preservation, high-yield vaults, and investments.',
          },
        ],
      },
      {
        id: 'lesson-bm-2',
        order: 2,
        title: 'Zero-Based Budgeting & Monthly Burn-Rate Optimization',
        duration: '16 min',
        content: `Zero-based budgeting allocates every sovereign dollar of income to a purposeful category before the calendar month begins (Income - Allocations = $0).

Optimizing burn rate involves auditing fixed recurring subscriptions, negotiating service contracts, and eliminating unnecessary platform fees.`,
        keyTakeaways: [
          'In zero-based budgeting, income minus total allocations equals zero.',
          'Burn rate measures the speed at which liquid capital is consumed by expenses.',
          'Reducing fixed monthly overhead dramatically extends your financial runway.',
        ],
        quiz: [
          {
            id: 'q-bm-2-1',
            question: 'What is the primary operational objective of calculating your monthly burn rate?',
            options: [
              'To eliminate all liquid cash reserves',
              'To determine your exact liquidity runway and identify discretionary expenditure leaks',
              'To calculate cryptocurrency gas fees',
              'To guarantee double-digit stock returns',
            ],
            correctIndex: 1,
            explanation: 'Monitoring your burn rate quantifies how long current liquid reserves can sustain your lifestyle and highlights cost optimization targets.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-cryptocurrency-fundamentals',
    slug: 'cryptocurrency-fundamentals',
    title: 'Cryptocurrency Foundations & Blockchain Consensus',
    description: 'Explore cryptographic ledgers, Proof-of-Work vs Proof-of-Stake, private key security, and digital asset valuation.',
    category: 'CRYPTOCURRENCY',
    level: 'INTERMEDIATE',
    duration: '40 min',
    xpReward: 200,
    icon: 'Coins',
    lessonsCount: 2,
    completedLessonsCount: 0,
    progressPercent: 0,
    isCompleted: false,
    lessons: [
      {
        id: 'lesson-cf-1',
        order: 1,
        title: 'Public-Key Cryptography, Wallets & Non-Custodial Security',
        duration: '18 min',
        content: `Cryptocurrencies use asymmetric elliptic curve cryptography. A private key mathematically derives a public key, which in turn generates an address.

"Not your keys, not your coins": When holding assets on custodial platforms, the third party controls private keys. In non-custodial cold storage, the owner possesses absolute, unseizable cryptographic ownership.`,
        keyTakeaways: [
          'Private keys must NEVER be shared, photographed, or stored in plaintext online.',
          'Public keys derive destination addresses that can safely be shared to receive funds.',
          'Cold storage hardware wallets keep private key signing isolated from internet-connected devices.',
        ],
        quiz: [
          {
            id: 'q-cf-1-1',
            question: 'What is the function of a cryptographic private key in blockchain networks?',
            options: [
              'It serves as a public bank routing number visible to everyone',
              'It signs transactions and authorizes transfers of funds belonging to the derived address',
              'It guarantees zero price volatility on exchanges',
              'It automatically cancels failed bank transfers',
            ],
            correctIndex: 1,
            explanation: 'The private key is the secret cryptographic key used to create digital signatures that authorize ownership transfers on-chain.',
          },
        ],
      },
      {
        id: 'lesson-cf-2',
        order: 2,
        title: 'Bitcoin Halving Cycles, Monetary Policy & Market Structure',
        duration: '22 min',
        content: `Bitcoin features a deterministic, programmatic monetary policy with a strict ceiling of 21,000,000 BTC. Approximately every 210,000 blocks (roughly 4 years), block subsidy rewards are halved.

Understanding supply issuance, orderbook depth, spot vs perpetual futures, and institutional ETF flows is vital to analyzing digital asset market volatility.`,
        keyTakeaways: [
          'Bitcoin has an immutable hard cap of 21 million units.',
          'Halvings reduce new block subsidy supply issuance by 50% every 210,000 blocks.',
          'Market pricing is driven by orderbook liquidity, spot demand, and derivatives funding rates.',
        ],
        quiz: [
          {
            id: 'q-cf-2-1',
            question: 'What is the hard-coded maximum supply limit of Bitcoin?',
            options: ['100,000,000 BTC', '21,000,000 BTC', 'Unlimited with annual 2% inflation', '1,000,000,000 BTC'],
            correctIndex: 1,
            explanation: 'The Bitcoin protocol specifies an immutable maximum supply of 21 million BTC, enforce by global distributed node consensus.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-investment-fundamentals',
    slug: 'investment-fundamentals',
    title: 'Investment Prudence & Portfolio Theory',
    description: 'Learn Modern Portfolio Theory, asset diversification, risk-adjusted returns (Sharpe ratio), and compound growth.',
    category: 'INVESTMENT',
    level: 'INTERMEDIATE',
    duration: '35 min',
    xpReward: 180,
    icon: 'TrendingUp',
    lessonsCount: 2,
    completedLessonsCount: 0,
    progressPercent: 0,
    isCompleted: false,
    lessons: [
      {
        id: 'lesson-if-1',
        order: 1,
        title: 'Diversification, Correlation & Modern Portfolio Theory',
        duration: '17 min',
        content: `Nobel laureate Harry Markowitz established Modern Portfolio Theory (MPT), proving that combining assets with low or negative correlation maximizes expected returns for a given level of risk (the "Efficient Frontier").

Allocating across sovereign currency, high-yield vaults, equities, and commodities shields capital from single-sector collapse.`,
        keyTakeaways: [
          'Diversification reduces unsystematic (asset-specific) risk without sacrificing expected return.',
          'Assets with low correlation do not move in tandem during macroeconomic stress.',
          'The Sharpe ratio measures excess return per unit of volatility.',
        ],
        quiz: [
          {
            id: 'q-if-1-1',
            question: 'What is the primary benefit of holding non-correlated assets in an investment portfolio?',
            options: [
              'It guarantees zero taxes on dividends',
              'It lowers overall portfolio volatility while preserving expected returns',
              'It doubles transaction leverage automatically',
              'It fixes currency exchange rates forever',
            ],
            correctIndex: 1,
            explanation: 'Combining non-correlated assets dampens portfolio drawdowns because performance variances offset one another across different market cycles.',
          },
        ],
      },
      {
        id: 'lesson-if-2',
        order: 2,
        title: 'Compound Interest & Dollar-Cost Averaging (DCA)',
        duration: '18 min',
        content: `Compound interest is the exponential process where earnings generate their own earnings over time ($A = P(1 + r/n)^{nt}$).

Dollar-Cost Averaging (DCA) is the systematic strategy of investing a fixed monetary amount at regular intervals, neutralizing emotional market-timing risks.`,
        keyTakeaways: [
          'Compound interest accelerates exponentially with time and consistent contributions.',
          'DCA buys more units when prices decline and fewer units when prices surge.',
          'Systematic consistency outperforms emotional market-timing attempts over long horizons.',
        ],
        quiz: [
          {
            id: 'q-if-2-1',
            question: 'How does Dollar-Cost Averaging (DCA) mitigate market timing risk?',
            options: [
              'By predicting daily market tops and bottoms with AI certainty',
              'By investing fixed monetary amounts at disciplined recurring intervals regardless of price',
              'By trading only during weekend exchange hours',
              'By utilizing 100x leverage on all trades',
            ],
            correctIndex: 1,
            explanation: 'DCA neutralizes timing bias by automatically acquiring assets across varying price levels on a disciplined schedule.',
          },
        ],
      },
    ],
  },
];

export class EducationService {
  /**
   * Retrieves all available courses with user-specific completion progress
   */
  public static async getAllCourses(userId: string): Promise<CourseDetail[]> {
    // 1. Fetch user progress records from DB
    const userProgressList = await (db as any).userCourseProgress.findMany({
      where: { userId },
    }).catch(() => []);

    const progressMap = new Map<string, { completedLessons: string[]; isCompleted: boolean }>();
    for (const p of userProgressList) {
      progressMap.set(p.courseId, {
        completedLessons: (p.completedLessonsJson as string[]) || [],
        isCompleted: p.isCompleted,
      });
    }

    // 2. Map and decorate default curriculum
    return DEFAULT_COURSES.map((course) => {
      const userProg = progressMap.get(course.id) || progressMap.get(course.slug);
      const completedLessons = userProg?.completedLessons || [];
      const completedCount = completedLessons.length;
      const progressPercent = Math.min(
        Math.round((completedCount / course.lessonsCount) * 100),
        100
      );

      return {
        ...course,
        completedLessonsCount: completedCount,
        progressPercent,
        isCompleted: userProg?.isCompleted || progressPercent === 100,
        lessons: course.lessons.map((lesson) => ({
          ...lesson,
          isCompleted: completedLessons.includes(lesson.id),
        })),
      };
    });
  }

  /**
   * Retrieves a course by slug with full lesson text, takeaways and quizzes
   */
  public static async getCourseBySlug(slug: string, userId: string): Promise<CourseDetail | null> {
    const course = DEFAULT_COURSES.find((c) => c.slug === slug);
    if (!course) return null;

    const userProg = await (db as any).userCourseProgress.findFirst({
      where: {
        userId,
        OR: [{ courseId: course.id }, { courseId: course.slug }],
      },
    }).catch(() => null);

    const completedLessons = (userProg?.completedLessonsJson as string[]) || [];
    const completedCount = completedLessons.length;
    const progressPercent = Math.min(
      Math.round((completedCount / course.lessonsCount) * 100),
      100
    );

    return {
      ...course,
      completedLessonsCount: completedCount,
      progressPercent,
      isCompleted: userProg?.isCompleted || progressPercent === 100,
      lessons: course.lessons.map((l) => ({
        ...l,
        isCompleted: completedLessons.includes(l.id),
      })),
    };
  }

  /**
   * Submits a quiz answer for a lesson, updates progress, and checks completion
   */
  public static async submitLessonQuiz(
    userId: string,
    courseSlug: string,
    lessonId: string,
    selectedOptionIndex: number
  ): Promise<{
    isCorrect: boolean;
    explanation: string;
    courseProgressPercent: number;
    courseCompleted: boolean;
    xpEarned: number;
  }> {
    const course = DEFAULT_COURSES.find((c) => c.slug === courseSlug);
    if (!course) throw new NotFoundError('Course not found.');

    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (!lesson) throw new NotFoundError('Lesson not found.');

    const question = lesson.quiz[0];
    if (!question) throw new ValidationError('This lesson has no quiz.');

    const isCorrect = selectedOptionIndex === question.correctIndex;

    // Fetch existing user progress
    let userProg = await (db as any).userCourseProgress.findFirst({
      where: {
        userId,
        OR: [{ courseId: course.id }, { courseId: course.slug }],
      },
    }).catch(() => null);

    const completedLessons: string[] = userProg ? (userProg.completedLessonsJson as string[]) || [] : [];

    if (isCorrect && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const courseCompleted = completedLessons.length >= course.lessonsCount;
    const progressPercent = Math.min(
      Math.round((completedLessons.length / course.lessonsCount) * 100),
      100
    );

    if (userProg) {
      await (db as any).userCourseProgress.update({
        where: { id: userProg.id },
        data: {
          completedLessonsJson: completedLessons,
          isCompleted: courseCompleted,
          completedAt: courseCompleted ? new Date() : undefined,
          updatedAt: new Date(),
        },
      });
    } else {
      await (db as any).userCourseProgress.create({
        data: {
          userId,
          courseId: course.id,
          completedLessonsJson: completedLessons,
          isCompleted: courseCompleted,
          completedAt: courseCompleted ? new Date() : null,
          updatedAt: new Date(),
        },
      });
    }

    return {
      isCorrect,
      explanation: question.explanation,
      courseProgressPercent: progressPercent,
      courseCompleted,
      xpEarned: isCorrect ? Math.round(course.xpReward / course.lessonsCount) : 0,
    };
  }
}
