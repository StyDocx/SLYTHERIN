import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { MOTION_TOKENS, prefersReducedMotion } from './tokens';

/**
 * Optional Ambient Sound Toggle (OFF by default)
 * Synthesizes a subtle, atmospheric dungeon wind & emerald harmonic chord using Web Audio API
 * with a soft 1.2s fade in/out so no external audio files are required.
 */
export const AmbientSoundToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSound = () => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, ctx.currentTime);
        master.connect(ctx.destination);

        // Warm low D2 & A2 pad oscillators
        const freqs = [73.42, 110.0, 146.83];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(240, ctx.currentTime);
          oscGain.gain.setValueAtTime(idx === 0 ? 0.12 : 0.05, ctx.currentTime);
          osc.connect(filter);
          filter.connect(oscGain);
          oscGain.connect(master);
          osc.start();
        });

        audioCtxRef.current = ctx;
        masterGainRef.current = master;
      }

      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (ctx && master) {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.2);
      }
      setIsPlaying(true);
    } else {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
      }
      setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      className={`hero-footer__sound-btn ${isPlaying ? 'is-playing' : ''}`}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Mute ambient castle sound' : 'Enable ambient castle sound'}
      title={isPlaying ? 'Mute ambient sound' : 'Play ambient castle atmosphere'}
    >
      <span className="sound-bars" aria-hidden="true">
        <span className="sound-bar" />
        <span className="sound-bar" />
        <span className="sound-bar" />
      </span>
      <span>{isPlaying ? 'Sound On' : 'Sound Off'}</span>
    </button>
  );
};

/**
 * Page Transition Wipe between Homepage and Admin Portal
 * Uses a green-mist & golden-serpent sigil wipe with zero layout flash.
 */
export const PageTransitionWipe: React.FC<{ activeTrigger: boolean }> = ({ activeTrigger }) => {
  const wipeRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (prefersReducedMotion() || !wipeRef.current) return;

    const el = wipeRef.current;
    const tl = gsap.timeline();
    tl.set(el, { autoAlpha: 1, yPercent: 100 })
      .to(el, {
        yPercent: 0,
        duration: MOTION_TOKENS.durations.pageWipe * 0.5,
        ease: MOTION_TOKENS.easings.expoOut,
      })
      .to(el, {
        yPercent: -100,
        autoAlpha: 0,
        duration: MOTION_TOKENS.durations.pageWipe * 0.65,
        ease: MOTION_TOKENS.easings.expoOut,
      });

    return () => {
      tl.kill();
    };
  }, [activeTrigger]);

  return (
    <div ref={wipeRef} className="page-transition-wipe" aria-hidden="true">
      <div className="page-transition-wipe__sigil">🐍 SLYTHERIN SANCTUM</div>
    </div>
  );
};

