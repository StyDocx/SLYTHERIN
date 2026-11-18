import gsap from 'gsap';
import { MOTION_TOKENS, isTouchOrMobile, prefersReducedMotion } from './tokens';

/**
 * Attaches 3D cursor-following tilt (max 6deg), internal radial spotlight gradient,
 * icon float/glow, and arrow circle nudge to the 4 bottom feature cards.
 */
export function initFeatureCardsMotion(container: HTMLElement | null): () => void {
  if (!container || prefersReducedMotion() || isTouchOrMobile()) {
    return () => {};
  }

  const cards = Array.from(container.querySelectorAll<HTMLElement>('.feature-card-link'));
  const cleanups: Array<() => void> = [];

  cards.forEach((card) => {
    const frame = card.querySelector<HTMLElement>('.feature-card-frame');
    const icon = card.querySelector<HTMLElement>('.feature-card__icon');
    const arrow = card.querySelector<HTMLElement>('.feature-card__arrow');

    gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });

    const rotXTo = gsap.quickTo(card, 'rotationX', {
      duration: 0.42,
      ease: MOTION_TOKENS.easings.power3Out,
    });
    const rotYTo = gsap.quickTo(card, 'rotationY', {
      duration: 0.42,
      ease: MOTION_TOKENS.easings.power3Out,
    });

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const nx = (relX / rect.width - 0.5) * 2; // -1 .. 1
      const ny = (relY / rect.height - 0.5) * 2; // -1 .. 1

      const maxDeg = MOTION_TOKENS.cards.maxTiltDeg;
      rotXTo(-ny * maxDeg);
      rotYTo(nx * maxDeg);

      if (frame) {
        frame.style.setProperty('--spot-x', `${relX.toFixed(1)}px`);
        frame.style.setProperty('--spot-y', `${relY.toFixed(1)}px`);
        frame.style.setProperty('--spot-alpha', '1');
      }
    };

    const onMouseEnter = () => {
      if (icon) {
        gsap.to(icon, {
          y: -4,
          scale: 1.07,
          duration: 0.35,
          ease: MOTION_TOKENS.easings.power3Out,
        });
      }
      if (arrow) {
        gsap.to(arrow, {
          x: 4,
          scale: 1.08,
          duration: 0.32,
          ease: MOTION_TOKENS.easings.power3Out,
        });
      }
    };

    const onMouseLeave = () => {
      rotXTo(0);
      rotYTo(0);
      if (frame) {
        frame.style.setProperty('--spot-alpha', '0');
      }
      if (icon) {
        gsap.to(icon, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: MOTION_TOKENS.easings.power3Out,
        });
      }
      if (arrow) {
        gsap.to(arrow, {
          x: 0,
          scale: 1,
          duration: 0.35,
          ease: MOTION_TOKENS.easings.power3Out,
        });
      }
    };

    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);

    cleanups.push(() => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseleave', onMouseLeave);
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

