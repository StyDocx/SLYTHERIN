import React, { useEffect, useRef } from 'react';
import { MOTION_TOKENS, isTouchOrMobile, prefersReducedMotion } from './tokens';

interface FireflyParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  color: string;
  life?: number;
  maxLife?: number;
}

export function triggerButtonParticleBurst(rect: DOMRect) {
  if (prefersReducedMotion()) return;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  window.dispatchEvent(
    new CustomEvent('slytherin:particle-burst', {
      detail: { x: cx, y: cy, width: rect.width, height: rect.height },
    })
  );
}

export const ParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isTabVisible = !document.hidden;
    let isInViewport = true;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mobile = isTouchOrMobile();
    const count = mobile
      ? MOTION_TOKENS.particles.mobileCount
      : MOTION_TOKENS.particles.desktopCount;

    const PALETTE = [
      '229, 204, 145', // Champagne Gold
      '198, 161, 91',  // Antique Gold
      '245, 235, 213', // Warm Ivory
      '42, 165, 118',  // Subtle Emerald Firefly
    ];

    const ambientParticles: FireflyParticle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(0.14 + Math.random() * 0.32),
      radius: 0.85 + Math.random() * 1.65,
      alpha: 0.16 + Math.random() * 0.34,
      phase: Math.random() * Math.PI * 2,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }));

    const burstParticles: FireflyParticle[] = [];

    const onBurst = (evt: Event) => {
      const detail = (evt as CustomEvent).detail;
      if (!detail) return;
      const bx = detail.x ?? width / 2;
      const by = detail.y ?? height / 2;
      const bw = detail.width ?? 160;

      for (let i = 0; i < MOTION_TOKENS.particles.burstCount; i++) {
        const angle = -Math.PI * Math.random();
        const speed = 0.65 + Math.random() * 1.6;
        burstParticles.push({
          x: bx + (Math.random() - 0.5) * bw * 0.75,
          y: by + (Math.random() - 0.5) * 18,
          vx: Math.cos(angle) * speed * 0.7,
          vy: Math.sin(angle) * speed - 0.4,
          radius: 1.1 + Math.random() * 1.6,
          alpha: 0.85,
          phase: Math.random() * Math.PI * 2,
          color: i % 3 === 0 ? '42, 165, 118' : '229, 204, 145',
          life: 0,
          maxLife: 36 + Math.random() * 24,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isInViewport = entries[0].isIntersecting;
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(canvas);

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('slytherin:particle-burst', onBurst);
    document.addEventListener('visibilitychange', handleVisibility);

    let tick = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isTabVisible || !isInViewport) return;

      tick += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. Ambient rising embers & fireflies
      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i];
        p.x += p.vx + Math.sin(tick + p.phase) * 0.1;
        p.y += p.vy;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        const currentAlpha = p.alpha * (0.65 + 0.35 * Math.sin(tick * 1.8 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha.toFixed(3)})`;
        ctx.fill();
      }

      // 2. Hover button burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const b = burstParticles[i];
        b.life = (b.life ?? 0) + 1;
        const maxL = b.maxLife ?? 45;
        if (b.life >= maxL) {
          burstParticles.splice(i, 1);
          continue;
        }
        b.x += b.vx;
        b.y += b.vy;
        b.vy -= 0.015; // buoyant rise
        const ratio = 1 - b.life / maxL;
        const alpha = b.alpha * ratio;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * (0.5 + 0.5 * ratio), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${b.color}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('slytherin:particle-burst', onBurst);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-canvas" aria-hidden="true" />;
};

