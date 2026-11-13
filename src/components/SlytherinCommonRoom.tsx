import React, { useState } from 'react';
import { Flame, Sparkles, Shield, Compass, Waves, CheckCircle } from 'lucide-react';
import { sound } from '../audio/soundEngine';

export const SlytherinCommonRoom: React.FC = () => {
  const [serpentRot, setSerpentRot] = useState({ x: 0, y: 0 });
  const [activeTenet, setActiveTenet] = useState<number>(0);
  const [runeResult, setRuneResult] = useState<string | null>(null);

  const tenets = [
    {
      title: 'WE VALUE AMBITION.',
      description: 'Those who dare to reach beyond the ordinary limits of mortal perception. We do not settle for participation; we strive for supremacy.'
    },
    {
      title: 'WE CELEBRATE INTELLIGENCE.',
      description: 'Calculating, deliberate, and deeply analytical. In our halls, intellect is the ultimate weapon, sharper than any drawn blade.'
    },
    {
      title: 'WE REWARD DETERMINATION.',
      description: 'Unyielding perseverance in the face of impossible algorithmic complexities. The serpent strikes only when the path is certain.'
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setSerpentRot({ x: x * 22, y: -y * 22 });
  };

  const handleTestAmbition = () => {
    sound.playSpellCast();
    const runes = [
      'The Basilisk Fang: Your algorithmic recursion will shatter all test bounds.',
      'The Silver Cauldron: Your potion draughts shall run bug-free under heavy load.',
      'The Emerald Tiara: Your architectural design is ordained for the Grand Cup.'
    ];
    setRuneResult(runes[Math.floor(Math.random() * runes.length)]);
  };

  return (
    <section
      id="commonroom"
      onMouseMove={handleMouseMove}
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#00140F] overflow-hidden border-t border-[#C9A44C]/30"
    >
      {/* 1. UNDERWATER BLACK LAKE WINDOWS EFFECT */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#08734B]/40 via-[#001C16]/80 to-black" />
        
        {/* Subtle Caustic Ripple Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.15)_0%,transparent_60%)] animate-pulse" />
        
        {/* Giant Squid Shadow Passing Behind High Gothic Arches */}
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-32 bg-black/50 blur-3xl rounded-full animate-[float_22s_easeInOut_infinite] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#08734B] bg-[#003B2D]/50 mb-3">
            <Waves className="w-4 h-4 text-[#34D399]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#A7F3D0] uppercase">
              Subterranean Sanctuary of Salazar
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            The Slytherin Common Room
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            Carved directly beneath the icy waters of the Black Lake. Dark emerald stone walls, flickering fireplaces, and ancient tapestries whisper the sacred tenets of the serpent.
          </p>
        </div>

        {/* 2-COLUMN DISPLAY: INTERACTIVE 3D EMBLEM & HOUSE TENETS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: 3D Specular Cursor Tracking Serpent Emblem */}
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-[#001C16]/85 border-2 border-[#C9A44C]/40 shadow-emerald-glow">
            <div
              style={{
                transform: `perspective(800px) rotateY(${serpentRot.x}deg) rotateX(${serpentRot.y}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              onClick={() => sound.playWandSparkle()}
              className="relative w-56 h-56 sm:w-64 sm:h-64 cursor-pointer flex items-center justify-center group"
            >
              {/* Dynamic Emerald & Gold Glow Backlight */}
              <div className="absolute inset-0 rounded-full bg-[#08734B]/40 blur-3xl group-hover:bg-[#10B981]/60 transition-all duration-300" />
              <div className="absolute inset-0 rounded-full border-2 border-[#C9A44C] shadow-gold-glow animate-[spin_32s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-[#08734B] border-dashed animate-[spin_40s_linear_infinite_reverse]" />

              {/* Coiled Serpent Crest */}
              <svg viewBox="0 0 100 100" className="w-44 h-44 sm:w-52 sm:h-52 text-[#E6C66F] drop-shadow-[0_0_25px_rgba(230,198,111,0.8)]">
                <defs>
                  <linearGradient id="serpentGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF0B8" />
                    <stop offset="45%" stopColor="#E6C66F" />
                    <stop offset="75%" stopColor="#C9A44C" />
                    <stop offset="100%" stopColor="#8C6F2D" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 5 L88 20 L88 60 C88 80 50 95 50 95 C50 95 12 80 12 60 L12 20 Z"
                  fill="#00140F"
                  stroke="url(#serpentGold)"
                  strokeWidth="3.5"
                />
                <path
                  d="M52 24 C44 24 38 29 40 36 C42 43 58 45 60 54 C62 63 52 70 42 68 C35 66 34 58 34 58"
                  stroke="url(#serpentGold)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <circle cx="53" cy="24" r="1.8" fill="#10B981" />
                <circle cx="50" cy="80" r="3.5" fill="#10B981" />
              </svg>
            </div>

            <p className="font-cinzel text-xs tracking-[0.2em] text-[#C9A44C] mt-6 uppercase text-center">
              Move cursor to tilt the ancient silver-gold reliquary
            </p>

            {/* Test Ambition Rune Interactive Button */}
            <div className="mt-6 w-full text-center">
              <button
                onClick={handleTestAmbition}
                className="px-6 py-2.5 rounded font-cinzel text-xs font-bold tracking-widest text-[#FFF0B8] border border-[#C9A44C] hover:border-[#E6C66F] bg-[#003B2D]/60 hover:bg-[#003B2D] transition-all uppercase"
              >
                CONSULT THE AMBITION ORACLE
              </button>

              {runeResult && (
                <div className="mt-4 p-3 rounded border border-[#10B981]/50 bg-[#001C16] text-[#A7F3D0] font-cormorant italic text-sm animate-fadeIn">
                  "{runeResult}"
                </div>
              )}
            </div>
          </div>

          {/* Right: The Three House Tenets & Roaring Emerald Hearth */}
          <div className="space-y-6">
            
            {/* Emerald Fireplace Representation */}
            <div className="p-6 rounded-xl border border-[#08734B]/60 bg-gradient-to-r from-[#002B21] via-[#001C16] to-[#002B21] flex items-center space-x-4 shadow-emerald-glow">
              <div className="p-3 rounded-full bg-[#08734B]/30 border border-[#10B981]">
                <Flame className="w-8 h-8 text-[#10B981] animate-candle" />
              </div>
              <div>
                <h4 className="font-cinzel text-sm font-bold tracking-wider text-[#A7F3D0] uppercase">
                  The Eternal Emerald Hearth
                </h4>
                <p className="font-cormorant italic text-sm text-[#C6C9C8]">
                  The fire here burns with enchanted green wood, casting dancing serpentine shadows across the dungeon stones.
                </p>
              </div>
            </div>

            {/* Three Tenets Accordion Cards */}
            <div className="space-y-4">
              {tenets.map((tenet, idx) => {
                const isActive = activeTenet === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      sound.playGoldClick();
                      setActiveTenet(idx);
                    }}
                    className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                      isActive
                        ? 'border-[#E6C66F] bg-[#002B21]/80 shadow-gold-glow'
                        : 'border-[#C9A44C]/30 bg-[#001C16]/60 hover:border-[#C9A44C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-cinzel text-lg font-bold tracking-wider text-gold-gradient">
                        {tenet.title}
                      </h3>
                      {isActive && <CheckCircle className="w-5 h-5 text-[#E6C66F]" />}
                    </div>
                    <p className="font-cormorant text-base text-[#D9C99F] leading-relaxed">
                      {tenet.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
