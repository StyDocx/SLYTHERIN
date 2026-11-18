import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { isTouchOrMobile, prefersReducedMotion } from './tokens';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const trailContainerRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || isTouchOrMobile()) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const trailContainer = trailContainerRef.current;
    if (!dot || !ring || !trailContainer) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3.out' });

    let lastSparkleTime = 0;

    const spawnSparkle = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSparkleTime < 52) return;
      lastSparkleTime = now;

      const spark = document.createElement('span');
      spark.className = 'cursor-sparkle';
      spark.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      trailContainer.appendChild(spark);

      gsap.to(spark, {
        y: '+=14',
        x: `+=${(Math.random() - 0.5) * 16}`,
        opacity: 0,
        scale: 0.2,
        duration: 0.55,
        ease: 'power2.out',
        onComplete: () => {
          spark.remove();
        },
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      spawnSparkle(e.clientX, e.clientY);

      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('a, button, input, select, label, .feature-card-link, .chamfer-btn')
      );
      ring.classList.toggle('is-hovered', isInteractive);
      dot.classList.toggle('is-hovered', isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="custom-cursor-layer" aria-hidden="true">
      <div ref={trailContainerRef} className="custom-cursor-trail" />
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
};

