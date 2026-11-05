// ==============================================================================
// VELTRON ITALIAN ELEGANCE MODAL DIALOG
// Contemporary Classic Luxury Vault Dialog — Antique Gold & Deep Espresso
// ==============================================================================

'use client';

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  className,
}: ModalProps) {
  // Handle ESC key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Espresso Dark Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0D0706]/85 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      {/* Italian Vault Modal Card */}
      <div
        className={cn(
          'relative w-full z-10 my-8 transition-all duration-300 rounded-2xl bg-[#1A110E] border border-[#C1A477]/40 shadow-2xl overflow-hidden text-[#F0E8DC]',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="px-6 py-5 border-b border-[#C1A477]/20 flex items-start justify-between gap-4 bg-[#140C0A]">
            <div className="space-y-1">
              {title && (
                <h3 className="text-lg font-bespoke-serif text-[#FAF7F1] tracking-wide flex items-center gap-2">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#F0E8DC]/70 font-sans leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#C1A477] hover:text-[#FAF7F1] hover:bg-[#211714] transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Action Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#C1A477]/20 bg-[#140C0A] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
