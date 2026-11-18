import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_TOKENS, isTouchOrMobile, prefersReducedMotion } from './tokens';

gsap.registerPlugin(ScrollTrigger);

// Coordinates of the 14 Gothic castle windows (in % of 1672x941 canvas) for warm-gold twinkling sprites
const CASTLE_WINDOW_SPRITES = [
  { left: '25.4%', top: '36.2%', size: 8, delay: 0.2 },
  { left: '28.1%', top: '34.8%', size: 9, delay: 1.1 },
  { left: '31.8%', top: '31.5%', size: 11, delay: 0.7 },
  { left: '34.6%', top: '35.0%', size: 10, delay: 2.3 },
  { left: '37.2%', top: '28.4%', size: 12, delay: 1.6 },
  { left: '39.8%', top: '33.6%', size: 14, delay: 0.4 },
  { left: '42.5%', top: '26.8%', size: 11, delay: 2.9 },
  { left: '45.2%', top: '32.2%', size: 13, delay: 1.3 },
  { left: '47.9%', top: '35.4%', size: 10, delay: 0.9 },
  { left: '51.4%', top: '36.8%', size: 9, delay: 2.1 },
  { left: '55.0%', top: '38.2%', size: 8, delay: 1.8 },
  { left: '58.6%', top: '40.5%', size: 9, delay: 0.5 },
  { left: '62.2%', top: '42.0%', size: 8, delay: 2.6 },
  { left: '66.8%', top: '43.5%', size: 7, delay: 1.4 },
];

export const ParallaxScene: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const skyLayerRef = useRef<HTMLDivElement | null>(null);
  const moonLayerRef = useRef<HTMLDivElement | null>(null);
  const castleLayerRef = useRef<HTMLDivElement | null>(null);
  const forestLayerRef = useRef<HTMLDivElement | null>(null);
  const frameLayerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobileView(e.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.play().catch(() => {});
  }, [isMobileView]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mobile = isTouchOrMobile();

      // 3. Moon soft glow pulse (4.8s loop) + cloud wisp drift
      gsap.to('.scene-moon-glow', {
        opacity: 0.92,
        scale: 1.07,
        duration: 4.8,
        ease: MOTION_TOKENS.easings.sineInOut,
        repeat: -1,
        yoyo: true,
      });

      gsap.to('.scene-moon-cloud', {
        xPercent: 18,
        opacity: 0.42,
        duration: 16,
        ease: MOTION_TOKENS.easings.sineInOut,
        repeat: -1,
        yoyo: true,
      });

      // 4. Castle windows: random warm-gold twinkling sprites
      const windowEls = gsap.utils.toArray<HTMLElement>('.scene-window-sprite');
      windowEls.forEach((el, idx) => {
        const flicker = () => {
          gsap.to(el, {
            opacity: gsap.utils.random(0.25, 0.98),
            scale: gsap.utils.random(0.85, 1.22),
            duration: gsap.utils.random(0.6, 2.4),
            delay: idx === 0 ? 0 : gsap.utils.random(0.05, 0.4),
            ease: 'sine.inOut',
            onComplete: flicker,
          });
        };
        flicker();
      });

      // 8. Left & Right Banners: gentle cloth sway (5.6s & 6.5s offset) + metallic glint every 8s
      gsap.to('.scene-banner--left', {
        rotation: 1.35,
        skewX: 0.9,
        duration: 5.6,
        ease: MOTION_TOKENS.easings.sineInOut,
        repeat: -1,
        yoyo: true,
      });

      gsap.to('.scene-banner--right', {
        rotation: -1.35,
        skewX: -0.9,
        duration: 6.4,
        delay: 1.4,
        ease: MOTION_TOKENS.easings.sineInOut,
        repeat: -1,
        yoyo: true,
      });

      gsap.fromTo(
        '.scene-banner__glint',
        { yPercent: -130, opacity: 0 },
        {
          yPercent: 230,
          opacity: 0.65,
          duration: 1.8,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 6.5,
          stagger: 1.2,
        }
      );

      // 9. Lanterns: realistic randomized candle flicker (not a uniform pulse)
      const lanternEls = gsap.utils.toArray<HTMLElement>('.scene-lantern-glow');
      lanternEls.forEach((lantern) => {
        const candleFlicker = () => {
          gsap.to(lantern, {
            opacity: gsap.utils.random(0.58, 1.0),
            scale: gsap.utils.random(0.92, 1.12),
            duration: gsap.utils.random(0.12, 0.48),
            ease: 'power1.inOut',
            onComplete: candleFlicker,
          });
        };
        candleFlicker();
      });

      // 10. Vines/leaves in the corners: slight staggered wind sway from top corner anchor
      gsap.to('.scene-vines--left', {
        rotation: 1.8,
        x: 3,
        duration: 4.6,
        ease: MOTION_TOKENS.easings.sineInOut,
        repeat: -1,
        yoyo: true,
      });

      gsap.to('.scene-vines--right', {
        rotation: -1.8,
        x: -3,
        duration: 5.2,
        delay: 0.9,
        ease: MOTION_TOKENS.easings.sineInOut,
        repeat: -1,
        yoyo: true,
      });

      // Desktop-only Mouse Parallax (+/- 8px to 25px across the 5 depth layers)
      if (!mobile) {
        const skyX = gsap.quickTo(skyLayerRef.current, 'x', { duration: 1.1, ease: 'power3.out' });
        const skyY = gsap.quickTo(skyLayerRef.current, 'y', { duration: 1.1, ease: 'power3.out' });

        const moonX = gsap.quickTo(moonLayerRef.current, 'x', { duration: 1.0, ease: 'power3.out' });
        const moonY = gsap.quickTo(moonLayerRef.current, 'y', { duration: 1.0, ease: 'power3.out' });

        const castleX = gsap.quickTo(castleLayerRef.current, 'x', { duration: 0.9, ease: 'power3.out' });
        const castleY = gsap.quickTo(castleLayerRef.current, 'y', { duration: 0.9, ease: 'power3.out' });

        const forestX = gsap.quickTo(forestLayerRef.current, 'x', { duration: 0.8, ease: 'power3.out' });
        const forestY = gsap.quickTo(forestLayerRef.current, 'y', { duration: 0.8, ease: 'power3.out' });

        const frameX = gsap.quickTo(frameLayerRef.current, 'x', { duration: 0.7, ease: 'power3.out' });
        const frameY = gsap.quickTo(frameLayerRef.current, 'y', { duration: 0.7, ease: 'power3.out' });

        const onMouseMove = (e: MouseEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 .. 1
          const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1 .. 1

          skyX(-nx * MOTION_TOKENS.parallax.sky.x);
          skyY(-ny * MOTION_TOKENS.parallax.sky.y);

          moonX(-nx * MOTION_TOKENS.parallax.moon.x);
          moonY(-ny * MOTION_TOKENS.parallax.moon.y);

          castleX(-nx * MOTION_TOKENS.parallax.castle.x);
          castleY(-ny * MOTION_TOKENS.parallax.castle.y);

          forestX(-nx * MOTION_TOKENS.parallax.forest.x);
          forestY(-ny * MOTION_TOKENS.parallax.forest.y);

          frameX(nx * MOTION_TOKENS.parallax.foreground.x * 0.45);
          frameY(ny * MOTION_TOKENS.parallax.foreground.y * 0.45);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMouseMove);
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const videoSrc = isMobileView ? '/video/bgmobile.mp4' : '/video/bgdesktop.mp4';

  return (
    <div ref={rootRef} className="parallax-scene" aria-hidden="true">
      {/* =================================================================
          LAYER 1: BACKGROUND VIDEO (/video/bgdesktop.mp4 & /video/bgmobile.mp4)
          ================================================================= */}
      <div ref={skyLayerRef} className="parallax-layer parallax-layer--sky">
        <div className="stage-bg">
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            className="stage-bg__img stage-bg__video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        {/* 2. AURORA: Slow shimmering green-gold waves (mix-blend-mode: screen, 24s loop) */}
        <div className="scene-aurora-wave scene-aurora-wave--1" />
        <div className="scene-aurora-wave scene-aurora-wave--2" />
      </div>

      {/* =================================================================
          LAYER 2: FULL MOON DEPTH PLANE (Soft Glow Pulse + Drifting Cloud Wisp)
          ================================================================= */}
      <div ref={moonLayerRef} className="parallax-layer parallax-layer--moon">
        <div className="scene-moon-glow" />
        <div className="scene-moon-cloud" />
      </div>

      {/* =================================================================
          LAYER 3: FAR CASTLE DEPTH PLANE + TWINKLING WARM-GOLD WINDOWS
          ================================================================= */}
      <div ref={castleLayerRef} className="parallax-layer parallax-layer--castle">
        {/* 4. CASTLE WINDOWS: 14 Warm-Gold Twinkling Window Glow Sprites */}
        <div className="scene-windows-container">
          {CASTLE_WINDOW_SPRITES.map((win, idx) => (
            <span
              key={idx}
              className="scene-window-sprite"
              style={{
                left: win.left,
                top: win.top,
                width: `${win.size}px`,
                height: `${win.size * 1.4}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* =================================================================
          LAYER 4: FOREST, BRIDGE, MIST/FOG (3 LAYERS) & LAKE WATER SHIMMER
          ================================================================= */}
      <div ref={forestLayerRef} className="parallax-layer parallax-layer--forest">
        {/* 7. WATER: Subtle reflection shimmer at the Black Lake near the bottom */}
        <div className="scene-lake-shimmer" />

        {/* 5. MIST/FOG: 3 semi-transparent fog layers drifting horizontally at different speeds */}
        <div className="scene-fog-layer scene-fog-layer--1" />
        <div className="scene-fog-layer scene-fog-layer--2" />
        <div className="scene-fog-layer scene-fog-layer--3" />
      </div>

      {/* =================================================================
          LAYER 5: FOREGROUND FRAME DECORATIONS (BANNERS, LANTERNS, VINES)
          ================================================================= */}
      <div ref={frameLayerRef} className="parallax-layer parallax-layer--frame">
        {/* 8. Left & Right Hanging Banner Cloth Sway + Metallic Glint Sweep */}
        <div className="scene-banner scene-banner--left">
          <div className="scene-banner__glint" />
        </div>
        <div className="scene-banner scene-banner--right">
          <div className="scene-banner__glint" />
        </div>

        {/* 9. Realistic Candle Flicker Lanterns Casting Warm Light on Stone & Vines */}
        <div className="scene-lantern-glow scene-lantern-glow--left" />
        <div className="scene-lantern-glow--right scene-lantern-glow" />

        {/* 10. Corner Vines / Ivy Leaves Wind Sway */}
        <div className="scene-vines scene-vines--left" />
        <div className="scene-vines scene-vines--right" />
      </div>
    </div>
  );
};
