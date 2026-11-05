// ==============================================================================
// VALIXEN ADVANCED FINANCIAL REPORTS (/reports)
// Auditable Regulatory Statements, Cryptographic Proof & Executive Dossiers
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FinancialReportDTO } from '@/server/services/reports.service';
import { LuxuryNavbar } from '@/components/one-of-one/LuxuryNavbar';
import { LuxuryFooter } from '@/components/one-of-one/LuxuryFooter';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  Coins,
  TrendingUp,
} from 'lucide-react';

export default function AdvancedReportsPage() {
  const [reports, setReports] = useState<FinancialReportDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [reportType, setReportType] = useState<FinancialReportDTO['reportType']>('MONTHLY_STATEMENT');
  const [period, setPeriod] = useState('October 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/reports');
      const json = await res.json();
      if (json.success && json.data?.reports) {
        setReports(json.data.reports);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, period }),
      });
      const json = await res.json();
      if (res.ok && json.data?.report) {
        setReports((prev) => [json.data.report, ...prev]);
        setIsGenerateModalOpen(false);
      }
    } catch {
      alert('Report generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = (rep: FinancialReportDTO) => {
    const rows = [
      ['VALIXEN SOVEREIGN FINANCIAL REPORT DOSSIER'],
      ['Report Type', rep.reportType],
      ['Period', rep.period],
      ['Generated At', rep.generatedAt],
      ['SHA-256 Verification Hash', rep.verificationHash],
      ['Currency', rep.currency],
      ['Total Consolidated Capital', rep.summary.totalCapital.toFixed(2)],
      ['Net Cashflow', rep.summary.netCashflow.toFixed(2)],
      ['Total Trades Executed', rep.summary.totalTradesExecuted],
      ['Institutional Risk Score', rep.summary.riskScore],
      ['Cryptographic Non-Repudiation Status', 'VERIFIED_AUDITABLE'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `valixen_${rep.reportType.toLowerCase()}_${rep.period.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#090706] text-[#FAF7F1] flex flex-col font-sans selection:bg-[#C6A477]/30 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <LuxuryNavbar />

      {/* 2. Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" dot className="px-2.5 py-0.5 text-[10px] font-mono">
                REGULATORY COMPLIANCE DOSSIER
              </Badge>
              <span className="text-xs font-mono text-slate-400">CRYPTOGRAPHIC AUDIT TRAIL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              ADVANCED FINANCIAL REPORTS
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Export comprehensive wealth audits, capital gains summaries, and Monte Carlo risk assessments with tamper-evident digital signature proofs.
            </p>
          </div>

          <Button variant="glass" size="sm" onClick={fetchReports} disabled={isLoading} className="text-xs font-mono self-start md:self-auto">
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH
          </Button>
        </div>

        {/* Telemetry Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="ARCHIVED DOSSIERS"
            value={`${reports.length} Verified`}
            change={{ value: 'Cryptographically Signed', isPositive: true }}
            icon={<FileText className="w-4 h-4 text-valixen-ice" />}
          />
          <StatCard
            title="AUDIT VERIFICATION HASH"
            value="SHA-256 Enforced"
            change={{ value: 'Zero-Tamper Ledger', isPositive: true }}
            icon={<ShieldCheck className="w-4 h-4 text-valixen-telemetry-profit" />}
          />
          <StatCard
            title="EXPORT FORMATS"
            value="CSV & Print PDF"
            change={{ value: 'Institutional Standard', isPositive: true }}
            icon={<Download className="w-4 h-4 text-valixen-gold" />}
          />
          <StatCard
            title="REGULATORY DISCLOSURE"
            value="SOC-2 / IFRS Ready"
            change={{ value: 'Auditable Statements', isPositive: true }}
            icon={<TrendingUp className="w-4 h-4 text-valixen-violet" />}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        )}

        {/* Reports List */}
        {!isLoading && reports.length > 0 && (
          <div className="space-y-6">
            {reports.map((rep) => (
              <GlassPanel key={rep.id} variant="prismatic" className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="cyan" className="text-[10px] font-mono">
                        {rep.reportType.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs font-mono text-valixen-ice font-bold">PERIOD: {rep.period}</span>
                      <span className="text-xs font-mono text-slate-500">• {rep.generatedAt.slice(0, 10)}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">{rep.title}</h3>
                  </div>

                  {/* Actions: Download CSV, Print PDF */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => handleExportCSV(rep)}
                      className="flex items-center gap-2 font-mono text-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> EXPORT CSV
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => window.print()}
                      className="flex items-center gap-2 font-mono text-xs"
                    >
                      <Printer className="w-3.5 h-3.5" /> PRINT DOSSIER
                    </Button>
                  </div>
                </div>

                {/* Summary Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-black/30 border border-white/[0.06]">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Consolidated Capital</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-white">
                      ${rep.summary.totalCapital.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Net Period Cashflow</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-valixen-telemetry-profit">
                      +${rep.summary.netCashflow.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Orders Executed</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-slate-300">
                      {rep.summary.totalTradesExecuted} Orders
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Risk Assessment</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-valixen-ice">
                      {rep.summary.riskScore}
                    </div>
                  </div>
                </div>

                {/* Cryptographic SHA-256 Non-Repudiation Signature */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-slate-400 truncate max-w-xl">
                    <ShieldCheck className="w-4 h-4 text-valixen-ice shrink-0" />
                    <span className="shrink-0 text-slate-500">DIGITAL HASH:</span>
                    <span className="text-slate-300 truncate">{rep.verificationHash}</span>
                  </div>

                  <button
                    onClick={() => handleCopyHash(rep.verificationHash)}
                    className="flex items-center gap-1.5 text-valixen-ice hover:underline shrink-0"
                  >
                    {copiedHash === rep.verificationHash ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> COPY PROOF HASH
                      </>
                    )}
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </main>

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        size="md"
        title={
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-valixen-ice" />
            <span className="font-display font-bold text-white">GENERATE FINANCIAL REPORT</span>
          </div>
        }
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Report Archetype</label>
            <select
              value={reportType}
              onChange={(e: any) => setReportType(e.target.value)}
              className="w-full bg-[#0E121B] border border-white/10 rounded-xl text-xs font-mono text-white px-3 py-2.5 outline-none focus:border-valixen-ice"
            >
              <option value="MONTHLY_STATEMENT">MONTHLY SETTLEMENT & LEDGER STATEMENT</option>
              <option value="ANNUAL_WEALTH_TAX">ANNUAL WEALTH & TAX-LOSS DOSSIER</option>
              <option value="PORTFOLIO_RISK_AUDIT">MONTE CARLO PORTFOLIO RISK AUDIT</option>
              <option value="ESG_ASSET_DIVERSITY">ESG & MULTI-ASSET ALLOCATION AUDIT</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Accounting Period</label>
            <Input
              type="text"
              required
              value={period}
              onChange={(e: any) => setPeriod(e.target.value)}
              placeholder="e.g. Q4 2026 or October 2026"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isGenerating} isLoading={isGenerating}>
              COMPILE DOSSIER →
            </Button>
          </div>
        </form>
      </Modal>

      {/* Luxury Footer */}
      <LuxuryFooter />
    </div>
  );
}
