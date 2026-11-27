// ==============================================================================
// VELTRON ROYAL WORLD BANKING, CLICK & PAYME, MULTI-CURRENCY IBAN & CARDS HUB
// The Ultimate Global Neobanking & Wealth Engine (Revolut + Click + Payme + Apple Card)
// Palette: Obsidian (#090706), Espresso (#120A08), Royal Burgundy (#54252D), Gold (#C6A477)
// ==============================================================================

'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Building2,
  Landmark,
  Send,
  Download,
  Plus,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
  Percent,
  Sparkles,
  Zap,
  Globe,
  SlidersHorizontal,
  Smartphone,
  FileText,
  Printer,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from 'lucide-react';

function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function QrCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3v1h-3zM20 14h1v3h-1z" />
    </svg>
  );
}

interface BankCard {
  id: string;
  name: string;
  type: 'UZCARD' | 'HUMO' | 'VISA' | 'MASTERCARD' | 'BESPOKE_TITANIUM';
  bank: string;
  cardNumber: string;
  maskedNumber: string;
  cvv: string;
  expiry: string;
  holder: string;
  balance: number;
  currency: 'UZS' | 'USD' | 'EUR';
  isFrozen: boolean;
  dailyLimit: number;
  spentToday: number;
  cardDesign: 'obsidian_titanium' | 'royal_burgundy' | 'champagne_gold' | 'silk_emerald';
}

interface IbanAccount {
  id: string;
  country: string;
  countryFlag: string;
  currency: 'USD' | 'EUR' | 'UZS' | 'GBP' | 'AED';
  accountTitle: string;
  bankName: string;
  iban: string;
  bicSwift: string;
  routingNumber?: string;
  balance: number;
  symbol: string;
}

interface Vault {
  id: string;
  name: string;
  asset: string;
  currency: string;
  apyPercent: number;
  depositedAmount: number;
  accruedProfit: number;
  payoutFrequency: 'Daily' | 'Weekly' | 'Monthly';
  color: string;
  icon: string;
}

const INITIAL_CARDS: BankCard[] = [
  {
    id: 'card-1',
    name: 'VELTRON Bespoke 1-of-1 Titanium',
    type: 'BESPOKE_TITANIUM',
    bank: 'Sovereign Private Treasury',
    cardNumber: '5358 8920 4410 9988',
    maskedNumber: '•••• •••• •••• 9988',
    cvv: '889',
    expiry: '12/30',
    holder: 'SHOMUHAMMAD KHUDAYBERDIEV',
    balance: 85400.0,
    currency: 'USD',
    isFrozen: false,
    dailyLimit: 50000,
    spentToday: 3200,
    cardDesign: 'obsidian_titanium',
  },
  {
    id: 'card-2',
    name: 'Uzcard Platinum Black',
    type: 'UZCARD',
    bank: 'Kapitalbank ATB',
    cardNumber: '8600 1402 7719 3042',
    maskedNumber: '8600 •••• •••• 3042',
    cvv: '719',
    expiry: '09/28',
    holder: 'SHOMUHAMMAD KHUDAYBERDIEV',
    balance: 245000000.0,
    currency: 'UZS',
    isFrozen: false,
    dailyLimit: 100000000,
    spentToday: 12500000,
    cardDesign: 'royal_burgundy',
  },
  {
    id: 'card-3',
    name: 'Humo Gold Contactless',
    type: 'HUMO',
    bank: 'Ipak Yo‘li Bank',
    cardNumber: '9860 3501 8840 6125',
    maskedNumber: '9860 •••• •••• 6125',
    cvv: '350',
    expiry: '11/29',
    holder: 'SHOMUHAMMAD KHUDAYBERDIEV',
    balance: 68500000.0,
    currency: 'UZS',
    isFrozen: false,
    dailyLimit: 50000000,
    spentToday: 4200000,
    cardDesign: 'champagne_gold',
  },
  {
    id: 'card-4',
    name: 'Visa Infinite Elite Metal',
    type: 'VISA',
    bank: 'JPMorgan Chase / Veltron Global',
    cardNumber: '4111 7620 9012 4581',
    maskedNumber: '•••• •••• •••• 4581',
    cvv: '412',
    expiry: '05/29',
    holder: 'SHOMUHAMMAD KHUDAYBERDIEV',
    balance: 42150.0,
    currency: 'USD',
    isFrozen: false,
    dailyLimit: 30000,
    spentToday: 1850,
    cardDesign: 'silk_emerald',
  },
];

const IBAN_ACCOUNTS: IbanAccount[] = [
  {
    id: 'iban-usd',
    country: 'United States',
    countryFlag: '🇺🇸',
    currency: 'USD',
    accountTitle: 'USD Federal Treasury Account',
    bankName: 'JPMorgan Chase N.A. (Correspondent)',
    iban: 'US89 JPMC 0210 0002 1892 4410',
    bicSwift: 'CHASUS33',
    routingNumber: '021000021',
    balance: 127550.0,
    symbol: '$',
  },
  {
    id: 'iban-uzs',
    country: 'O‘zbekiston',
    countryFlag: '🇺🇿',
    currency: 'UZS',
    accountTitle: 'Milliy Valyuta Hisob Raqami',
    bankName: 'O‘zbekiston Markaziy Banki Kliring',
    iban: '2020 8000 7054 8920 1001',
    bicSwift: 'KAPBAM22',
    routingNumber: '00445',
    balance: 313500000.0,
    symbol: "so'm",
  },
  {
    id: 'iban-eur',
    country: 'European Union (Germany)',
    countryFlag: '🇪🇺',
    currency: 'EUR',
    accountTitle: 'SEPA Euro Executive Vault',
    bankName: 'Deutsche Bank AG Frankfurt',
    iban: 'DE89 3704 0044 0532 0130 00',
    bicSwift: 'DEUTDEDDFXX',
    balance: 48900.0,
    symbol: '€',
  },
  {
    id: 'iban-gbp',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    currency: 'GBP',
    accountTitle: 'London Sterling Settlement',
    bankName: 'Barclays Bank PLC London',
    iban: 'GB29 BARK 2000 0089 4412 90',
    bicSwift: 'BARCGB22',
    routingNumber: '20-00-00',
    balance: 24800.0,
    symbol: '£',
  },
  {
    id: 'iban-aed',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    currency: 'AED',
    accountTitle: 'Dubai DIFC Royal Treasury',
    bankName: 'Emirates NBD Bank PJSC',
    iban: 'AE07 0260 0012 8904 4120 01',
    bicSwift: 'EBILAEAD',
    balance: 85000.0,
    symbol: 'AED',
  },
];

const INITIAL_VAULTS: Vault[] = [
  {
    id: 'v-usd',
    name: 'USD Sovereign Fixed Vault',
    asset: 'US Dollar',
    currency: 'USD',
    apyPercent: 12.5,
    depositedAmount: 50000,
    accruedProfit: 1420.5,
    payoutFrequency: 'Daily',
    color: '#C6A477',
    icon: '💵',
  },
  {
    id: 'v-uzs',
    name: 'UZS Milliy Omonat & Daromad',
    asset: 'O‘zbek So‘mi',
    currency: 'UZS',
    apyPercent: 22.0,
    depositedAmount: 150000000,
    accruedProfit: 8250000,
    payoutFrequency: 'Daily',
    color: '#54252D',
    icon: '🇺🇿',
  },
  {
    id: 'v-xau',
    name: 'Oltin Quymalar Vault (Gold)',
    asset: 'Physical Gold (XAU)',
    currency: 'USD',
    apyPercent: 8.2,
    depositedAmount: 35000,
    accruedProfit: 680.0,
    payoutFrequency: 'Monthly',
    color: '#E5C07B',
    icon: '🏆',
  },
  {
    id: 'v-usdt',
    name: 'USDT Liquid Stable Earn',
    asset: 'Tether (TRC20/ERC20)',
    currency: 'USD',
    apyPercent: 14.8,
    depositedAmount: 25000,
    accruedProfit: 925.0,
    payoutFrequency: 'Daily',
    color: '#26A17B',
    icon: '🪙',
  },
];

export function WorldBankingCardsHub() {
  const [activeTab, setActiveTab] = useState<'cards' | 'transfer' | 'iban' | 'vaults' | 'qr'>('cards');
  const [cards, setCards] = useState<BankCard[]>(INITIAL_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>(INITIAL_CARDS[0].id);
  const [showCvv, setShowCvv] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Transfer Simulator States
  const [transferType, setTransferType] = useState<'P2P_CARD' | 'CLICK' | 'PAYME' | 'SWIFT' | 'PHONE'>('P2P_CARD');
  const [destinationCard, setDestinationCard] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientNote, setRecipientNote] = useState('');
  const [detectedBank, setDetectedBank] = useState<string | null>(null);
  const [detectedRecipient, setDetectedRecipient] = useState<string | null>(null);
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);
  const [transferReceipt, setTransferReceipt] = useState<any | null>(null);

  // Add Card Modal
  const [addCardModal, setAddCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardBank, setNewCardBank] = useState('Kapitalbank');

  // Vault Calculator State
  const [calcAmount, setCalcAmount] = useState(10000);
  const [calcApy, setCalcApy] = useState(12.5);

  const selectedCard = useMemo(
    () => cards.find((c) => c.id === selectedCardId) || cards[0],
    [cards, selectedCardId]
  );

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Toggle freeze card
  const toggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };

  // Toggle CVV visibility with 5-sec timer
  const toggleCvv = (cardId: string) => {
    setShowCvv((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
    if (!showCvv[cardId]) {
      setTimeout(() => {
        setShowCvv((prev) => ({ ...prev, [cardId]: false }));
      }, 6000);
    }
  };

  // Auto-detect bank from card number
  const handleCardInputChange = (val: string) => {
    const raw = val.replace(/\s+/g, '');
    let formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    if (formatted.length > 19) formatted = formatted.slice(0, 19);
    setDestinationCard(formatted);

    if (raw.startsWith('8600')) {
      setDetectedBank('Uzcard (Kapitalbank ATB)');
      setDetectedRecipient('AZIZBEK R. (Tasdiqlangan)');
    } else if (raw.startsWith('9860')) {
      setDetectedBank('Humo (Ipak Yo‘li Bank)');
      setDetectedRecipient('SHOHRUH M. (Tasdiqlangan)');
    } else if (raw.startsWith('4')) {
      setDetectedBank('Visa International');
      setDetectedRecipient('GLOBAL PARTNER LLC');
    } else if (raw.startsWith('5')) {
      setDetectedBank('Mastercard World');
      setDetectedRecipient('INVESTMENT ACQUISITION');
    } else if (raw.length >= 4) {
      setDetectedBank('Markaziy Kliring A’zosi');
      setDetectedRecipient('MIJOZ ISMI');
    } else {
      setDetectedBank(null);
      setDetectedRecipient(null);
    }
  };

  // Execute Transfer Simulator
  const executeTransfer = () => {
    if (!destinationCard || !transferAmount || Number(transferAmount) <= 0) {
      alert('Iltimos, karta raqami va summani to‘liq kiriting!');
      return;
    }

    setIsProcessingTransfer(true);
    setTimeout(() => {
      setIsProcessingTransfer(false);
      const receipt = {
        txId: 'VELTRON-' + Math.floor(10000000 + Math.random() * 90000000),
        sourceCard: selectedCard.maskedNumber,
        destinationCard: destinationCard,
        amount: Number(transferAmount),
        currency: selectedCard.currency,
        recipient: detectedRecipient || 'QABUL QILUVCHI',
        bank: detectedBank || 'Milliy To‘lov Tizimi',
        commission: '0 UZS (0% VIP Imtiyoz)',
        status: 'MUVAFFAQIYATLI BAJARILDI',
        timestamp: new Date().toLocaleString('uz-UZ'),
        type: transferType,
      };
      setTransferReceipt(receipt);
      setTransferAmount('');
      setDestinationCard('');
    }, 1200);
  };

  // Handle Add New Card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !newCardHolder) return;
    const cleanNum = newCardNumber.replace(/\s+/g, '');
    let type: BankCard['type'] = 'VISA';
    if (cleanNum.startsWith('8600')) type = 'UZCARD';
    if (cleanNum.startsWith('9860')) type = 'HUMO';
    if (cleanNum.startsWith('5')) type = 'MASTERCARD';

    const newCard: BankCard = {
      id: 'card-' + Date.now(),
      name: `${newCardBank} ${type}`,
      type,
      bank: newCardBank,
      cardNumber: newCardNumber,
      maskedNumber: `${cleanNum.slice(0, 4)} •••• •••• ${cleanNum.slice(-4)}`,
      cvv: String(Math.floor(100 + Math.random() * 900)),
      expiry: newCardExpiry || '08/29',
      holder: newCardHolder.toUpperCase(),
      balance: 15000000,
      currency: type === 'UZCARD' || type === 'HUMO' ? 'UZS' : 'USD',
      isFrozen: false,
      dailyLimit: 30000000,
      spentToday: 0,
      cardDesign: 'royal_burgundy',
    };
    setCards([newCard, ...cards]);
    setSelectedCardId(newCard.id);
    setAddCardModal(false);
    setNewCardNumber('');
    setNewCardHolder('');
  };

  // Calculated compound yield
  const dailyIncome = ((calcAmount * (calcApy / 100)) / 365).toFixed(2);
  const monthlyIncome = ((calcAmount * (calcApy / 100)) / 12).toFixed(2);
  const yearlyIncome = (calcAmount * (calcApy / 100)).toFixed(2);

  return (
    <div className="w-full bg-[#0D0908] border border-[#C6A477]/30 rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Royal Burgundy & Gold Ambient Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#54252D]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C6A477]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER: Title & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#C6A477]/20 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#54252D] border border-[#C6A477]/40 text-[10px] font-bold text-[#FAF7F1] tracking-wider uppercase">
              ⚜️ Royal Banking & Sovereign Cards
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#26A17B] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#26A17B] animate-pulse" />
              Click & Payme Online
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#FAF7F1] tracking-wide">
            Jahon Banklari, Kartalar & Multivalyuta Markazi
          </h2>
          <p className="text-xs text-[#A89888] font-manrope">
            Revolut, Click, Payme va global banklar imkoniyatlari — barchasi bitta elita ekotizimida
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAddCardModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C6A477] to-[#B38D5C] text-[#120A08] font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Karta Qo‘shish</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 pb-4 mb-6 overflow-x-auto no-scrollbar relative z-10">
        {[
          { id: 'cards', label: '💳 Kartalar Boshqaruvi', count: cards.length },
          { id: 'transfer', label: '⚡ Click & Payme O‘tkazmalar', hot: true },
          { id: 'iban', label: '🌍 Xalqaro IBAN Hisoblar', count: IBAN_ACCOUNTS.length },
          { id: 'vaults', label: '💎 High-Yield Vaults (12.5% - 22%)', popular: true },
          { id: 'qr', label: '📱 Click Pass / QR To‘lov' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#54252D] to-[#782434] text-[#FAF7F1] border border-[#C6A477] shadow-lg'
                  : 'bg-[#181110] text-[#A89888] hover:text-[#FAF7F1] hover:bg-[#221614] border border-[#C6A477]/15'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] text-[#C6A477]">
                  {tab.count}
                </span>
              )}
              {tab.hot && (
                <span className="w-2 h-2 rounded-full bg-[#26A17B] shadow-[0_0_8px_#26A17B]" />
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================================== */}
      {/* TAB 1: CARDS MANAGEMENT (BESPOKE TITANIUM, UZCARD, HUMO, VISA)                  */}
      {/* ============================================================================== */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Card Visual & Interactive 3D Luxury Presentation (Col 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* The Luxury Card Visual */}
            <div
              className={`relative h-56 sm:h-64 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl transition-all duration-300 border ${
                selectedCard.isFrozen
                  ? 'bg-[#151518] border-blue-400/50 opacity-80 backdrop-blur-md'
                  : selectedCard.cardDesign === 'obsidian_titanium'
                  ? 'bg-gradient-to-br from-[#1C1615] via-[#100C0B] to-[#080605] border-[#C6A477]/70 shadow-[0_15px_40px_rgba(198,164,119,0.15)]'
                  : selectedCard.cardDesign === 'royal_burgundy'
                  ? 'bg-gradient-to-br from-[#54252D] via-[#3A181F] to-[#1C090D] border-[#C6A477]/60 shadow-[0_15px_40px_rgba(84,37,45,0.3)]'
                  : selectedCard.cardDesign === 'champagne_gold'
                  ? 'bg-gradient-to-br from-[#856D4A] via-[#54422B] to-[#2E2315] border-[#EAD5B5]/60'
                  : 'bg-gradient-to-br from-[#153429] via-[#0D211A] to-[#050E0A] border-[#26A17B]/60'
              }`}
            >
              {/* Frosted Badge if Frozen */}
              {selectedCard.isFrozen && (
                <div className="absolute inset-0 bg-blue-950/40 rounded-3xl backdrop-blur-xs flex items-center justify-center z-20">
                  <div className="px-4 py-2 rounded-xl bg-blue-900/80 border border-blue-400 text-blue-200 text-xs font-bold flex items-center gap-2 shadow-xl">
                    <Lock className="w-4 h-4 text-blue-300" />
                    <span>KARTA VAQTINCHA MUZLАTILDI (FROZEN)</span>
                  </div>
                </div>
              )}

              {/* Card Top: Bank & Chip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-[#D6BB92] to-[#B38D5C] shadow-inner border border-yellow-200/40 flex items-center justify-center">
                    <div className="w-6 h-4 border border-black/30 rounded-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#FAF7F1] uppercase">
                      {selectedCard.bank}
                    </p>
                    <p className="text-[10px] text-[#C6A477] font-medium tracking-wide">
                      {selectedCard.name}
                    </p>
                  </div>
                </div>
                {/* Brand Badge */}
                <div className="text-right">
                  <span className="text-sm font-black italic tracking-wider text-white">
                    {selectedCard.type}
                  </span>
                </div>
              </div>

              {/* Card Number & Reveal CVV */}
              <div>
                <p className="font-mono text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#FAF7F1] drop-shadow-md">
                  {showCvv[selectedCard.id]
                    ? selectedCard.cardNumber
                    : selectedCard.maskedNumber}
                </p>
                <div className="flex items-center gap-6 mt-2 text-[11px] text-[#C6A477] font-mono">
                  <span>EXP: {selectedCard.expiry}</span>
                  <span className="flex items-center gap-1">
                    CVV: {showCvv[selectedCard.id] ? selectedCard.cvv : '•••'}
                  </span>
                </div>
              </div>

              {/* Card Bottom: Holder Name & Balance */}
              <div className="flex items-end justify-between border-t border-white/10 pt-3">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#A89888]">Karta Egasi</p>
                  <p className="text-xs font-bold text-[#FAF7F1] tracking-wider uppercase font-mono">
                    {selectedCard.holder}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-[#A89888]">Balans</p>
                  <p className="text-base sm:text-xl font-bold text-[#FAF7F1] font-mono">
                    {selectedCard.currency === 'UZS'
                      ? `${selectedCard.balance.toLocaleString()} so‘m`
                      : `$${selectedCard.balance.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Card Controls (Freeze, Reveal, Daily Limit) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <button
                onClick={() => toggleFreezeCard(selectedCard.id)}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedCard.isFrozen
                    ? 'bg-blue-900/30 border-blue-400 text-blue-200'
                    : 'bg-[#181110] border-[#C6A477]/30 text-[#FAF7F1] hover:bg-[#251815]'
                }`}
              >
                {selectedCard.isFrozen ? (
                  <>
                    <UnlockIcon className="w-4 h-4 text-blue-400" />
                    <span>Muzdan Yechish</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#C6A477]" />
                    <span>Muzlatish (Freeze)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleCvv(selectedCard.id)}
                className="p-3 rounded-2xl bg-[#181110] border border-[#C6A477]/30 hover:bg-[#251815] text-[#FAF7F1] text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                {showCvv[selectedCard.id] ? (
                  <>
                    <EyeOff className="w-4 h-4 text-[#C6A477]" />
                    <span>Yashirish</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-[#C6A477]" />
                    <span>CVV / Raqam</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopy(selectedCard.cardNumber, 'card-num')}
                className="p-3 rounded-2xl bg-[#181110] border border-[#C6A477]/30 hover:bg-[#251815] text-[#FAF7F1] text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'card-num' ? (
                  <>
                    <Check className="w-4 h-4 text-[#26A17B]" />
                    <span className="text-[#26A17B]">Nusxa Olindi</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C6A477]" />
                    <span>Raqamni Olish</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('transfer');
                  setTransferType('CLICK');
                }}
                className="p-3 rounded-2xl bg-[#54252D] border border-[#C6A477]/60 hover:bg-[#682D38] text-[#FAF7F1] text-xs font-semibold flex flex-col items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#C6A477]" />
                <span>To‘lash (Click/Payme)</span>
              </button>
            </div>

            {/* Daily Spending Limit Bar */}
            <div className="p-4 rounded-2xl bg-[#140E0D] border border-[#C6A477]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A89888] font-medium">Kunlik Xarajat Limiti</span>
                <span className="text-[#FAF7F1] font-mono font-bold">
                  {selectedCard.currency === 'UZS'
                    ? `${selectedCard.spentToday.toLocaleString()} / ${selectedCard.dailyLimit.toLocaleString()} so‘m`
                    : `$${selectedCard.spentToday.toLocaleString()} / $${selectedCard.dailyLimit.toLocaleString()}`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C6A477] to-[#782434] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (selectedCard.spentToday / selectedCard.dailyLimit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-[#A89888]">
                Cheksiz limit va jismoniy Titanium kartani buyurtma qilish uchun{' '}
                <a href="/pricing" className="text-[#C6A477] font-semibold hover:underline">
                  Max Sovereign VIP
                </a>{' '}
                paketiga o‘ting.
              </p>
            </div>
          </div>

          {/* Cards List Selector & Quick Actions (Col 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="text-xs font-bold text-[#FAF7F1] tracking-wide flex items-center justify-between px-1">
              <span>Barcha Kartalaringiz ({cards.length})</span>
              <span className="text-[11px] text-[#C6A477]">1-Touch Tanlash</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {cards.map((c) => {
                const isSelected = c.id === selectedCardId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCardId(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1C1210] border-[#C6A477] shadow-lg ring-1 ring-[#C6A477]/40'
                        : 'bg-[#140E0D] border-[#C6A477]/20 hover:border-[#C6A477]/50 hover:bg-[#1A1210]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          c.type === 'UZCARD'
                            ? 'bg-[#54252D] text-white border border-[#C6A477]/40'
                            : c.type === 'HUMO'
                            ? 'bg-[#856D4A] text-white'
                            : 'bg-black text-[#C6A477] border border-[#C6A477]/30'
                        }`}
                      >
                        {c.type === 'UZCARD' ? 'UZ' : c.type === 'HUMO' ? 'HU' : 'VI'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{c.name}</p>
                        <p className="text-[11px] text-[#A89888] font-mono">{c.maskedNumber}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-[#FAF7F1] font-mono">
                        {c.currency === 'UZS'
                          ? `${(c.balance / 1000000).toFixed(1)}M so‘m`
                          : `$${c.balance.toLocaleString()}`}
                      </p>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                          c.isFrozen
                            ? 'bg-blue-900/60 text-blue-300'
                            : 'bg-[#26A17B]/20 text-[#26A17B]'
                        }`}
                      >
                        {c.isFrozen ? 'Muzlatilgan' : 'Aktiv'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Custom Card Button */}
            <button
              onClick={() => setAddCardModal(true)}
              className="w-full py-3 rounded-2xl border border-dashed border-[#C6A477]/40 hover:border-[#C6A477] hover:bg-[#1E1412] text-xs font-semibold text-[#C6A477] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Dunyoning istalgan kartasini ulash</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* TAB 2: CLICK & PAYME INSTANT CARD-TO-CARD (P2P) TRANSFERS                     */}
      {/* ============================================================================== */}
      {activeTab === 'transfer' && (
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <div className="p-6 rounded-3xl bg-[#140E0D] border border-[#C6A477]/35 shadow-xl space-y-5">
            {/* Transfer Provider Selector */}
            <div className="flex items-center justify-between border-b border-[#C6A477]/20 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#FAF7F1]">Tezkor Karta O‘tkazmalari</h3>
                <p className="text-xs text-[#A89888]">0% komissiya va lahzali tushum</p>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'P2P_CARD', label: 'Card-to-Card' },
                  { id: 'CLICK', label: 'Click' },
                  { id: 'PAYME', label: 'Payme' },
                  { id: 'SWIFT', label: 'SWIFT Wire' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTransferType(mode.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      transferType === mode.id
                        ? 'bg-[#54252D] text-[#C6A477] border border-[#C6A477]'
                        : 'bg-[#1C1412] text-[#8E8278] hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Source Card Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#C6A477] mb-1.5">
                Qaysi Kartadan Yuborasiz?
              </label>
              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="w-full bg-[#1C1412] border border-[#C6A477]/35 rounded-xl p-3 text-xs text-[#FAF7F1] font-mono focus:outline-none focus:border-[#C6A477]"
              >
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.maskedNumber}) — Balans:{' '}
                    {c.currency === 'UZS' ? `${c.balance.toLocaleString()} so‘m` : `$${c.balance}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Card Input with Auto Bank Detection */}
            <div>
              <label className="block text-xs font-semibold text-[#C6A477] mb-1.5">
                Qabul Qiluvchi Karta Raqami (Uzcard, Humo, Visa, Mastercard)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="8600 •••• •••• •••• yoki 9860..."
                  value={destinationCard}
                  onChange={(e) => handleCardInputChange(e.target.value)}
                  className="w-full bg-[#1C1412] border border-[#C6A477]/35 rounded-xl p-3 text-sm text-[#FAF7F1] font-mono placeholder-[#8E8278] focus:outline-none focus:border-[#C6A477]"
                />
                <CreditCard className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#C6A477]/60" />
              </div>

              {/* Detected Bank & Recipient Preview */}
              {detectedBank && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#1C1816] border border-[#C6A477]/40 flex items-center justify-between text-xs animate-in fade-in">
                  <div>
                    <p className="font-bold text-[#FAF7F1]">{detectedRecipient}</p>
                    <p className="text-[11px] text-[#A89888]">{detectedBank}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#26A17B]/20 text-[#26A17B] font-bold text-[10px]">
                    0% Komissiya
                  </span>
                </div>
              )}
            </div>

            {/* Transfer Amount */}
            <div>
              <label className="block text-xs font-semibold text-[#C6A477] mb-1.5">
                O‘tkazma Summasi ({selectedCard.currency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-[#1C1412] border border-[#C6A477]/35 rounded-xl p-3 text-base text-[#FAF7F1] font-mono font-bold focus:outline-none focus:border-[#C6A477]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#C6A477]">
                  {selectedCard.currency}
                </span>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex items-center gap-2 mt-2">
                {(selectedCard.currency === 'UZS'
                  ? [100000, 500000, 1000000, 5000000]
                  : [50, 100, 500, 1000]
                ).map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTransferAmount(String(amt))}
                    className="px-2.5 py-1 rounded-lg bg-[#221715] hover:bg-[#32201C] text-[11px] font-mono text-[#FAF7F1] transition-colors cursor-pointer"
                  >
                    +{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Transfer Button */}
            <button
              onClick={executeTransfer}
              disabled={isProcessingTransfer}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#54252D] via-[#782434] to-[#54252D] border border-[#C6A477] text-white font-bold text-sm shadow-[0_0_20px_rgba(198,164,119,0.3)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingTransfer ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C6A477]" />
                  <span>Xavfsiz Tranzaksiya Tasdiqlanmoqda...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#C6A477]" />
                  <span>Mablag‘ni Lahzada Yuborish (0% Komissiya)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* TAB 3: INTERNATIONAL MULTI-CURRENCY IBAN ACCOUNTS (REVOLUT / WISE STYLE)        */}
      {/* ============================================================================== */}
      {activeTab === 'iban' && (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {IBAN_ACCOUNTS.map((acc) => (
              <div
                key={acc.id}
                className="p-5 rounded-2xl bg-[#140E0D] border border-[#C6A477]/30 hover:border-[#C6A477]/70 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{acc.countryFlag}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#54252D] border border-[#C6A477]/40 text-[10px] font-bold text-[#FAF7F1]">
                      {acc.currency}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#FAF7F1] leading-tight">
                    {acc.accountTitle}
                  </h4>
                  <p className="text-[11px] text-[#A89888]">{acc.bankName}</p>
                </div>

                {/* IBAN Details */}
                <div className="space-y-1.5 p-3 rounded-xl bg-[#1C1412] border border-[#C6A477]/20 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-[#E9DDCA]">
                    <span className="text-[10px] text-[#8E8278]">IBAN:</span>
                    <span className="font-bold">{acc.iban}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#E9DDCA]">
                    <span className="text-[10px] text-[#8E8278]">SWIFT/BIC:</span>
                    <span>{acc.bicSwift}</span>
                  </div>
                  {acc.routingNumber && (
                    <div className="flex items-center justify-between text-[#E9DDCA]">
                      <span className="text-[10px] text-[#8E8278]">Routing:</span>
                      <span>{acc.routingNumber}</span>
                    </div>
                  )}
                </div>

                {/* Balance & Copy Button */}
                <div className="flex items-center justify-between pt-2 border-t border-[#C6A477]/15">
                  <div>
                    <p className="text-[10px] text-[#8E8278]">Balans</p>
                    <p className="text-base font-bold text-[#FAF7F1] font-mono">
                      {acc.symbol} {acc.balance.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(acc.iban, acc.id)}
                    className="p-2 rounded-xl bg-[#221614] hover:bg-[#32201C] text-[#C6A477] transition-colors cursor-pointer"
                    title="IBAN nusxa olish"
                  >
                    {copiedKey === acc.id ? (
                      <Check className="w-4 h-4 text-[#26A17B]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* TAB 4: HIGH-YIELD SAVINGS VAULTS (12.5% - 22.0% APY WEALTH ENGINE)              */}
      {/* ============================================================================== */}
      {activeTab === 'vaults' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Vaults List (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold text-[#FAF7F1] tracking-wide">
              Mavjud Omonat & Daromad Vaultlari (Daromad Kunlik Hisoblanadi)
            </div>

            <div className="space-y-3">
              {INITIAL_VAULTS.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-[#140E0D] border border-[#C6A477]/30 hover:border-[#C6A477]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#1F1614] border border-[#C6A477]/30 flex items-center justify-center text-2xl shrink-0">
                      {v.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{v.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-[#26A17B]/20 text-[#26A17B] font-bold text-[10px]">
                          +{v.apyPercent}% APY
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A89888]">
                        To‘lov: {v.payoutFrequency} • Kengaytirilgan Kvant Kafolati
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-[#C6A477]/20 sm:pl-5">
                    <p className="text-[10px] text-[#A89888]">Jami Jamg‘arma</p>
                    <p className="text-base font-bold text-[#FAF7F1] font-mono">
                      {v.currency === 'UZS'
                        ? `${(v.depositedAmount / 1000000).toFixed(1)}M so‘m`
                        : `$${v.depositedAmount.toLocaleString()}`}
                    </p>
                    <p className="text-[10px] text-[#26A17B] font-semibold">
                      +{v.accruedProfit.toLocaleString()} daromad
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Compound Interest Calculator (Col 5) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-[#140E0D] border border-[#C6A477]/35 space-y-4">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#C6A477]/20 text-[#C6A477] text-[10px] font-bold uppercase">
                Kalkulyator
              </span>
              <h3 className="text-base font-bold text-[#FAF7F1] mt-1">
                Kvant Daromad Kalkulyatori
              </h3>
              <p className="text-xs text-[#A89888]">
                Depozitingiz qancha sof passiv daromad keltirishini hisoblang
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C6A477] mb-1">
                Depozit Summasi ($)
              </label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full bg-[#1C1412] border border-[#C6A477]/30 rounded-xl p-3 text-sm text-[#FAF7F1] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C6A477] mb-1">
                Yillik Stavka: {calcApy}% APY
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="0.5"
                value={calcApy}
                onChange={(e) => setCalcApy(Number(e.target.value))}
                className="w-full accent-[#C6A477] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#1C1412] border border-[#C6A477]/20 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#A89888]">Kunlik Sof Daromad:</span>
                <span className="font-mono font-bold text-[#26A17B]">+${dailyIncome}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A89888]">Oylik Sof Daromad:</span>
                <span className="font-mono font-bold text-[#26A17B]">+${monthlyIncome}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-[#C6A477]/15">
                <span className="text-white font-semibold">Yillik Jami Daromad:</span>
                <span className="font-mono font-bold text-[#C6A477] text-sm">+${yearlyIncome}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`$${calcAmount} miqdoridagi depozit 12.5% stavkada muvaffaqiyatli band qilindi!`);
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6A477] to-[#B38D5C] text-[#120A08] font-bold text-xs shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Ushbu Omonatni Ochish
            </button>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* TAB 5: CLICK PASS / PAYME GO QR CODE SCANNER & BARCODE                         */}
      {/* ============================================================================== */}
      {activeTab === 'qr' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#140E0D] border border-[#C6A477]/35 text-center space-y-4 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-[#54252D]/40 border border-[#C6A477]/40">
            <QrCodeIcon className="w-8 h-8 text-[#C6A477]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#FAF7F1]">Click Pass & Payme Go</h3>
            <p className="text-xs text-[#A89888]">
              Magazinlar va kafelarda kartasiz 1 soniyada to‘lov qilish uchun QR kod
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl max-w-[220px] mx-auto shadow-2xl">
            {/* Simulated Dynamic QR Code */}
            <div className="w-full aspect-square bg-[#090706] rounded-xl flex flex-col items-center justify-center p-3 text-white">
              <QrCodeIcon className="w-36 h-36 text-white" />
              <p className="text-[9px] font-mono tracking-widest text-[#C6A477] mt-1">
                VELTRON-PASS-9988
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-[#26A17B] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#26A17B] animate-ping" />
            <span>Har 30 soniyada yangilanadi (Xavfsiz)</span>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL 1: ADD NEW ANY WORLD CARD                                               */}
      {/* ============================================================================== */}
      {addCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#120A08] border border-[#C6A477]/50 rounded-3xl p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#C6A477]/20">
              <h3 className="text-base font-bold text-[#FAF7F1]">Yangi Karta Qo‘shish</h3>
              <button
                onClick={() => setAddCardModal(false)}
                className="p-1 rounded-lg text-[#8E8278] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#C6A477] mb-1">
                  Bank Nomi
                </label>
                <select
                  value={newCardBank}
                  onChange={(e) => setNewCardBank(e.target.value)}
                  className="w-full bg-[#1C1412] border border-[#C6A477]/30 rounded-xl p-2.5 text-xs text-[#FAF7F1]"
                >
                  <option value="Kapitalbank ATB">Kapitalbank ATB</option>
                  <option value="Ipak Yo‘li Bank">Ipak Yo‘li Bank</option>
                  <option value="TBC Bank">TBC Bank Uzbekistan</option>
                  <option value="O‘zmilliybank (NBU)">O‘zmilliybank (NBU)</option>
                  <option value="Hamkorbank">Hamkorbank</option>
                  <option value="JPMorgan Chase">JPMorgan Chase (Global)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C6A477] mb-1">
                  16-Xonali Karta Raqami
                </label>
                <input
                  type="text"
                  placeholder="8600 0000 0000 0000"
                  required
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full bg-[#1C1412] border border-[#C6A477]/30 rounded-xl p-2.5 text-xs text-[#FAF7F1] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#C6A477] mb-1">
                    Amal Qilish Muddati
                  </label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="w-full bg-[#1C1412] border border-[#C6A477]/30 rounded-xl p-2.5 text-xs text-[#FAF7F1] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#C6A477] mb-1">
                    Karta Egasi Ismi
                  </label>
                  <input
                    type="text"
                    placeholder="SHOMUHAMMAD KH."
                    required
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    className="w-full bg-[#1C1412] border border-[#C6A477]/30 rounded-xl p-2.5 text-xs text-[#FAF7F1] uppercase"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddCardModal(false)}
                  className="px-4 py-2 rounded-xl bg-transparent border border-white/20 text-xs text-white"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#54252D] border border-[#C6A477] text-xs font-bold text-[#FAF7F1]"
                >
                  Kartani Ulash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL 2: OFFICIAL VIP TRANSACTION RECEIPT                                      */}
      {/* ============================================================================== */}
      {transferReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#120A08] border border-[#C6A477] rounded-3xl p-6 space-y-4 shadow-2xl relative text-[#FAF7F1]">
            <div className="text-center pb-3 border-b border-[#C6A477]/20">
              <div className="w-12 h-12 rounded-full bg-[#26A17B]/20 border border-[#26A17B] text-[#26A17B] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold">Tranzaksiya Cheki</h3>
              <p className="text-[11px] text-[#A89888] font-mono">{transferReceipt.txId}</p>
            </div>

            <div className="space-y-2 text-xs font-mono bg-[#1A1210] p-4 rounded-2xl border border-[#C6A477]/20">
              <div className="flex justify-between">
                <span className="text-[#8E8278]">Jo‘natuvchi:</span>
                <span>{transferReceipt.sourceCard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8278]">Qabul qiluvchi:</span>
                <span className="font-bold text-[#C6A477]">{transferReceipt.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8278]">Karta:</span>
                <span>{transferReceipt.destinationCard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8278]">Bank:</span>
                <span>{transferReceipt.bank}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                <span className="text-white font-bold">Summa:</span>
                <span className="font-bold text-[#26A17B]">
                  {transferReceipt.amount.toLocaleString()} {transferReceipt.currency}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8E8278]">Komissiya:</span>
                <span className="text-[#26A17B]">{transferReceipt.commission}</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#8E8278] pt-1">
                <span>Vaqt:</span>
                <span>{transferReceipt.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#1C1412] border border-[#C6A477]/40 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#C6A477]" />
                <span>Chop Etish</span>
              </button>
              <button
                onClick={() => setTransferReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#54252D] border border-[#C6A477] text-xs font-bold text-white"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
