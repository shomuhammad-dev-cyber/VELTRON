// ==============================================================================
// VALIXEN COMMUNITY CONTENT REPORT MODAL
// Allows members to report policy violations, spam, profit guarantees or fraud
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ReportReason } from '@/server/services/community.service';
import { ShieldAlert, AlertTriangle, Send } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  commentId?: string;
  onReportSubmitted?: () => void;
}

export function ReportModal({ isOpen, onClose, postId, commentId, onReportSubmitted }: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>('PROFIT_GUARANTEE');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const reasonsList: { value: ReportReason; label: string; desc: string }[] = [
    {
      value: 'PROFIT_GUARANTEE',
      label: 'Investment Profit Guarantee',
      desc: 'Promises guaranteed returns, risk-free yields, or 100% profit',
    },
    {
      value: 'MISLEADING_CLAIMS',
      label: 'Misleading Financial Claims',
      desc: 'Get-rich-quick claims, unverified money hacks or deceptive signals',
    },
    {
      value: 'SPAM',
      label: 'Spam / Advertising',
      desc: 'Repetitive messages, affiliate links, or automated promotion',
    },
    {
      value: 'PRIVATE_INFO',
      label: 'Private Information / Security',
      desc: 'Card numbers, credentials, passwords, or personal data',
    },
    {
      value: 'IMPERSONATION',
      label: 'Impersonation',
      desc: 'Falsely claiming to be Veltron staff, admin or another user',
    },
    {
      value: 'INAPPROPRIATE',
      label: 'Inappropriate or Abusive',
      desc: 'Harassment, hate speech, or general platform misconduct',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/v1/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REPORT',
          postId,
          commentId,
          reportReason: reason,
          reportDetails: details,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Report submission failed');

      setStatusMessage('Report received. Our moderation system will review this dispatch promptly.');
      setTimeout(() => {
        setStatusMessage(null);
        setDetails('');
        onClose();
        if (onReportSubmitted) onReportSubmitted();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="REPORT POLICY VIOLATION"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 sm:px-0 md:px-0 lg:px-0">
        <p className="text-xs text-slate-400 font-sans">
          Select the rule violation that applies to this content. Verified reports are triaged by algorithmic monitors and compliance officers.
        </p>

        {statusMessage ? (
          <div className="p-3.5 rounded-xl bg-valixen-telemetry-profit/20 border border-valixen-telemetry-profit/40 text-valixen-telemetry-profit text-xs font-mono">
            {statusMessage}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">VIOLATION CATEGORY</label>
              <div className="space-y-2">
                {reasonsList.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      reason === r.value
                        ? 'bg-valixen-violet/20 border-valixen-violet/60 text-white'
                        : 'bg-black/30 border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="mt-0.5 text-valixen-violet focus:ring-0"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-white">{r.label}</div>
                      <div className="text-[11px] text-slate-400">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">ADDITIONAL DETAILS (OPTIONAL)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide context on why this content violates community policies..."
                className="w-full h-20 p-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-valixen-violet"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="font-mono text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
