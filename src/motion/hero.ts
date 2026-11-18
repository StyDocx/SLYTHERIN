import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { MOTION_TOKENS, isTouchOrMobile, prefersReducedMotion } from './tokens';
import { triggerButtonParticleBurst } from './particles';

gsap.registerPlugin(ScrollTrigger);

/**
 * Attaches magnetic pull (within ~80px), hover ember/gold particle burst,
 * press-down scale, and shimmer sweeps to hero & navbar CTA buttons.
 */
export function initHeroMagneticButtons(container: HTMLElement | null): () => void {
  if (!container || prefersReducedMotion() || isTouchOrMobile()) {
    return () => {};
  }

  const buttons = Array.from(container.querySelectorAll<HTMLElement>('.chamfer-btn'));
  const cleanups: Array<() => void> = [];

  buttons.forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.45, ease: MOTION_TOKENS.easings.power3Out });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.45, ease: MOTION_TOKENS.easings.power3Out });

    let burstCooldown = false;

    const onMouseEnter = () => {
      if (!burstCooldown) {
        burstCooldown = true;
        triggerButtonParticleBurst(btn.getBoundingClientRect());
        setTimeout(() => {
          burstCooldown = false;
        }, 550);
      }
      const sparkle = btn.querySelector<HTMLElement>('.icon-sparkle');
      if (sparkle) {
        gsap.fromTo(
          sparkle,
          { rotation: 0 },
          { rotation: 90, duration: 0.45, ease: MOTION_TOKENS.easings.expoOut }
        );
      }
    };

    const onMouseDown = () => {
      gsap.to(btn, { scale: 0.96, duration: 0.14, ease: 'power2.out' });
    };

    const onMouseUp = () => {
      gsap.to(btn, { scale: 1, duration: 0.28, ease: MOTION_TOKENS.easings.backOut });
    };

    const onMouseLeave = () => {
      xTo(0);
      yTo(0);
      gsap.to(btn, { scale: 1, duration: 0.35, ease: MOTION_TOKENS.easings.power3Out });
    };

    // Magnetic proximity listener (~82px radius around button center)
    const onWindowMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const maxRadius = Math.max(rect.width * 0.65, MOTION_TOKENS.cards.magneticRadiusPx);

      if (dist < maxRadius) {
        const pull = 1 - dist / maxRadius;
        xTo((dx / maxRadius) * MOTION_TOKENS.cards.magneticStrengthX * pull * 1.4);
        yTo((dy / maxRadius) * MOTION_TOKENS.cards.magneticStrengthY * pull * 1.4);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    btn.addEventListener('mouseenter', onMouseEnter);
    btn.addEventListener('mousedown', onMouseDown);
    btn.addEventListener('mouseup', onMouseUp);
    btn.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousemove', onWindowMouseMove, { passive: true });

    cleanups.push(() => {
      btn.removeEventListener('mouseenter', onMouseEnter);
      btn.removeEventListener('mousedown', onMouseDown);
      btn.removeEventListener('mouseup', onMouseUp);
      btn.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousemove', onWindowMouseMove);
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

/**
 * Connects Lenis smooth scrolling to GSAP ScrollTrigger and animates scroll-out parallax
 * when the page scrolls on tablet/mobile or taller viewports.
 */
export function initSmoothScrollAndTriggers(stageEl: HTMLElement | null): () => void {
  if (!stageEl || prefersReducedMotion()) {
    return () => {};
  }

  let lenis: Lenis | null = null;
  let tickerFn: ((time: number) => void) | null = null;

  if (!isTouchOrMobile()) {
    lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    tickerFn = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
  }

  const ctx = gsap.context(() => {
    // Scroll-driven depth separation if user scrolls down
    ScrollTrigger.create({
      trigger: stageEl,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set('.hero-centerpiece', {
          y: p * -38,
          scale: 1 - p * 0.06,
          opacity: 1 - p * 0.45,
        });
      },
    });
  }, stageEl);

  return () => {
    ctx.revert();
    if (tickerFn) {
      gsap.ticker.remove(tickerFn);
    }
    lenis?.destroy();
  };
}

