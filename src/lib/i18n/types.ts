// ==============================================================================
// VELTRON 4-LANGUAGE INTERNATIONALIZATION (i18n) TYPE DEFINITIONS
// Supported: O'zbekcha (uz), Русский (ru), English (en), العربية (ar - RTL)
// ==============================================================================

export type Locale = 'uz' | 'ru' | 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface LanguageInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir: Direction;
}

export const SUPPORTED_LANGUAGES: Record<Locale, LanguageInfo> = {
  uz: {
    code: 'uz',
    name: 'Uzbek',
    nativeName: "O‘zbekcha",
    flag: '🇺🇿',
    dir: 'ltr',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
  },
};

export const DEFAULT_LOCALE: Locale = 'uz';

export interface TranslationDictionary {
  nav: {
    dashboard: string;
    markets: string;
    trading: string;
    wallet: string;
    transactions: string;
    aiAssistant: string;
    academy: string;
    ranking: string;
    community: string;
    admin: string;
    settings: string;
    signIn: string;
    signOut: string;
    telegramTma: string;
    statusOnline: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    badge: string;
    startTrading: string;
    viewDemo: string;
    enterDashboard: string;
    exploreTrading: string;
    chronometerMovement: string;
    precisionFinance: string;
    watchSceneTag: string;
    leatherCraftTitle: string;
    leatherCraftDesc: string;
    featuresTitle: string;
    featuresSubtitle: string;
    soundOn: string;
    soundOff: string;
    sceneLabels: Record<string, string>;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    continueWithGoogle: string;
    orEmail: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    rememberMe: string;
    forgotPassword: string;
    loginButton: string;
    registerButton: string;
    noAccount: string;
    haveAccount: string;
    createAccount: string;
    securityNotice: string;
    invalidCredentials: string;
    networkError: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    virtualBalance: string;
    totalAssets: string;
    monthlyIncome: string;
    monthlyExpenses: string;
    savingsRate: string;
    netPosition: string;
    financialHealth: string;
    healthRating: string;
    recentTransactions: string;
    marketOverview: string;
    savingsGoals: string;
    quickActions: string;
    deposit: string;
    transfer: string;
    connectAccount: string;
    exportAudit: string;
    emptyStateTitle: string;
    emptyStateDesc: string;
    getStartedButton: string;
  };
  wallet: {
    title: string;
    subtitle: string;
    sandboxNotice: string;
    addCardButton: string;
    cardName: string;
    cardType: string;
    cardNumber: string;
    balance: string;
    deleteCard: string;
    activeCards: string;
    noCardsTitle: string;
    noCardsDesc: string;
    securityGuarantee: string;
    zeroCvvNotice: string;
    depositFunds: string;
    spendingBreakdown: string;
  };
  trading: {
    title: string;
    subtitle: string;
    sandboxWarning: string;
    startingBalanceNotice: string;
    orderTicket: string;
    buy: string;
    sell: string;
    marketOrder: string;
    limitOrder: string;
    quantity: string;
    price: string;
    totalCost: string;
    placeOrder: string;
    openPositions: string;
    closedPositions: string;
    orderHistory: string;
    noPositions: string;
    virtualPortfolio: string;
    resetSimulator: string;
    resetConfirm: string;
    unrealizedPnl: string;
    realizedPnl: string;
  };
  aiAssistant: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    placeholder?: string;
    conversations?: string;
    loadingHistory?: string;
    noHistory?: string;
    deleteSession?: string;
    disclaimer: string;
    newChat: string;
    neuralCoreOnline: string;
    zeroPinSecurity: string;
    suggestionsTitle: string;
    promptSpending: string;
    promptBtc: string;
    promptCbu: string;
    promptBudget: string;
    promptDeposit: string;
    promptPortfolio: string;
  };
  education: {
    title: string;
    subtitle: string;
    allCourses: string;
    beginner: string;
    advanced: string;
    quizzes: string;
    xpEarned: string;
    lessons: string;
    startCourse: string;
    continueLearning: string;
    completed: string;
  };
  ranking: {
    title: string;
    subtitle: string;
    rank: string;
    user: string;
    xpPoints: string;
    completedCourses: string;
    quizAccuracy: string;
    streakDays: string;
    meritNotice: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    close: string;
    confirm: string;
    delete: string;
    search: string;
    filter: string;
    all: string;
    viewDetails: string;
    copied: string;
    copy: string;
    success: string;
    error: string;
    retry: string;
    active: string;
    completed: string;
    pending: string;
    live: string;
  };
}
