import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  INTRO_STORAGE_KEY,
  MOTION_TOKENS,
  isTouchOrMobile,
  prefersReducedMotion,
} from './tokens';

interface IntroControllerProps {
  stageRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Orchestrates the once-per-session Skippable Intro Sequence (max 3.3s)
 * and the ONE GSAP Master Timeline with labels ("sigil", "fogPart", "navbar",
 * "heroText", "ctas", "cards", "footer").
 */
export const IntroOverlay: React.FC<IntroControllerProps> = ({ stageRef }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const sigilPathRef = useRef<SVGPathElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [showOverlay, setShowOverlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (prefersReducedMotion()) return false;
    try {
      return sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Reduced-motion calm static fallback: simple gentle fade, no parallax/hijack
    if (prefersReducedMotion()) {
      setShowOverlay(false);
      return;
    }

    const mobile = isTouchOrMobile();
    const speedScale = mobile ? 0.68 : 1;

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        defaults: { ease: MOTION_TOKENS.easings.expoOut },
        onComplete: () => {
          try {
            sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
          } catch {
            // ignore
          }
          setShowOverlay(false);
          // Clear temporary will-change hints after entrance finishes
          gsap.set(
            '.hero-title__char, .feature-card-link, .nav-links__item, .chamfer-btn',
            { clearProps: 'willChange' }
          );
        },
      });
      tlRef.current = master;

      // Prepare initial states (no FOUC)
      gsap.set('.parallax-layer--sky .stage-bg__img', {
        scale: showOverlay ? 1.0 : 1.04,
      });

      gsap.set('.nav-hairline__segment', {
        scaleX: 0,
        transformOrigin: (i: number) => (i % 2 === 0 ? 'right center' : 'left center'),
      });
      gsap.set('.nav-brand, .nav-links__item, .nav-cta', {
        autoAlpha: 0,
        y: -14,
      });
      gsap.set('.nav-center-ornament', {
        autoAlpha: 0,
        y: -26,
        scale: 0.86,
      });

      gsap.set('.hero-title__char', {
        yPercent: 108,
        autoAlpha: 0,
        filter: 'blur(6px)',
        willChange: 'transform, opacity, filter',
      });
      gsap.set('.hero-subtitle-line', {
        scaleX: 0,
        transformOrigin: (i: number) => (i === 0 ? 'right center' : 'left center'),
      });
      gsap.set('.hero-subtitle', {
        autoAlpha: 0,
        letterSpacing: '0.68em',
      });
      gsap.set('.hero-motto-word', {
        autoAlpha: 0,
        y: 12,
      });
      gsap.set('.tagline-diamond', {
        autoAlpha: 0,
        scale: 0,
      });
      gsap.set('.hero-divider-wrap', {
        autoAlpha: 0,
        scaleX: 0.35,
      });
      gsap.set('.hero-ctas .chamfer-btn', {
        autoAlpha: 0,
        y: 18,
      });
      gsap.set('.feature-cards__top-rule', {
        autoAlpha: 0,
        scaleX: 0,
      });
      gsap.set('.feature-cards__item', {
        autoAlpha: 0,
        y: 34,
        willChange: 'transform, opacity',
      });
      gsap.set('.ornate-frame__corner path', {
        strokeDasharray: 64,
        strokeDashoffset: 64,
      });
      gsap.set('.hero-footer__socials li', {
        autoAlpha: 0,
        scale: 0.6,
        y: 10,
      });
      gsap.set('.hero-footer__line', {
        scaleX: 0,
      });
      gsap.set('.hero-footer__forever, .footer-serpent-svg', {
        autoAlpha: 0,
      });
      gsap.set('.hero-footer__right-group', {
        autoAlpha: 0,
        y: 8,
      });

      // ===================================================================
      // LABEL 1: "sigil" — Black screen -> Green/Gold Serpent Sigil Draws
      // ===================================================================
      if (showOverlay && overlayRef.current && sigilPathRef.current) {
        const len = sigilPathRef.current.getTotalLength?.() || 460;
        gsap.set(sigilPathRef.current, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });

        master
          .addLabel('sigil', 0)
          .to(
            sigilPathRef.current,
            {
              strokeDashoffset: 0,
              duration: MOTION_TOKENS.durations.introSigilDraw * speedScale,
              ease: MOTION_TOKENS.easings.power2InOut,
            },
            'sigil'
          )
          .fromTo(
            '.intro-overlay__glow',
            { autoAlpha: 0, scale: 0.75 },
            {
              autoAlpha: 1,
              scale: 1.12,
              duration: 0.7 * speedScale,
              ease: 'sine.out',
            },
            'sigil+=0.2'
          )
          // ===============================================================
          // LABEL 2: "fogPart" — Fog Curtains Part & Camera Pushes In (1.0 -> 1.08)
          // ===============================================================
          .addLabel('fogPart', `sigil+=${0.88 * speedScale}`)
          .to(
            '.intro-overlay__fog--left',
            {
              xPercent: -105,
              autoAlpha: 0,
              duration: MOTION_TOKENS.durations.introFogPart * speedScale,
              ease: MOTION_TOKENS.easings.power3Out,
            },
            'fogPart'
          )
          .to(
            '.intro-overlay__fog--right',
            {
              xPercent: 105,
              autoAlpha: 0,
              duration: MOTION_TOKENS.durations.introFogPart * speedScale,
              ease: MOTION_TOKENS.easings.power3Out,
            },
            'fogPart'
          )
          .to(
            overlayRef.current,
            {
              autoAlpha: 0,
              duration: 0.65 * speedScale,
              ease: 'power2.out',
            },
            `fogPart+=${0.32 * speedScale}`
          );
      } else {
        master.addLabel('fogPart', 0);
      }

      // Camera push-in (1.0 -> 1.08) + Aurora fade up
      master
        .to(
          '.parallax-layer--sky .stage-bg__img',
          {
            scale: 1.08,
            duration: MOTION_TOKENS.durations.cameraPush * speedScale,
            ease: 'power2.out',
          },
          'fogPart'
        )
        .fromTo(
          '.scene-aurora-wave',
          { autoAlpha: 0 },
          { autoAlpha: 0.85, duration: 1.5, ease: 'sine.out' },
          'fogPart+=0.15'
        )

        // =================================================================
        // LABEL 3: "navbar" — Gold Lines Draw Outward, Links Stagger, Crest Drops
        // =================================================================
        .addLabel('navbar', showOverlay ? `fogPart+=${0.22 * speedScale}` : 0.05)
        .to(
          '.nav-hairline__segment',
          {
            scaleX: 1,
            duration: MOTION_TOKENS.durations.navLineDraw * speedScale,
          },
          'navbar'
        )
        .to(
          ['.nav-brand', '.nav-links__item', '.nav-cta'],
          {
            autoAlpha: 1,
            y: 0,
            duration: MOTION_TOKENS.durations.navLinkFade * speedScale,
            stagger: MOTION_TOKENS.staggers.navLinks * speedScale,
          },
          'navbar+=0.12'
        )
        .to(
          '.nav-center-ornament',
          {
            autoAlpha: 1,
            y: 4,
            scale: 1,
            duration: MOTION_TOKENS.durations.crestDrop * speedScale,
            ease: MOTION_TOKENS.easings.backOut,
          },
          'navbar+=0.24'
        )

        // =================================================================
        // LABEL 4: "heroText" — Masked SLYTHERIN Reveal, Subtitle, Motto
        // =================================================================
        .addLabel('heroText', 'navbar+=0.26')
        .to(
          '.hero-title__char',
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: MOTION_TOKENS.durations.titleCharReveal * speedScale,
            stagger: MOTION_TOKENS.staggers.titleChars * speedScale,
          },
          'heroText'
        )
        .to(
          '.hero-subtitle-line',
          {
            scaleX: 1,
            duration: 0.65 * speedScale,
          },
          'heroText+=0.28'
        )
        .to(
          '.hero-subtitle',
          {
            autoAlpha: 1,
            letterSpacing: mobile ? '0.22em' : '0.42em',
            duration: MOTION_TOKENS.durations.subtitleReveal * speedScale,
          },
          'heroText+=0.28'
        )
        .to(
          '.hero-motto-word',
          {
            autoAlpha: 1,
            y: 0,
            duration: MOTION_TOKENS.durations.mottoWordFade * speedScale,
            stagger: MOTION_TOKENS.staggers.mottoWords * speedScale,
          },
          'heroText+=0.42'
        )
        .to(
          '.tagline-diamond',
          {
            autoAlpha: 1,
            scale: 1.35,
            duration: 0.28,
            stagger: MOTION_TOKENS.staggers.mottoWords * speedScale,
            yoyo: true,
            repeat: 1,
          },
          'heroText+=0.48'
        )
        .set('.tagline-diamond', { autoAlpha: 1, scale: 1 })
        .to(
          '.hero-divider-wrap',
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: MOTION_TOKENS.durations.serpentDividerDraw * speedScale,
          },
          'heroText+=0.58'
        )

        // =================================================================
        // LABEL 5: "ctas" — Primary & Secondary Buttons Rise In
        // =================================================================
        .addLabel('ctas', 'heroText+=0.68')
        .to(
          '.hero-ctas .chamfer-btn',
          {
            autoAlpha: 1,
            y: 0,
            duration: MOTION_TOKENS.durations.ctaReveal * speedScale,
            stagger: MOTION_TOKENS.staggers.ctas * speedScale,
          },
          'ctas'
        )

        // =================================================================
        // LABEL 6: "cards" — Bottom Feature Cards Stagger + Gold Corners Draw
        // =================================================================
        .addLabel('cards', 'ctas+=0.18')
        .to(
          '.feature-cards__top-rule',
          {
            autoAlpha: 0.85,
            scaleX: 1,
            duration: 0.65 * speedScale,
          },
          'cards'
        )
        .to(
          '.feature-cards__item',
          {
            autoAlpha: 1,
            y: 0,
            duration: MOTION_TOKENS.durations.cardReveal * speedScale,
            stagger: MOTION_TOKENS.staggers.cards * speedScale,
          },
          'cards+=0.08'
        )
        .to(
          '.ornate-frame__corner path',
          {
            strokeDashoffset: 0,
            duration: 0.85 * speedScale,
            ease: 'power2.out',
          },
          'cards+=0.16'
        )

        // =================================================================
        // LABEL 7: "footer" — Socials Pop, SLYTHERIN • FOREVER Draws, Quote Fades
        // =================================================================
        .addLabel('footer', 'cards+=0.34')
        .to(
          '.hero-footer__socials li',
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.45 * speedScale,
            stagger: MOTION_TOKENS.staggers.socials * speedScale,
            ease: MOTION_TOKENS.easings.backOut,
          },
          'footer'
        )
        .to(
          '.hero-footer__line',
          {
            scaleX: 1,
            duration: 0.6 * speedScale,
          },
          'footer+=0.08'
        )
        .to(
          ['.hero-footer__forever', '.footer-serpent-svg'],
          {
            autoAlpha: 1,
            duration: 0.55 * speedScale,
          },
          'footer+=0.14'
        )
        .to(
          '.hero-footer__right-group',
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6 * speedScale,
          },
          'footer+=0.26'
        );
    }, stage);

    return () => ctx.revert();
  }, [showOverlay, stageRef]);

  const handleSkipIntro = () => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
    if (tlRef.current) {
      tlRef.current.progress(1);
    }
    setShowOverlay(false);
  };

  if (!showOverlay) return null;

  return (
    <div ref={overlayRef} className="intro-overlay" aria-label="Slytherin House Intro">
      <div className="intro-overlay__fog intro-overlay__fog--left" />
      <div className="intro-overlay__fog intro-overlay__fog--right" />

      <div className="intro-overlay__center">
        <div className="intro-overlay__glow" />
        <svg
          className="intro-overlay__sigil"
          viewBox="0 0 180 200"
          fill="none"
          aria-hidden="true"
        >
          {/* Outer Heraldic Diamond Shield */}
          <path
            d="M90 12 L162 54 L162 128 C162 162 90 190 90 190 C90 190 18 162 18 128 L18 54 Z"
            stroke="rgba(198, 161, 91, 0.42)"
            strokeWidth="1.5"
          />
          {/* Animated Gold & Emerald Serpent Sigil Stroke */}
          <path
            ref={sigilPathRef}
            d="M72 46 C86 26 118 28 122 52 C126 76 54 92 58 128 C62 156 108 162 124 140 C134 126 122 108 104 110 C90 112 88 126 98 134"
            stroke="url(#introSerpentGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="introSerpentGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5EBD5" />
              <stop offset="50%" stopColor="#E5CC91" />
              <stop offset="100%" stopColor="#2AA576" />
            </linearGradient>
          </defs>
        </svg>
        <p className="intro-overlay__caption">SANCTUM OF SLYTHERIN</p>
      </div>

      <button
        type="button"
        className="intro-overlay__skip"
        onClick={handleSkipIntro}
      >
        Skip Intro →
      </button>
    </div>
  );
};

