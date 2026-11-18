/**
 * Shared Motion Tokens for SLYTHERIN — The House Event
 * Centralizes durations, easings, staggers, parallax depth speeds, and capability checks.
 */

export const MOTION_TOKENS = {
  durations: {
    introTotalMax: 3.3,
    introSigilDraw: 1.05,
    introFogPart: 1.15,
    cameraPush: 2.7,
    navLineDraw: 0.75,
    navLinkFade: 0.55,
    crestDrop: 0.7,
    titleCharReveal: 0.85,
    titleShineSweep: 1.4,
    subtitleReveal: 0.8,
    mottoWordFade: 0.52,
    serpentDividerDraw: 0.85,
    ctaReveal: 0.65,
    cardReveal: 0.75,
    footerReveal: 0.65,
    hoverFast: 0.24,
    hoverSmooth: 0.42,
    pageWipe: 0.55,
  },

  easings: {
    expoOut: 'expo.out',
    power3Out: 'power3.out',
    power2Out: 'power2.out',
    power2InOut: 'power2.inOut',
    sineInOut: 'sine.inOut',
    backOut: 'back.out(1.35)',
  },

  staggers: {
    navLinks: 0.055,
    titleChars: 0.045,
    mottoWords: 0.11,
    ctas: 0.1,
    cards: 0.12,
    socials: 0.07,
  },

  parallax: {
    // Max pixel translation on desktop pointer move (+/- px)
    sky: { x: 8, y: 5, scrollY: -22 },
    moon: { x: 13, y: 8, scrollY: -36 },
    castle: { x: 17, y: 10, scrollY: -50 },
    forest: { x: 21, y: 12, scrollY: -68 },
    foreground: { x: 25, y: 14, scrollY: -86 },
  },

  particles: {
    desktopCount: 58,
    mobileCount: 18,
    burstCount: 14,
  },

  cards: {
    maxTiltDeg: 6,
    magneticRadiusPx: 82,
    magneticStrengthX: 9,
    magneticStrengthY: 5,
  },
} as const;

export const INTRO_STORAGE_KEY = 'slytherin_intro_seen_v1';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchOrMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth <= 1024 ||
    ('ontouchstart' in window) ||
    navigator.maxTouchPoints > 0
  );
}

