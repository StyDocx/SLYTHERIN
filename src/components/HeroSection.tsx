import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Calendar, MapPin, Award, ArrowDown, ChevronRight, Compass } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onExploreEvents: () => void;
  onExploreMap: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onExploreEvents,
  onExploreMap
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const serpentRef = useRef<HTMLDivElement | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Countdown to Olympia 2026 (March 14, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 122, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const targetDate = new Date('2026-03-14T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3D Canvas Particle & Mist Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool for golden embers and emerald mist
    interface AmbientParticle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      alphaSpeed: number;
    }

    const particles: AmbientParticle[] = [];
    const colors = ['#E6C66F', '#C9A44C', '#08734B', '#10B981', '#F9DF88'];

    for (let i = 0; i < 95; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -Math.random() * 0.65 - 0.15, // gently floating upwards
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw volumetric moving emerald cloud gradients
      const grad1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time * 0.5) * 50,
        height * 0.45 + Math.cos(time * 0.3) * 30,
        40,
        width * 0.3,
        height * 0.45,
        width * 0.6
      );
      grad1.addColorStop(0, 'rgba(8, 115, 75, 0.18)');
      grad1.addColorStop(0.5, 'rgba(0, 59, 45, 0.09)');
      grad1.addColorStop(1, 'rgba(0, 28, 22, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(time * 0.4) * 60,
        height * 0.35 + Math.sin(time * 0.6) * 40,
        50,
        width * 0.7,
        height * 0.35,
        width * 0.55
      );
      grad2.addColorStop(0, 'rgba(201, 164, 76, 0.08)');
      grad2.addColorStop(0.6, 'rgba(8, 115, 75, 0.12)');
      grad2.addColorStop(1, 'rgba(0, 20, 15, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render floating golden dust embers
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaSpeed;

        if (p.alpha <= 0.1 || p.alpha >= 0.95) {
          p.alphaSpeed *= -1;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mouse tilt effect for 3D serpent crest
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMouseOffset({ x, y });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-28 pb-20 flex flex-col items-center justify-between overflow-hidden bg-[#001C16]"
    >
      {/* Dynamic WebGL / Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Medieval Castle Backdrop Silhouette with Illuminated Gothic Windows */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0 opacity-45 h-[65vh] flex items-end justify-center overflow-hidden">
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-full object-cover text-[#00140F] preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Distant Spired Castle Walls */}
          <path
            d="M0 600 L0 380 L60 380 L60 260 L80 200 L100 260 L100 380 L180 380 L180 300 L210 240 L240 300 L240 380 L350 380 L350 180 L380 90 L410 180 L410 380 L490 380 L490 320 L520 280 L550 320 L550 380 L650 380 L650 140 L700 40 L750 140 L750 380 L880 380 L880 210 L920 120 L960 210 L960 380 L1060 380 L1060 290 L1100 220 L1140 290 L1140 380 L1240 380 L1240 190 L1280 110 L1320 190 L1320 380 L1440 380 L1440 600 Z"
            fill="#00120D"
            stroke="#08734B"
            strokeWidth="1.5"
          />
          {/* Illuminated Castle Windows Glowing with Antique Gold */}
          <g fill="#F9DF88" className="animate-pulse">
            <rect x="690" y="160" width="8" height="16" rx="4" />
            <rect x="702" y="160" width="8" height="16" rx="4" />
            <rect x="696" y="210" width="10" height="20" rx="5" />
            <rect x="374" y="220" width="12" height="22" rx="6" />
            <rect x="914" y="240" width="12" height="22" rx="6" />
            <rect x="1274" y="230" width="10" height="20" rx="5" />
            <rect x="75" y="290" width="8" height="14" rx="4" />
            <rect x="205" y="320" width="8" height="14" rx="4" />
            <rect x="515" y="330" width="8" height="14" rx="4" />
            <rect x="1095" y="320" width="8" height="14" rx="4" />
          </g>
        </svg>
      </div>

      {/* Floating Medieval Lanterns */}
      <div className="absolute top-24 left-10 pointer-events-none hidden lg:block animate-float-slow">
        <div className="relative w-8 h-14 border border-[#C9A44C] bg-[#001C16]/80 rounded shadow-gold-glow flex items-center justify-center">
          <div className="w-3.5 h-6 rounded-full bg-[#F9DF88] animate-candle" />
        </div>
      </div>
      <div className="absolute top-36 right-12 pointer-events-none hidden lg:block animate-float-slow" style={{ animationDelay: '2s' }}>
        <div className="relative w-8 h-14 border border-[#C9A44C] bg-[#001C16]/80 rounded shadow-gold-glow flex items-center justify-center">
          <div className="w-3.5 h-6 rounded-full bg-[#F9DF88] animate-candle" />
        </div>
      </div>

      {/* 1. TOP HEADER INSTITUTIONAL RECOGNITION */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between border-b border-[#C9A44C]/30 pb-4 mb-6">
        {/* Left: Department / Institution Insignia */}
        <div className="flex items-center space-x-3 mb-3 md:mb-0">
          <div className="w-12 h-12 rounded border border-[#C9A44C] bg-[#001C16] flex items-center justify-center shadow-emerald-glow">
            <span className="font-cinzel font-bold text-xs text-[#E6C66F]">HOG</span>
          </div>
          <div className="text-left">
            <p className="font-cinzel text-[11px] tracking-widest text-[#E6C66F] font-bold uppercase">
              Hogwarts Academy of Magical Sciences
            </p>
            <p className="font-cormorant text-xs text-[#C6C9C8]">
              Department of Digital Alchemy & Sorcery
            </p>
          </div>
        </div>

        {/* Centre: Event Identity */}
        <div className="text-center my-2 md:my-0">
          <span className="inline-block px-4 py-1 rounded-full border border-[#08734B] bg-[#003B2D]/60 font-cinzel text-[11px] tracking-[0.25em] text-[#A7F3D0] uppercase">
            Annual Grand Inter-College Olympiad
          </span>
        </div>

        {/* Right: Academic Research & Royal Charter Recognition */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="font-cinzel text-[11px] tracking-widest text-[#E6C66F] font-bold uppercase">
              Salazar Research Foundation
            </p>
            <p className="font-cormorant text-xs text-[#C6C9C8]">
              Recognised under High Wizengamot Charter
            </p>
          </div>
          <div className="w-12 h-12 rounded border border-[#C9A44C] bg-[#001C16] flex items-center justify-center shadow-gold-glow">
            <Award className="w-6 h-6 text-[#E6C66F]" />
          </div>
        </div>
      </div>

      {/* 2. CENTRE HERO: 3D INTERACTIVE SERPENT CREST & TITLES */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Mouse Tracking 3D Serpent Crest */}
        <div
          ref={serpentRef}
          style={{
            transform: `perspective(1000px) rotateY(${mouseOffset.x * 16}deg) rotateX(${-mouseOffset.y * 16}deg) translateY(${mouseOffset.y * 8}px)`
          }}
          className="relative w-44 h-44 md:w-56 md:h-56 mb-6 transition-transform duration-150 ease-out flex items-center justify-center cursor-pointer group"
          onClick={() => {
            sound.playWandSparkle();
            sound.playSpellCast();
          }}
        >
          {/* Pulsing Aura Rings */}
          <div className="absolute inset-0 rounded-full bg-[#08734B]/30 blur-2xl group-hover:bg-[#10B981]/50 transition-all" />
          <div className="absolute inset-0 rounded-full border-2 border-[#C9A44C] shadow-gold-glow animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full border border-[#08734B] border-dashed animate-[spin_40s_linear_infinite_reverse]" />

          {/* Detailed Slytherin Serpent Shield */}
          <svg viewBox="0 0 120 120" className="w-36 h-36 md:w-44 md:h-44 text-[#E6C66F] drop-shadow-[0_0_25px_rgba(230,198,111,0.7)]">
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#003B2D" />
                <stop offset="70%" stopColor="#001C16" />
                <stop offset="100%" stopColor="#090D0B" />
              </linearGradient>
              <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF0B8" />
                <stop offset="40%" stopColor="#E6C66F" />
                <stop offset="80%" stopColor="#C9A44C" />
                <stop offset="100%" stopColor="#8C6F2D" />
              </linearGradient>
            </defs>
            {/* Heraldic Shield Base */}
            <path
              d="M60 8 L104 26 L104 72 C104 94 60 114 60 114 C60 114 16 94 16 72 L16 26 Z"
              fill="url(#shieldGrad)"
              stroke="url(#goldSheen)"
              strokeWidth="4"
            />
            {/* Silver Inset Border */}
            <path
              d="M60 16 L96 32 L96 68 C96 86 60 102 60 102 C60 102 24 86 24 68 L24 32 Z"
              fill="none"
              stroke="#C6C9C8"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            {/* Coiled Dragon-Serpent of Salazar */}
            <path
              d="M62 30 C52 30 46 36 48 45 C50 54 72 56 74 68 C76 80 62 88 50 86 C40 84 38 74 38 74 M50 86 C54 90 64 92 70 88"
              stroke="url(#goldSheen)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Crowned Serpent Head */}
            <path d="M62 30 L67 27 L66 33 Z" fill="#F9DF88" />
            <circle cx="64" cy="30" r="1.8" fill="#10B981" />
            {/* Star Emerald of Ambition */}
            <circle cx="60" cy="98" r="3.5" fill="#10B981" />
          </svg>
        </div>

        {/* Main Master Hero Typography */}
        <div className="space-y-2 mb-4">
          <p className="font-cinzel text-xs md:text-sm tracking-[0.45em] text-[#C6C9C8] uppercase">
            Hogwarts School of Witchcraft & Wizardry Presents
          </p>
          <h1 className="font-cinzel-dec text-4xl sm:text-6xl md:text-8xl font-black tracking-widest text-gold-gradient uppercase drop-shadow-[0_4px_25px_rgba(201,164,76,0.4)]">
            SLYTHERIN
          </h1>
          <div className="font-cinzel text-3xl sm:text-5xl md:text-6xl tracking-[0.3em] text-[#A7F3D0] uppercase font-bold">
            OLYMPIA 2026
          </div>
        </div>

        {/* Master Tagline */}
        <p className="font-cinzel italic text-base sm:text-xl md:text-2xl text-[#E6C66F] tracking-[0.2em] mb-6 drop-shadow-md">
          "WHERE AMBITION MEETS MAGIC."
        </p>

        {/* Key Event Badges: Date, Location, Total Bounty */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs sm:text-sm font-cinzel text-[#D9C99F]">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#001C16]/80 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-[#E6C66F]" />
            <span>14 – 15 March 2026</span>
          </div>
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#08734B]/60 bg-[#003B2D]/40 backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-[#34D399]" />
            <span>Hogwarts Main Campus & Dungeons</span>
          </div>
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#001C16]/80 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#F9DF88]" />
            <span>1,00,000+ Galleons in Bounties</span>
          </div>
        </div>

        {/* Tournament Countdown Clock */}
        <div className="mb-8 p-4 rounded-lg border border-[#C9A44C]/40 bg-[#00140F]/90 shadow-2xl backdrop-blur-md">
          <p className="font-cinzel text-xs tracking-widest text-[#C9A44C] uppercase mb-3">
            Tournament Bell Countdown
          </p>
          <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center font-cinzel">
            <div className="p-2 sm:p-3 rounded border border-[#08734B]/40 bg-[#003B2D]/40">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-gradient">
                {timeLeft.days}
              </span>
              <span className="text-[10px] tracking-wider text-[#A7F3D0] uppercase">Days</span>
            </div>
            <div className="p-2 sm:p-3 rounded border border-[#08734B]/40 bg-[#003B2D]/40">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-gradient">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] tracking-wider text-[#A7F3D0] uppercase">Hours</span>
            </div>
            <div className="p-2 sm:p-3 rounded border border-[#08734B]/40 bg-[#003B2D]/40">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-gradient">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] tracking-wider text-[#A7F3D0] uppercase">Mins</span>
            </div>
            <div className="p-2 sm:p-3 rounded border border-[#08734B]/40 bg-[#003B2D]/40">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-gradient">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] tracking-wider text-[#A7F3D0] uppercase">Secs</span>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => {
              sound.playSealStamp();
              onRegisterClick();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded font-cinzel font-bold text-sm tracking-[0.2em] text-[#090D0B] bg-gradient-to-r from-[#C9A44C] via-[#F9DF88] to-[#C9A44C] border-2 border-[#FFF0B8] shadow-gold-glow hover:scale-105 transition-all uppercase flex items-center justify-center space-x-2"
          >
            <span>CLAIM ACCEPTANCE LETTER</span>
            <ChevronRight className="w-4 h-4 text-[#001C16]" />
          </button>

          <button
            onClick={() => {
              sound.playWandSparkle();
              onExploreEvents();
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded font-cinzel text-sm tracking-[0.15em] text-[#D9C99F] hover:text-[#F9DF88] border border-[#08734B] hover:border-[#C9A44C] bg-[#003B2D]/50 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#E6C66F]" />
            <span>DISCOVER THE 10 CHAMBERS</span>
          </button>

          <button
            onClick={() => {
              sound.playPageTurn();
              onExploreMap();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded font-cinzel text-sm tracking-[0.15em] text-[#C9A44C] hover:text-[#FFF0B8] border border-[#C9A44C]/50 hover:border-[#E6C66F] bg-black/40 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4 text-[#E6C66F]" />
            <span>MARAUDER'S MAP</span>
          </button>
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 mt-12 flex flex-col items-center">
        <span className="font-cinzel text-[11px] tracking-widest text-[#C9A44C] uppercase mb-1">
          Descend into the Great Hall
        </span>
        <ArrowDown className="w-4 h-4 text-[#E6C66F] animate-bounce" />
      </div>

    </section>
  );
};
