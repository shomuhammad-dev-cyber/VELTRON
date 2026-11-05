// ==============================================================================
// VELTRON LUXURY HOROLOGY SOUND CONTROLLER COMPONENT
// Gold mechanical watch audio toggle with volume slider & haptic feedback
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';

function Volume2({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function VolumeX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
import { soundSystem } from '@/lib/sound/MechanicalSoundSystem';
import { cn } from '@/lib/utils';

export function SoundController({ className }: { className?: string }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMuted(soundSystem.getMuted());
    setVolume(soundSystem.getVolume());
  }, []);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = soundSystem.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundSystem.playClick();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundSystem.setVolume(newVol);
    if (isMuted) {
      soundSystem.setMuted(false);
      setIsMuted(false);
    }
  };

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <button
        onClick={handleToggleMute}
        onMouseEnter={() => setIsOpen(true)}
        className={cn(
          'p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all duration-300',
          !isMuted
            ? 'bg-valixen-gold/15 border-valixen-gold/40 text-valixen-gold shadow-[0_0_20px_rgba(212,175,55,0.25)]'
            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
        )}
        title={isMuted ? 'Unmute Mechanical Watch Sounds' : 'Mute Mechanical Watch Sounds'}
      >
        {!isMuted ? (
          <>
            <div className="flex items-center gap-0.5 h-3.5">
              <span className="w-0.5 h-2 bg-valixen-gold rounded animate-[pulse_0.5s_infinite]" />
              <span className="w-0.5 h-3.5 bg-valixen-gold rounded animate-[pulse_0.8s_infinite]" />
              <span className="w-0.5 h-1.5 bg-valixen-gold rounded animate-[pulse_0.6s_infinite]" />
            </div>
            <span className="text-[10px] hidden sm:inline tracking-wider font-bold">HOROLOGY AUDIO</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline tracking-wider">AUDIO MUTED</span>
          </>
        )}
      </button>

      {/* Volume Slider Popover on Hover/Focus */}
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full right-0 mt-2 p-3 w-44 rounded-xl bg-[#0E1015]/95 border border-valixen-gold/30 shadow-2xl backdrop-blur-xl z-50 space-y-2"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-valixen-gold">
            <span>VOLUME</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-valixen-gold"
          />
          <div className="text-[9px] font-mono text-slate-400 text-center">
            Escapement Tick: 1 Hz
          </div>
        </div>
      )}
    </div>
  );
}
