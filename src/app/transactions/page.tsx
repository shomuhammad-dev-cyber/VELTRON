// ==============================================================================
// VALIXEN TRANSACTION LEDGER & AUDIT TRAIL (/transactions)
// Institutional Multi-Currency Settlement Ledger, Filter Engine & CSV Export
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
import {
  History,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Building2,
  CreditCard,
  Layers,
  FileText,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Coins,
} from 'lucide-react';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'UZS';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  UZS: { symbol: "so'm", rate: 12850.0, label: 'UZS (so‘m)' },
};

const CATEGORY_COLORS: Record<string, string> = {
  INVESTMENTS: 'bg-valixen-ice/15 text-valixen-ice border-valixen-ice/30',
  HOUSING: 'bg-valixen-violet/15 text-valixen-violet border-valixen-violet/30',
  TECHNOLOGY: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  SERVICES: 'bg-valixen-gold/15 text-valixen-gold border-valixen-gold/30',
  TRANSFERS: 'bg-valixen-telemetry-profit/15 text-valixen-telemetry-profit border-valixen-telemetry-profit/30',
};

interface TransactionItem {
  id: string;
  referenceNumber: string;
  type: string;
  amount: number;
  fee: number;
  currency: string;
  status: string;
  category: string;
  description: string | null;
  counterparty: string;
  sourceAccount?: { accountName: string; accountNumber: string; type: string } | null;
  destinationAccount?: { accountName: string; accountNumber: string; type: string } | null;
  createdAt: string;
  settledAt?: string | null;
}

export default function TransactionsPage() {
  const router = useRouter();

  // Data State
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [accounts, setAccounts] = useState<Array<{ id: string; accountName: string; accountNumber: string }>>([]);
  const [stats, setStats] = useState({
    totalInflow: 0,
    totalOutflow: 0,
    netCashFlow: 0,
    transactionCount: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [accountFilter, setAccountFilter] = useState('');
  const [dateRange, setDateRange] = useState<'ALL' | '30D' | '90D' | 'YTD'>('ALL');

  // Display State
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [hideBalance, setHideBalance] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inspector Modal
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch transactions from API
  const fetchTransactions = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25',
        type: typeFilter,
        category: categoryFilter,
        accountId: accountFilter,
        dateRange,
        search: debouncedSearch,
      });

      const res = await fetch(`/api/v1/transactions?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setTransactions(json.data.transactions);
        setAccounts(json.data.accounts || []);
        setStats(json.data.stats || { totalInflow: 0, totalOutflow: 0, netCashFlow: 0, transactionCount: 0 });
        setPagination(json.data.pagination || { page: 1, limit: 25, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error('Failed to load transaction ledger:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [typeFilter, categoryFilter, accountFilter, dateRange, debouncedSearch]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(pagination.page);
  };

  const handleCopyRef = (refNum: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(refNum);
    setCopiedId(refNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Convert USD amounts to chosen currency
  const formatMoney = (usdAmount: number) => {
    if (hideBalance) return '••••••••';
    const conf = CURRENCY_CONFIG[currency];
    const converted = usdAmount * conf.rate;
    if (currency === 'UZS') {
      return `${Math.round(converted).toLocaleString()} ${conf.symbol}`;
    }
    return `${conf.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Export CSV statement
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Reference', 'Date', 'Type', 'Category', 'Counterparty', 'Description', 'Amount USD', 'Status'];
    const rows = transactions.map((t) => [
      t.referenceNumber,
      new Date(t.createdAt).toISOString(),
      t.type,
      t.category,
      `"${t.counterparty.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `valixen_statement_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Top Title and Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display font-black text-white tracking-tight">
                Institutional Transaction Ledger
              </h1>
              <Badge variant="outline" className="text-valixen-telemetry-profit border-valixen-telemetry-profit/30">
                AUDITED
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Cryptographically verified transaction history, multi-account settlement logs, and categorized financial events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/wallet">
              <Button variant="default" size="sm" className="bg-valixen-violet text-white">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Accounts
              </Button>
            </Link>
          </div>
        </div>

        {/* 3. Summary Statistics KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="TOTAL INFLOW (CREDITS)"
            value={formatMoney(stats.totalInflow)}
            prefix=""
            subtitle="Deposits & Yields"
            glow="profit"
          />
          <StatCard
            title="TOTAL OUTFLOW (DEBITS)"
            value={formatMoney(stats.totalOutflow)}
            prefix=""
            subtitle="Withdrawals & Outlays"
            glow="none"
          />
          <StatCard
            title="NET CASH FLOW"
            value={formatMoney(stats.netCashFlow)}
            prefix=""
            change={{
              value: stats.netCashFlow >= 0 ? '+Surplus' : '-Deficit',
              isPositive: stats.netCashFlow >= 0,
            }}
            glow={stats.netCashFlow >= 0 ? 'ice' : 'risk'}
          />
          <StatCard
            title="SETTLED TRANSACTIONS"
            value={stats.transactionCount.toString()}
            prefix=""
            subtitle="100% Cryptographically Finalized"
            glow="violet"
          />
        </div>

        {/* 4. Filtering & Search Toolbar */}
        <GlassPanel variant="default" className="p-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by reference ID, counterparty, description..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-valixen-violet"
              />
            </div>

            {/* Account Filter */}
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-violet cursor-pointer"
            >
              <option value="" className="bg-[#0E121B]">All Connected Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-[#0E121B]">
                  {acc.accountName} ({acc.accountNumber})
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-violet cursor-pointer"
            >
              <option value="ALL" className="bg-[#0E121B]">All Types</option>
              <option value="DEPOSIT" className="bg-[#0E121B]">Deposits & Inflows</option>
              <option value="WITHDRAWAL" className="bg-[#0E121B]">Withdrawals & Outflows</option>
              <option value="TRANSFER" className="bg-[#0E121B]">Internal Transfers</option>
              <option value="FEE" className="bg-[#0E121B]">Fees & Network Costs</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-valixen-violet cursor-pointer"
            >
              <option value="ALL" className="bg-[#0E121B]">All Categories</option>
              <option value="INVESTMENTS" className="bg-[#0E121B]">Investments</option>
              <option value="TECHNOLOGY" className="bg-[#0E121B]">Technology</option>
              <option value="HOUSING" className="bg-[#0E121B]">Housing</option>
              <option value="SERVICES" className="bg-[#0E121B]">Services</option>
              <option value="TRANSFERS" className="bg-[#0E121B]">Transfers</option>
            </select>

            {/* Date Range Pills */}
            <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 self-start lg:self-auto">
              {(['ALL', '30D', '90D', 'YTD'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                    dateRange === range
                      ? 'bg-valixen-violet text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* 5. Detailed Transactions Table */}
        <GlassPanel variant="default" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-white/[0.01]">
                  <th className="py-3.5 px-4 font-semibold">Reference & Date</th>
                  <th className="py-3.5 px-4 font-semibold">Counterparty / Description</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Account</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-valixen-violet" />
                        <span>Verifying cryptographic transaction history...</span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                          <History className="w-6 h-6 text-slate-500" />
                        </div>
                        <div className="font-semibold text-white">No Transactions Found</div>
                        <p className="text-[11px] text-slate-500">
                          Try adjusting search terms, dates, or connecting an account in the Personal Wallet.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearch('');
                            setTypeFilter('ALL');
                            setCategoryFilter('ALL');
                            setAccountFilter('');
                            setDateRange('ALL');
                          }}
                          className="text-xs border-white/10"
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isCredit = tx.type === 'DEPOSIT' || tx.type === 'DIVIDEND_PAYOUT';
                    const categoryBadgeClass =
                      CATEGORY_COLORS[tx.category] || 'bg-white/10 text-white border-white/20';

                    return (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                      >
                        {/* Reference & Date */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white group-hover:text-valixen-ice transition-colors">
                              {tx.referenceNumber}
                            </span>
                            <button
                              onClick={(e) => handleCopyRef(tx.referenceNumber, e)}
                              className="text-slate-500 hover:text-white transition-colors"
                              title="Copy Reference"
                            >
                              {copiedId === tx.referenceNumber ? (
                                <Check className="w-3 h-3 text-valixen-telemetry-profit" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        {/* Counterparty & Description */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-slate-200 truncate">
                            {tx.counterparty}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {tx.description || 'Settlement verified via Valixen Engine'}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${categoryBadgeClass}`}
                          >
                            {tx.category}
                          </span>
                        </td>

                        {/* Account */}
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-mono text-slate-300 block">
                            {tx.sourceAccount?.accountName || tx.destinationAccount?.accountName || 'Valixen Vault'}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 block">
                            {tx.sourceAccount?.accountNumber || tx.destinationAccount?.accountNumber || 'Primary'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 text-right">
                          <div
                            className={`font-mono font-bold text-sm ${
                              isCredit ? 'text-valixen-telemetry-profit' : 'text-slate-100'
                            }`}
                          >
                            {isCredit ? '+' : '-'}
                            {formatMoney(tx.amount)}
                          </div>
                          {tx.fee > 0 && (
                            <div className="text-[9px] font-mono text-slate-500">
                              Fee: {formatMoney(tx.fee)}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <Badge
                            variant={tx.status === 'COMPLETED' ? 'outline' : 'default'}
                            className={`text-[9px] px-2 py-0.5 font-mono ${
                              tx.status === 'COMPLETED'
                                ? 'text-valixen-telemetry-profit border-valixen-telemetry-profit/30'
                                : 'text-valixen-gold border-valixen-gold/30'
                            }`}
                          >
                            {tx.status}
                          </Badge>
                        </td>

                        {/* Inspect Audit */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTx(tx);
                            }}
                            className="p-1 rounded-lg text-slate-500 hover:text-valixen-ice hover:bg-white/[0.04] transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing page <span className="font-mono text-white font-semibold">{pagination.page}</span> of{' '}
                <span className="font-mono text-white font-semibold">{pagination.totalPages}</span> ({pagination.total} total)
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchTransactions(pagination.page - 1)}
                  className="border-white/10 text-xs px-2.5 py-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchTransactions(pagination.page + 1)}
                  className="border-white/10 text-xs px-2.5 py-1"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>
      </main>

      {/* 6. Transaction Audit Inspector Modal */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="TRANSACTION AUDIT CERTIFICATE"
      >
        {selectedTx && (
          <div className="space-y-6 text-xs">
            {/* Header Status */}
            <div className="p-4 rounded-xl bg-valixen-telemetry-profit/10 border border-valixen-telemetry-profit/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-valixen-telemetry-profit">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <div className="font-bold">Cryptographically Settled & Verified</div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    Immutable SHA-256 Ledger Record
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="border-valixen-telemetry-profit text-valixen-telemetry-profit font-mono">
                {selectedTx.status}
              </Badge>
            </div>

            {/* Amount Banner */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Settled Amount
              </span>
              <div className="text-3xl font-display font-black text-white">
                {formatMoney(selectedTx.amount)}
              </div>
              <span className="text-xs font-mono text-valixen-ice block">
                {selectedTx.type} • {selectedTx.category}
              </span>
            </div>

            {/* Details Grid */}
            <div className="space-y-2 border-t border-b border-white/[0.06] py-3 font-mono text-[11px]">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Reference Number:</span>
                <span className="text-white font-bold">{selectedTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Counterparty:</span>
                <span className="text-slate-200">{selectedTx.counterparty}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account:</span>
                <span className="text-slate-200">
                  {selectedTx.sourceAccount?.accountName || selectedTx.destinationAccount?.accountName || 'Valixen Vault'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Initiation Timestamp:</span>
                <span className="text-slate-300">{new Date(selectedTx.createdAt).toUTCString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Finality Timestamp:</span>
                <span className="text-valixen-telemetry-profit">
                  {selectedTx.settledAt ? new Date(selectedTx.settledAt).toUTCString() : 'Instant Settlement'}
                </span>
              </div>
            </div>

            <div className="text-slate-400 text-[11px]">
              <span className="block font-semibold text-slate-200 mb-0.5">Description:</span>
              <p className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                {selectedTx.description || 'No additional settlement metadata provided.'}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTx(null)}
                className="text-xs border-white/10"
              >
                Close Certificate
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
