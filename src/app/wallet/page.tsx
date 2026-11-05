// ==============================================================================
// VALIXEN PERSONAL FINANCIAL WALLET (/wallet)
// Sovereign Multi-Asset Glassmorphism Wallet & Tokenized Accounts
// ==============================================================================

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import { AnimatedFinancialCard } from '@/components/wallet/AnimatedFinancialCard';
import {
  Wallet,
  CreditCard,
  Building2,
  Landmark,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Lock,
  Layers,
  Sparkles,
  PieChart,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  History,
  Activity,
  ArrowUpDown,
} from 'lucide-react';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'UZS';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  UZS: { symbol: "so'm", rate: 12850.0, label: 'UZS (so‘m)' },
};

interface WalletData {
  totalBalanceUsd: number;
  availableCashUsd: number;
  lockedBalanceUsd: number;
  monthlyIncomeUsd: number;
  monthlyExpensesUsd: number;
  netSavingsRatePercent: number;
  accounts: Array<{
    id: string;
    accountName: string;
    accountNumber: string;
    type: string;
    status: string;
    currency: string;
    balance: number;
    availableBalance: number;
    lockedBalance: number;
    iban?: string | null;
    routingNumber?: string | null;
    provider?: string;
    cardBrand?: string;
    expDate?: string;
    isPrimary?: boolean;
    createdAt: string;
  }>;
  spendingCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
    transactionCount: number;
    color: string;
  }>;
  recentTransactions: Array<{
    id: string;
    referenceNumber: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    category: string;
    description: string | null;
    counterparty: string | null;
    createdAt: string;
  }>;
  monthlyReport: {
    period: string;
    totalDeposits: number;
    totalSpend: number;
    netCashFlow: number;
    savingsRate: number;
    topCategory: string;
  };
}

const INITIAL_WALLET_DATA: WalletData = {
  totalBalanceUsd: 25400.0,
  availableCashUsd: 18200.0,
  lockedBalanceUsd: 7200.0,
  monthlyIncomeUsd: 8500.0,
  monthlyExpensesUsd: 2600.0,
  netSavingsRatePercent: 69.4,
  accounts: [
    {
      id: 'fa-primary-001',
      accountName: 'Valixen Prime Checking',
      accountNumber: '•••• 9812',
      type: 'SMART_CHECKING',
      status: 'ACTIVE',
      currency: 'USD',
      balance: 18200.0,
      availableBalance: 18200.0,
      lockedBalance: 0,
      provider: 'Valixen Prime',
      cardBrand: 'VISA',
      isPrimary: true,
      createdAt: new Date().toISOString(),
    },
  ],
  spendingCategories: [
    { category: 'INVESTMENTS', amount: 1200.0, percentage: 46.2, transactionCount: 3, color: '#C6A477' },
    { category: 'HOUSING', amount: 900.0, percentage: 34.6, transactionCount: 1, color: '#642B35' },
    { category: 'TECHNOLOGY', amount: 500.0, percentage: 19.2, transactionCount: 2, color: '#96764D' },
  ],
  recentTransactions: [
    {
      id: 'tx-1',
      referenceNumber: 'TX-781920',
      type: 'TRANSFER_IN',
      amount: 4500.0,
      currency: 'USD',
      status: 'COMPLETED',
      category: 'INCOME',
      description: 'Capital Inflow & Dividend Settlement',
      counterparty: 'Zurich Vault Settlement',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'tx-2',
      referenceNumber: 'TX-781919',
      type: 'EXPENSE',
      amount: 850.0,
      currency: 'USD',
      status: 'COMPLETED',
      category: 'TECHNOLOGY',
      description: 'High-Frequency Cloud Infrastructure',
      counterparty: 'Amazon Web Services',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  monthlyReport: {
    period: 'October 2026',
    totalDeposits: 8500.0,
    totalSpend: 2600.0,
    netCashFlow: 5900.0,
    savingsRate: 69.4,
    topCategory: 'INVESTMENTS',
  },
};

export default function WalletPage() {
  const router = useRouter();

  // State
  const [wallet, setWallet] = useState<WalletData | null>(INITIAL_WALLET_DATA);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [hideBalance, setHideBalance] = useState(false);

  // Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'BANK' | 'CARD' | 'SMART'>('BANK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Disconnect State
  const [accountToDisconnect, setAccountToDisconnect] = useState<string | null>(null);

  // Bank Form State (Plaid Sandbox)
  const [bankInstitution, setBankInstitution] = useState('Chase Manhattan Bank');
  const [bankAccountType, setBankAccountType] = useState('Checking');
  const [bankMask, setBankMask] = useState('7812');

  // Card Form State (Stripe Vault Tokenized - ZERO CVV/PIN)
  const [cardholderName, setCardholderName] = useState('Alex Morgan');
  const [cardBrand, setCardBrand] = useState<'VISA' | 'MASTERCARD' | 'AMEX'>('VISA');
  const [cardLast4, setCardLast4] = useState('4242');
  const [cardExpMonth, setCardExpMonth] = useState('12');
  const [cardExpYear, setCardExpYear] = useState('2028');

  // Smart Account Form State
  const [smartAccountName, setSmartAccountName] = useState('Veltron Quantum Reserve');
  const [smartAccountType, setSmartAccountType] = useState('HIGH_YIELD_VAULT');

  // 1. Fetch Wallet Data
  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/v1/wallet');
      if (res.ok) {
        const json = await res.json();
        setWallet(json.data);
      }
    } catch (err) {
      console.error('Failed to load wallet state:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWallet();
  };

  // Convert USD to selected currency
  const formatMoney = (usdAmount: number) => {
    if (hideBalance) return '••••••••';
    const conf = CURRENCY_CONFIG[currency];
    const converted = usdAmount * conf.rate;
    if (currency === 'UZS') {
      return `${Math.round(converted).toLocaleString()} ${conf.symbol}`;
    }
    return `${conf.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 2. Handle Connect Bank (Plaid Sandbox)
  const handleConnectBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const simulatedToken = `pld_sandbox_${Date.now()}_auth`;
      const res = await fetch('/api/v1/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONNECT_BANK',
          institutionName: bankInstitution,
          accountName: bankAccountType,
          accountMask: bankMask,
          providerToken: simulatedToken,
          currency: 'USD',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to connect bank account');

      setActionSuccess(`Successfully linked ${bankInstitution} via Plaid Sandbox.`);
      setTimeout(() => {
        setIsConnectModalOpen(false);
        setActionSuccess(null);
        fetchWallet();
      }, 1500);
    } catch (err: any) {
      setActionError(err.message || 'Error syncing provider.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle Connect Card (Stripe Vault Tokenized - STRICT NO CVV/PIN)
  const handleConnectCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      if (!/^\d{4}$/.test(cardLast4)) {
        throw new Error('Last 4 digits must contain exactly 4 numbers.');
      }

      const simulatedStripeToken = `tok_sandbox_${Date.now()}`;
      const res = await fetch('/api/v1/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONNECT_CARD',
          cardholderName,
          brand: cardBrand,
          last4: cardLast4,
          expMonth: parseInt(cardExpMonth, 10),
          expYear: parseInt(cardExpYear, 10),
          providerToken: simulatedStripeToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to link card');

      setActionSuccess(`Tokenized card (${cardBrand} •••• ${cardLast4}) securely saved in Stripe Vault.`);
      setTimeout(() => {
        setIsConnectModalOpen(false);
        setActionSuccess(null);
        fetchWallet();
      }, 1500);
    } catch (err: any) {
      setActionError(err.message || 'Card tokenization failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle Create Smart Account
  const handleCreateSmartAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch('/api/v1/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_ACCOUNT',
          accountName: smartAccountName,
          accountType: smartAccountType,
          currency: 'USD',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create smart account');

      setActionSuccess(`Veltron ${smartAccountName} provisioned successfully.`);
      setTimeout(() => {
        setIsConnectModalOpen(false);
        setActionSuccess(null);
        fetchWallet();
      }, 1500);
    } catch (err: any) {
      setActionError(err.message || 'Error creating account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Handle Disconnect Account
  const handleConfirmDisconnect = async () => {
    if (!accountToDisconnect) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DISCONNECT_ACCOUNT',
          accountId: accountToDisconnect,
        }),
      });

      if (res.ok) {
        setAccountToDisconnect(null);
        fetchWallet();
      }
    } catch (err) {
      console.error('Error disconnecting account:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPrefix = CURRENCY_CONFIG[currency].symbol;

  return (
    <div className="min-h-screen bg-[#090706] text-[#E9DDCA] flex flex-col font-manrope selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Top Title and Overview Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-black text-white tracking-tight">
                Personal Financial Wallet
              </h1>
              <Badge variant="outline" className="text-valixen-ice border-valixen-ice/30">
                PCI-DSS VAULT
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Tokenized banking connections, titanium cards, real-time burn rates, and spending analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/transactions">
              <Button variant="outline" size="sm" className="border-white/10 text-slate-300 hover:text-white">
                <History className="w-4 h-4 mr-2 text-valixen-violet" />
                Ledger History
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. Metrics HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="TOTAL NET WORTH"
            value={formatMoney(wallet?.totalBalanceUsd || 0)}
            prefix=""
            change={{ value: '+4.8%', isPositive: true, period: '30D' }}
            glow="violet"
          />
          <StatCard
            title="AVAILABLE CASH"
            value={formatMoney(wallet?.availableCashUsd || 0)}
            prefix=""
            subtitle="100% Liquid Settlement"
            glow="ice"
          />
          <StatCard
            title="MONTHLY INFLOW (30D)"
            value={formatMoney(wallet?.monthlyIncomeUsd || 0)}
            prefix=""
            change={{ value: '+12.4%', isPositive: true, period: 'vs last mo' }}
            glow="profit"
          />
          <StatCard
            title="MONTHLY BURN RATE (30D)"
            value={formatMoney(wallet?.monthlyExpensesUsd || 0)}
            prefix=""
            subtitle={`Savings Rate: ${wallet?.netSavingsRatePercent || 0}%`}
            glow="none"
          />
        </div>

        {/* 4. Connected Cards & Accounts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-valixen-violet" />
              <h2 className="text-lg font-display font-bold text-white tracking-tight">
                CONNECTED FINANCIAL ASSETS
              </h2>
              <span className="text-xs font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.08]">
                {wallet?.accounts?.length || 0} Accounts Active
              </span>
            </div>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="text-xs font-mono text-valixen-ice hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Bank or Card
            </button>
          </div>

          {/* Cards Grid or Onboarding Empty State */}
          {!wallet || wallet.accounts.length === 0 ? (
            <GlassPanel variant="subtle" className="p-12 text-center border-dashed border-white/10">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-valixen-violet/20 to-valixen-ice/20 border border-valixen-violet/30 flex items-center justify-center">
                  <Landmark className="w-8 h-8 text-valixen-ice" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-display font-bold text-white">
                    No Financial Accounts Connected Yet
                  </h3>
                  <p className="text-xs text-slate-400">
                    Veltron employs bank-grade tokenization. We strictly never store card CVV or PIN numbers.
                    Connect an account through Plaid Sandbox or tokenize a card through Stripe Vault.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <button
                    onClick={() => {
                      setActiveTab('BANK');
                      setIsConnectModalOpen(true);
                    }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-valixen-telemetry-profit hover:bg-white/[0.06] transition-all text-left"
                  >
                    <Building2 className="w-5 h-5 text-valixen-telemetry-profit mb-2" />
                    <div className="text-xs font-bold text-white">Plaid Sandbox</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Sync bank account</div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('CARD');
                      setIsConnectModalOpen(true);
                    }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-valixen-gold hover:bg-white/[0.06] transition-all text-left"
                  >
                    <CreditCard className="w-5 h-5 text-valixen-gold mb-2" />
                    <div className="text-xs font-bold text-white">Stripe Vault</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Tokenized Visa/MC</div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('SMART');
                      setIsConnectModalOpen(true);
                    }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-valixen-violet hover:bg-white/[0.06] transition-all text-left"
                  >
                    <Sparkles className="w-5 h-5 text-valixen-violet mb-2" />
                    <div className="text-xs font-bold text-white">Quantum Vault</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">5.2% APY Yield</div>
                  </button>
                </div>
              </div>
            </GlassPanel>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wallet.accounts.map((acc) => (
                <AnimatedFinancialCard
                  key={acc.id}
                  id={acc.id}
                  accountName={acc.accountName}
                  accountNumber={acc.accountNumber}
                  type={acc.type}
                  balance={acc.balance * CURRENCY_CONFIG[currency].rate}
                  currency={currency}
                  currencyPrefix={currency === 'UZS' ? '' : currentPrefix}
                  cardBrand={acc.cardBrand || 'VELTRON'}
                  expDate={acc.expDate}
                  provider={acc.provider}
                  status={acc.status}
                  hideBalance={hideBalance}
                  onDisconnect={(id) => setAccountToDisconnect(id)}
                />
              ))}

              {/* Add New Card Slot */}
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="group relative aspect-[1.586/1] w-full rounded-3xl p-6 border border-dashed border-white/10 hover:border-valixen-ice/50 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white"
              >
                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-valixen-ice transition-all">
                  <Plus className="w-6 h-6 text-valixen-ice" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold block">Add Financial Asset</span>
                  <span className="text-xs text-slate-400">Open Banking, Card, or Vault</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 5. Spending Categories & Monthly Report Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Spending Analytics (7 cols) */}
          <div className="lg:col-span-7">
            <GlassPanel variant="default" className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-valixen-ice" />
                    <h3 className="text-base font-display font-bold text-white">
                      SPENDING CATEGORIES (30D)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Total: {formatMoney(wallet?.monthlyExpensesUsd || 0)}
                  </span>
                </div>

                <div className="space-y-4">
                  {wallet?.spendingCategories?.map((cat) => (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-mono font-medium text-slate-200">
                            {cat.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({cat.transactionCount} transactions)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-300 font-semibold">
                            {formatMoney(cat.amount)}
                          </span>
                          <span className="font-mono text-slate-400 w-10 text-right">
                            {cat.percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(cat.percentage, 100)}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] mt-6 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />
                  Real-time transaction classification
                </span>
                <Link
                  href="/transactions"
                  className="text-valixen-ice hover:underline flex items-center gap-1 font-mono"
                >
                  View Categorized Ledger
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassPanel>
          </div>

          {/* Monthly Report Card (5 cols) */}
          <div className="lg:col-span-5">
            <GlassPanel variant="default" className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-valixen-violet" />
                    <h3 className="text-base font-display font-bold text-white">
                      MONTHLY EXECUTIVE STATEMENT
                    </h3>
                  </div>
                  <Badge variant="outline" className="border-valixen-violet/30 text-valixen-violet text-[10px]">
                    {wallet?.monthlyReport?.period || 'October 2026'}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">
                        Total Deposits
                      </span>
                      <span className="text-base font-display font-bold text-valixen-telemetry-profit">
                        +{formatMoney(wallet?.monthlyReport?.totalDeposits || 0)}
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-valixen-telemetry-profit" />
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">
                        Total Outflows
                      </span>
                      <span className="text-base font-display font-bold text-slate-300">
                        -{formatMoney(wallet?.monthlyReport?.totalSpend || 0)}
                      </span>
                    </div>
                    <ArrowDownRight className="w-5 h-5 text-slate-400" />
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">
                        Net Savings Cashflow
                      </span>
                      <span className="text-base font-display font-bold text-white">
                        {formatMoney(wallet?.monthlyReport?.netCashFlow || 0)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-valixen-telemetry-profit">
                        {wallet?.monthlyReport?.savingsRate || 0}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">Rate</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs px-2 pt-1">
                    <span className="text-slate-400">Primary Expenditure:</span>
                    <span className="font-mono font-semibold text-valixen-ice">
                      {wallet?.monthlyReport?.topCategory || 'INVESTMENTS'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] mt-6">
                <Link href="/transactions">
                  <Button variant="outline" size="sm" className="w-full border-white/10 hover:border-valixen-violet text-xs">
                    Download Full Statement (CSV)
                  </Button>
                </Link>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* 6. Recent Transactions Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-valixen-ice" />
              <h2 className="text-lg font-display font-bold text-white tracking-tight">
                RECENT SETTLED TRANSACTIONS
              </h2>
            </div>

            <Link
              href="/transactions"
              className="text-xs font-mono text-valixen-violet hover:underline flex items-center gap-1"
            >
              View All Transactions
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <GlassPanel variant="default" className="overflow-hidden">
            <div className="divide-y divide-white/[0.04]">
              {!wallet || wallet.recentTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No settled transactions recorded. Connect an account to start syncing activity.
                </div>
              ) : (
                wallet.recentTransactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.type === 'DEPOSIT' || tx.type === 'DIVIDEND_PAYOUT'
                            ? 'bg-valixen-telemetry-profit/10 text-valixen-telemetry-profit'
                            : 'bg-white/[0.04] text-slate-300'
                        }`}
                      >
                        {tx.type === 'DEPOSIT' || tx.type === 'DIVIDEND_PAYOUT' ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="font-semibold text-white">
                          {tx.counterparty || tx.description || 'Institutional Settlement'}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{tx.referenceNumber}</span>
                          <span>•</span>
                          <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-mono font-bold ${
                          tx.type === 'DEPOSIT' || tx.type === 'DIVIDEND_PAYOUT'
                            ? 'text-valixen-telemetry-profit'
                            : 'text-slate-100'
                        }`}
                      >
                        {tx.type === 'DEPOSIT' || tx.type === 'DIVIDEND_PAYOUT' ? '+' : '-'}
                        {formatMoney(tx.amount)}
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 mt-0.5 border-white/10 text-slate-400">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassPanel>
        </div>
      </main>

      {/* 7. Multi-Tab "Connect Account / Card" Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false);
          setActionError(null);
          setActionSuccess(null);
        }}
        title="CONNECT FINANCIAL ASSET"
      >
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setActiveTab('BANK')}
              className={`pb-3 px-3 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'BANK'
                  ? 'border-b-2 border-valixen-telemetry-profit text-valixen-telemetry-profit'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Plaid Open Banking
            </button>
            <button
              onClick={() => setActiveTab('CARD')}
              className={`pb-3 px-3 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'CARD'
                  ? 'border-b-2 border-valixen-gold text-valixen-gold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Tokenized Card (Stripe)
            </button>
            <button
              onClick={() => setActiveTab('SMART')}
              className={`pb-3 px-3 font-semibold transition-colors flex items-center gap-2 ${
                activeTab === 'SMART'
                  ? 'border-b-2 border-valixen-violet text-valixen-violet'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Veltron Vault
            </button>
          </div>

          {/* Feedback Messages */}
          {actionError && (
            <div className="p-3 rounded-lg bg-valixen-telemetry-risk/10 border border-valixen-telemetry-risk/20 text-valixen-telemetry-risk text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {actionSuccess && (
            <div className="p-3 rounded-lg bg-valixen-telemetry-profit/10 border border-valixen-telemetry-profit/20 text-valixen-telemetry-profit text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: Plaid Open Banking */}
          {activeTab === 'BANK' && (
            <form onSubmit={handleConnectBank} className="space-y-4">
              <div className="p-3 rounded-xl bg-valixen-telemetry-profit/5 border border-valixen-telemetry-profit/20 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-valixen-telemetry-profit">
                  <ShieldCheck className="w-4 h-4" />
                  PLAID SANDBOX ENVIRONMENT
                </div>
                <p>
                  Connect mock institution with simulated live balance ($12,500.00). Transactions will automatically sync with audit log.
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Financial Institution</label>
                <select
                  value={bankInstitution}
                  onChange={(e) => setBankInstitution(e.target.value)}
                  className="w-full bg-[#0E121B] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-valixen-telemetry-profit"
                >
                  <option value="Chase Manhattan Bank">Chase Manhattan Bank (Sandbox)</option>
                  <option value="Bank of America">Bank of America (Sandbox)</option>
                  <option value="National Bank of Uzbekistan (NBU)">National Bank of Uzbekistan (NBU)</option>
                  <option value="Barclays Capital">Barclays Capital (Sandbox)</option>
                  <option value="Silicon Valley Bank">Silicon Valley Bank (Sandbox)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Account Type</label>
                  <select
                    value={bankAccountType}
                    onChange={(e) => setBankAccountType(e.target.value)}
                    className="w-full bg-[#0E121B] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-valixen-telemetry-profit"
                  >
                    <option value="Primary Checking">Primary Checking</option>
                    <option value="High-Yield Savings">High-Yield Savings</option>
                    <option value="Commercial Operating">Commercial Operating</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Last 4 Mask</label>
                  <Input
                    value={bankMask}
                    maxLength={4}
                    onChange={(e) => setBankMask(e.target.value)}
                    placeholder="7812"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-valixen-telemetry-profit hover:bg-emerald-400 text-black font-semibold text-xs mt-2"
              >
                {isSubmitting ? 'Verifying OAuth Token...' : 'Authorize Open Banking Sync'}
              </Button>
            </form>
          )}

          {/* TAB 2: Tokenized Card via Stripe Vault */}
          {activeTab === 'CARD' && (
            <form onSubmit={handleConnectCard} className="space-y-4">
              <div className="p-3 rounded-xl bg-valixen-gold/10 border border-valixen-gold/20 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-valixen-gold">
                  <Lock className="w-4 h-4" />
                  STRICT PCI-DSS COMPLIANT VAULT
                </div>
                <p>
                  Zero CVV, CVC, or PIN collection. Card credentials are sent directly to the Stripe Vault tokenization endpoint and referenced by a secure token (<span className="font-mono text-valixen-gold">tok_...</span>).
                </p>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Cardholder Name</label>
                <Input
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Card Brand</label>
                  <select
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value as any)}
                    className="w-full bg-[#0E121B] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-valixen-gold"
                  >
                    <option value="VISA">Visa Platinum</option>
                    <option value="MASTERCARD">Mastercard World Elite</option>
                    <option value="AMEX">American Express Centurion</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Last 4 Digits</label>
                  <Input
                    value={cardLast4}
                    maxLength={4}
                    onChange={(e) => setCardLast4(e.target.value)}
                    placeholder="4242"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Expiry Month</label>
                  <Input
                    value={cardExpMonth}
                    maxLength={2}
                    onChange={(e) => setCardExpMonth(e.target.value)}
                    placeholder="12"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Expiry Year</label>
                  <Input
                    value={cardExpYear}
                    maxLength={4}
                    onChange={(e) => setCardExpYear(e.target.value)}
                    placeholder="2028"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-valixen-gold hover:bg-amber-400 text-black font-semibold text-xs mt-2"
              >
                {isSubmitting ? 'Exchanging Vault Token...' : 'Tokenize & Link Card'}
              </Button>
            </form>
          )}

          {/* TAB 3: Veltron Smart Account */}
          {activeTab === 'SMART' && (
            <form onSubmit={handleCreateSmartAccount} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Account Label</label>
                <Input
                  value={smartAccountName}
                  onChange={(e) => setSmartAccountName(e.target.value)}
                  placeholder="Veltron Quantum Reserve"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Account Tier</label>
                <select
                  value={smartAccountType}
                  onChange={(e) => setSmartAccountType(e.target.value)}
                  className="w-full bg-[#0E121B] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-valixen-violet"
                >
                  <option value="HIGH_YIELD_VAULT">High-Yield Quantum Vault (5.2% APY)</option>
                  <option value="SMART_CHECKING">Institutional Smart Checking</option>
                  <option value="CRYPTO_CUSTODY_WALLET">Multi-Sig Cold Crypto Custody</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-valixen-violet hover:bg-violet-400 text-white font-semibold text-xs mt-2"
              >
                {isSubmitting ? 'Provisioning...' : 'Provision Sovereign Account'}
              </Button>
            </form>
          )}
        </div>
      </Modal>

      {/* 8. Disconnect Confirmation Modal */}
      <Modal
        isOpen={!!accountToDisconnect}
        onClose={() => setAccountToDisconnect(null)}
        title="DISCONNECT FINANCIAL ASSET"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-valixen-telemetry-risk/10 border border-valixen-telemetry-risk/20 text-valixen-telemetry-risk text-xs">
            Are you sure you want to disconnect this financial account? Syncing will immediately halt, and an immutable security audit event will be recorded.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAccountToDisconnect(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isSubmitting}
              onClick={handleConfirmDisconnect}
              className="text-xs bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isSubmitting ? 'Disconnecting...' : 'Confirm Disconnect'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 7. LUXURY FOOTER */}
      <LuxuryFooter />
    </div>
  );
}
