// ==============================================================================
// VALIXEN DOMAIN DATABASE MODELS & SCHEMA ENUMS
// Aligned with prisma/schema.prisma for enterprise type safety
// ==============================================================================

export enum UserRole {
  USER = 'USER',
  TRADER = 'TRADER',
  VIP_CLIENT = 'VIP_CLIENT',
  INSTITUTIONAL = 'INSTITUTIONAL',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

export enum KycStatus {
  UNVERIFIED = 'UNVERIFIED',
  TIER_1_PENDING = 'TIER_1_PENDING',
  TIER_1_VERIFIED = 'TIER_1_VERIFIED',
  TIER_2_VERIFIED = 'TIER_2_VERIFIED',
  REJECTED = 'REJECTED',
}

export enum AccountType {
  SMART_CHECKING = 'SMART_CHECKING',
  HIGH_YIELD_VAULT = 'HIGH_YIELD_VAULT',
  CRYPTO_CUSTODY_WALLET = 'CRYPTO_CUSTODY_WALLET',
  MARGIN_TRADING = 'MARGIN_TRADING',
  VIRTUAL_SIMULATION = 'VIRTUAL_SIMULATION',
  CONNECTED_BANK = 'CONNECTED_BANK',
  CONNECTED_CARD = 'CONNECTED_CARD',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  SUSPENDED = 'SUSPENDED',
  RESTRICTED = 'RESTRICTED',
  CLOSED = 'CLOSED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER_INTERNAL = 'TRANSFER_INTERNAL',
  CRYPTO_SWAP = 'CRYPTO_SWAP',
  VIRTUAL_TRADE = 'VIRTUAL_TRADE',
  DIVIDEND_PAYOUT = 'DIVIDEND_PAYOUT',
  FEE = 'FEE',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REVERSED = 'REVERSED',
}

export enum AssetClass {
  CRYPTO = 'CRYPTO',
  EQUITY = 'EQUITY',
  COMMODITY = 'COMMODITY',
  FOREX = 'FOREX',
  INDEX = 'INDEX',
  FIXED_INCOME = 'FIXED_INCOME',
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum TradeOrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP_MARKET = 'STOP_MARKET',
  STOP_LIMIT = 'STOP_LIMIT',
  TRAILING_STOP = 'TRAILING_STOP',
}

export enum TradeStatus {
  PENDING = 'PENDING',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum SubTier {
  FREE_STARTER = 'FREE_STARTER',
  QUANT_PRO = 'QUANT_PRO',
  INSTITUTIONAL_ELITE = 'INSTITUTIONAL_ELITE',
}

export enum AuditAction {
  USER_REGISTER = 'USER_REGISTER',
  USER_LOGIN = 'USER_LOGIN',
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  FUNDS_DEPOSITED = 'FUNDS_DEPOSITED',
  FUNDS_WITHDRAWN = 'FUNDS_WITHDRAWN',
  TRANSFER_EXECUTED = 'TRANSFER_EXECUTED',
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_FILLED = 'ORDER_FILLED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  KYC_SUBMITTED = 'KYC_SUBMITTED',
  API_KEY_GENERATED = 'API_KEY_GENERATED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
}

export enum NotificationType {
  TRADE_EXECUTION = 'TRADE_EXECUTION',
  SECURITY_ALERT = 'SECURITY_ALERT',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  PRICE_TRIGGER = 'PRICE_TRIGGER',
  KYC_STATUS_UPDATE = 'KYC_STATUS_UPDATE',
}

export interface User {
  id: string;
  email: string;
  passwordHash?: string | null;
  role: UserRole;
  kycStatus: KycStatus;
  emailVerified?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  isValid: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface PasswordResetToken {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  country?: string | null;
  phone?: string | null;
  twoFactorEnabled: boolean;
}

export interface FinancialAccount {
  id: string;
  userId: string;
  accountNumber: string;
  type: AccountType;
  currency: string;
  balance: number;
  availableBalance: number;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  referenceId: string;
  sourceAccountId?: string | null;
  destinationAccountId?: string | null;
  amount: number;
  currency: string;
  fee: number;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  isVirtual: boolean;
  totalValue: number;
  cashBalance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  holdings?: PortfolioHolding[];
}

export interface PortfolioHolding {
  id: string;
  portfolioId: string;
  symbol: string;
  assetClass: AssetClass;
  quantity: number;
  averageCostBasis: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  lastUpdated: Date;
}

export interface VirtualTrade {
  id: string;
  portfolioId: string;
  symbol: string;
  assetClass: AssetClass;
  type: TradeType;
  quantity: number;
  price: number;
  totalCost: number;
  fee: number;
  status: TradeStatus;
  notes?: string | null;
  executedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  action: AuditAction;
  ipAddress?: string | null;
  userAgent?: string | null;
  resourceEntity?: string | null;
  resourceId?: string | null;
  detailsJson?: unknown;
  timestamp: Date;
}

export interface AiConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  financialCitations?: any;
  createdAt: Date;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  xpReward: number;
  icon?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  content: string;
  keyTakeawaysJson?: any;
  quizJson?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessonsJson?: any;
  quizScoresJson?: any;
  isCompleted: boolean;
  completedAt?: Date | null;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl?: string | null;
  author?: string | null;
  publishedAt: Date;
  imageUrl?: string | null;
  tagsJson?: any;
  readTimeMinutes: number;
  isFeatured: boolean;
  published: boolean;
}

export interface NewsBookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  CONTAINED = 'CONTAINED',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export interface SecurityIncident {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  category: string;
  assignedToEmail?: string | null;
  sourceIp?: string | null;
  affectedUserId?: string | null;
  affectedResource?: string | null;
  rootCause?: string | null;
  resolutionNotes?: string | null;
  detectedAt: Date;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityAlert {
  id: string;
  title: string;
  eventType: string;
  severity: IncidentSeverity;
  sourceIp?: string | null;
  userId?: string | null;
  description: string;
  isAcknowledged: boolean;
  createdAt: Date;
}

export interface DatabaseAuditLog {
  id: string;
  timestamp: Date;
  operation: string;
  tableName: string;
  recordId?: string | null;
  actorId?: string | null;
  actorRole?: string | null;
  querySnippet?: string | null;
  executionTimeMs: number;
  ipAddress?: string | null;
  isSensitive: boolean;
  hash: string;
}
