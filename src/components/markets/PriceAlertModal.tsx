// ==============================================================================
// VALIXEN ASSET PRICE ALERT MODAL
// Real-Time Threshold Alert Dispatch & Telemetry Notification Hook
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Bell, CheckCircle2 } from 'lucide-react';

export interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  currentPrice: number;
  onAlertCreated: (alert: { symbol: string; targetPrice: number; direction: 'ABOVE' | 'BELOW' }) => void;
}

export function PriceAlertModal({
  isOpen,
  onClose,
  symbol,
  currentPrice,
  onAlertCreated,
}: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(
    (currentPrice * 1.05).toFixed(currentPrice < 10 ? 4 : 2)
  );
  const [direction, setDirection] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAlertCreated({
      symbol,
      targetPrice: parseFloat(targetPrice),
      direction,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`CREATE PRICE ALERT: ${symbol}`}
      size="sm"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-valixen-telemetry-profit mx-auto" />
          <p className="text-sm font-mono text-white">Price alert activated for {symbol} at ${targetPrice}!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs font-mono text-slate-300">
            Current Price: <strong className="text-white">${currentPrice.toLocaleString()}</strong>
          </p>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">TRIGGER CONDITION</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setDirection('ABOVE')}
                className={`py-2 px-3 rounded-lg border text-center font-bold ${
                  direction === 'ABOVE'
                    ? 'bg-valixen-telemetry-profit/20 border-valixen-telemetry-profit text-valixen-telemetry-profit'
                    : 'bg-white/[0.02] border-white/10 text-slate-400'
                }`}
              >
                RISES ABOVE ▲
              </button>
              <button
                type="button"
                onClick={() => setDirection('BELOW')}
                className={`py-2 px-3 rounded-lg border text-center font-bold ${
                  direction === 'BELOW'
                    ? 'bg-valixen-telemetry-risk/20 border-valixen-telemetry-risk text-valixen-telemetry-risk'
                    : 'bg-white/[0.02] border-white/10 text-slate-400'
                }`}
              >
                DROPS BELOW ▼
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">TARGET PRICE ($)</label>
            <Input
              type="number"
              required
              step="any"
              value={targetPrice}
              onChange={(e: any) => setTargetPrice(e.target.value)}
              placeholder="e.g. 72000"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="w-full font-mono font-bold">
              ACTIVATE TELEMETRY ALERT →
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
