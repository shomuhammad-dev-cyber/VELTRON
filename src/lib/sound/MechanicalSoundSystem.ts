// ==============================================================================
// VELTRON LUXURY HOROLOGY MECHANICAL SOUND SYSTEM
// Native Web Audio API Synthesis: Escapement Ticks, Mechanical Clicks & Modals
// Zero external asset dependencies, 100% Autoplay-compliant & Browser Safe
// ==============================================================================

'use client';

class MechanicalSoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.25; // Subtle, elegant baseline volume
  private isInitialized: boolean = false;
  private isTickingActive: boolean = false;
  private tickIntervalId: any = null;
  private tickAlternate: boolean = false;
  private lastClickTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('veltron_audio_muted');
      this.isMuted = savedMute === 'true';

      const savedVol = localStorage.getItem('veltron_audio_volume');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }
    }
  }

  /**
   * Initializes or resumes the AudioContext on first authentic user gesture
   */
  public initContext(): boolean {
    if (typeof window === 'undefined') return false;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.isInitialized = true;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return Boolean(this.ctx);
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('veltron_audio_muted', muted ? 'true' : 'false');
    }
    if (muted && this.isTickingActive) {
      this.stopContinuousTicking();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('veltron_audio_volume', this.volume.toString());
    }
  }

  /**
   * Synthesizes an ultra-delicate mechanical escapement pallet tick
   * Alternates subtly in pitch between "tick" (3.8 kHz) and "tock" (3.4 kHz)
   */
  public playTick(): void {
    if (this.isMuted || !this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      this.tickAlternate = !this.tickAlternate;
      const baseFreq = this.tickAlternate ? 3850 : 3420;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.022);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.Q.setValueAtTime(8, now);

      const effectiveGain = this.volume * 0.18; // Very soft, authentic escapement sound
      gain.gain.setValueAtTime(effectiveGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }

  /**
   * Synthesizes a tactile, luxury mechanical watch pusher/button click
   */
  public playClick(): void {
    if (this.isMuted || !this.initContext() || !this.ctx) return;

    // Throttle clicks to avoid overlapping pile-ups
    const nowMs = Date.now();
    if (nowMs - this.lastClickTime < 60) return;
    this.lastClickTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.035);

      const effectiveGain = this.volume * 0.35;
      gain.gain.setValueAtTime(effectiveGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  /**
   * Synthesizes a soft mechanical crown winding / gear engagement sound
   */
  public playWinding(): void {
    if (this.isMuted || !this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const offset = now + i * 0.03;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1800 + i * 150, offset);
        osc.frequency.exponentialRampToValueAtTime(400, offset + 0.02);

        gain.gain.setValueAtTime(this.volume * 0.15, offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, offset + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(offset);
        osc.stop(offset + 0.022);
      }
    } catch {}
  }

  /**
   * Synthesizes an exquisite smooth mechanical modal slide open sound
   */
  public playModalOpen(): void {
    if (this.isMuted || !this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(this.volume * 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /**
   * Synthesizes a subtle precision mechanical latch closure sound
   */
  public playModalClose(): void {
    if (this.isMuted || !this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

      gain.gain.setValueAtTime(this.volume * 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  /**
   * Starts a continuous, subtle 1 Hz mechanical escapement tick
   */
  public startContinuousTicking(): void {
    if (this.isTickingActive || typeof window === 'undefined') return;
    this.isTickingActive = true;

    // Start interval
    this.tickIntervalId = setInterval(() => {
      if (!this.isMuted) {
        this.playTick();
      }
    }, 1000);
  }

  public stopContinuousTicking(): void {
    this.isTickingActive = false;
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }
}

export const soundSystem = new MechanicalSoundSystem();
export const mechanicalAudio = soundSystem;
