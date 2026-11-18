// ==============================================================================
// VELTRON SUBSCRIPTION TIERS & FEATURE ENTITLEMENTS
// Free, Pro, Ultra, Max (100% Unlocked)
// ==============================================================================

export type TierKey = 'FREE' | 'PRO' | 'ULTRA' | 'MAX';

export interface TierDefinition {
  id: TierKey;
  name: string;
  badge: string;
  monthlyPriceUSD: number;
  monthlyPriceUZS: number;
  annualDiscountPercent: number;
  tagline: string;
  popular?: boolean;
  paperBalance: number;
  aiQueriesPerDay: number | 'UNLIMITED';
  features: {
    text: string;
    included: boolean;
  }[];
  unlockedPercentage: number;
}

export const SUBSCRIPTION_TIERS: Record<TierKey, TierDefinition> = {
  FREE: {
    id: 'FREE',
    name: 'Tekin (Free)',
    badge: 'Boshlang‘ich',
    monthlyPriceUSD: 0,
    monthlyPriceUZS: 0,
    annualDiscountPercent: 0,
    tagline: 'Platforma bilan tanishish uchun cheklangan imkoniyatlar',
    paperBalance: 10000,
    aiQueriesPerDay: 5,
    unlockedPercentage: 15,
    features: [
      { text: '$10,000 virtual demo kapital', included: true },
      { text: 'Asosiy bozor kotirovkalari (BTC, ETH, Oltin)', included: true },
      { text: 'Kuniga 5 ta AI moliya maslahatchisi so‘rovi', included: true },
      { text: 'Asosiy savdo darsliklari', included: true },
      { text: 'Kengaytirilgan indikatorlar (RSI, MACD)', included: false },
      { text: 'Real-vaqt narx ogohlantirishlari (Push/Telegram)', included: false },
      { text: 'Kvant tahlil va risk boshqaruvi', included: false },
      { text: 'Telegram VIP yopiq signallar kanali', included: false },
      { text: '100% barcha institutsional funksiyalar', included: false },
    ],
  },
  PRO: {
    id: 'PRO',
    name: 'Apex Pro',
    badge: 'Faol Treyding',
    monthlyPriceUSD: 29,
    monthlyPriceUZS: 350000,
    annualDiscountPercent: 20,
    popular: true,
    tagline: 'Jiddiy treyderlar va o‘rganuvchilar uchun kengaytirilgan qulaylik',
    paperBalance: 100000,
    aiQueriesPerDay: 50,
    unlockedPercentage: 55,
    features: [
      { text: '$100,000 virtual demo kapital', included: true },
      { text: 'Barcha bozorlar va real-vaqt kotirovkalari', included: true },
      { text: 'Kuniga 50 ta AI maslahatchi so‘rovi', included: true },
      { text: 'Barcha texnik indikatorlar (RSI, MACD, Bollinger)', included: true },
      { text: 'Telegram orqali narx ogohlantirishlari', included: true },
      { text: 'To‘liq ta’lim akademiyasi va XP sprintlari', included: true },
      { text: 'Kvant makro tahlil va Monte-Karlo', included: false },
      { text: 'Telegram VIP yopiq signallar kanali', included: false },
      { text: 'Shaxsiy AI konsyerj', included: false },
    ],
  },
  ULTRA: {
    id: 'ULTRA',
    name: 'Ultra Growth',
    badge: 'Kvant Xedj',
    monthlyPriceUSD: 79,
    monthlyPriceUZS: 990000,
    annualDiscountPercent: 25,
    tagline: 'Kvant algoritmlari, xedjlash va cheksiz AI quvvati',
    paperBalance: 500000,
    aiQueriesPerDay: 'UNLIMITED',
    unlockedPercentage: 85,
    features: [
      { text: '$500,000 virtual demo kapital', included: true },
      { text: 'Barcha bozorlar, xomashyo va jahon indekslari', included: true },
      { text: 'Cheksiz AI maslahatchi so‘rovlari', included: true },
      { text: 'Kvant makro-tahlil va Markowitz xedj modeli', included: true },
      { text: 'Portfolio stress-testlari (VaR tahlili)', included: true },
      { text: 'Telegram VIP yopiq savdo signallari kanali', included: true },
      { text: 'PDF / Excel hisobotlarni eksport qilish', included: true },
      { text: '100% barcha institutsional VIP imkoniyatlar', included: false },
      { text: 'Shaxsiy menejer va maxsus API kalitlari', included: false },
    ],
  },
  MAX: {
    id: 'MAX',
    name: 'Max Sovereign VIP',
    badge: '100% Ochilgan',
    monthlyPriceUSD: 199,
    monthlyPriceUZS: 2500000,
    annualDiscountPercent: 30,
    tagline: '100% BARCHA IMKONIYATLAR: Cheksiz quvvat va elita konsyerj',
    paperBalance: 1000000,
    aiQueriesPerDay: 'UNLIMITED',
    unlockedPercentage: 100,
    features: [
      { text: '$1,000,000+ cheksiz virtual demo kapital', included: true },
      { text: '100% BARCHA funksiyalar va modullar ochiq', included: true },
      { text: 'Cheksiz AI moliyaviy mentor va maxsus promptlar', included: true },
      { text: 'Kvant tahlil, avtomatik xedjlash va simulyator', included: true },
      { text: 'Markaziy banklar va institutsional makro hisobotlar', included: true },
      { text: 'Telegram VIP konsyerj va individual savdo signallari', included: true },
      { text: 'Dasturchilar uchun REST & Webhook API kirish', included: true },
      { text: '24/7 shaxsiy moliyaviy konsyerj xizmati', included: true },
      { text: 'Bespoke 1-of-1 profil va maxsus suveren nishon', included: true },
    ],
  },
};

export function isFeatureAllowed(userTier: string = 'FREE', requiredTier: TierKey = 'FREE'): boolean {
  const levels: Record<TierKey, number> = {
    FREE: 0,
    PRO: 1,
    ULTRA: 2,
    MAX: 3,
  };
  const current = levels[(userTier.toUpperCase() as TierKey) || 'FREE'] ?? 0;
  const target = levels[requiredTier] ?? 0;
  return current >= target;
}
