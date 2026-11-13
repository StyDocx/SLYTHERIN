import React, { useState } from 'react';
import { Terminal, Lightbulb, Music, Gamepad2, Sparkles, ChevronRight } from 'lucide-react';
import { EventCategory } from '../types';
import { sound } from '../audio/soundEngine';

interface GreatHallProps {
  onSelectCategory: (category: EventCategory) => void;
}

export const GreatHall: React.FC<GreatHallProps> = ({ onSelectCategory }) => {
  const [hoveredGateway, setHoveredGateway] = useState<string | null>(null);

  const gateways: {
    category: EventCategory;
    title: string;
    tagline: string;
    icon: React.ReactNode;
    color: string;
    borderGlow: string;
    eventsCount: number;
    description: string;
  }[] = [
    {
      category: 'Technical',
      title: 'THE PARSELTONGUE DUNGEONS',
      tagline: 'Dark Algorithms, Shader Sorcery & Systems Debugging',
      icon: <Terminal className="w-8 h-8 text-[#10B981]" />,
      color: 'from-[#003B2D] to-[#001C16]',
      borderGlow: 'hover:border-[#10B981] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]',
      eventsCount: 3,
      description: 'Test your logical cunning in competitive programming, high-octane UI hackathons, and deep reverse-engineering trials.'
    },
    {
      category: 'Non-Technical',
      title: 'THE HIGH WIZENGAMOT',
      tagline: 'Parliamentary Debate & Cryptographic Hunts',
      icon: <Lightbulb className="w-8 h-8 text-[#E6C66F]" />,
      color: 'from-[#1A1409] to-[#001C16]',
      borderGlow: 'hover:border-[#E6C66F] hover:shadow-[0_0_30px_rgba(230,198,111,0.4)]',
      eventsCount: 2,
      description: 'Clash with sharp oratory rhetoric in Asian Parliamentary style, or race across the campus solving ancient parchment ciphers.'
    },
    {
      category: 'Cultural',
      title: 'THE YULE BALL PAVILION',
      tagline: 'Gothic Symphony, Dance & Visual Cinematography',
      icon: <Music className="w-8 h-8 text-[#C6C9C8]" />,
      color: 'from-[#1E293B]/60 to-[#001C16]',
      borderGlow: 'hover:border-[#C6C9C8] hover:shadow-[0_0_30px_rgba(198,201,200,0.3)]',
      eventsCount: 2,
      description: 'Mesmerizing theatrical choreography, dark classical orchestrations, and film captures under the enchanted ceiling.'
    },
    {
      category: 'Gaming',
      title: 'THE QUIDDITCH ESPORTS DECK',
      tagline: 'Valorant, BGMI & Grandmaster Wizard Chess',
      icon: <Gamepad2 className="w-8 h-8 text-[#34D399]" />,
      color: 'from-[#064E3B]/60 to-[#001C16]',
      borderGlow: 'hover:border-[#34D399] hover:shadow-[0_0_30px_rgba(52,211,153,0.35)]',
      eventsCount: 2,
      description: 'Ruthless tactical execution and split-second reflexes in competitive FPS tournaments and blitz mind duels.'
    },
    {
      category: 'Special',
      title: 'SALAZAR’S GRAND OCULUS',
      tagline: 'The Flagship Hardware & AI Innovation Expo',
      icon: <Sparkles className="w-8 h-8 text-[#F9DF88]" />,
      color: 'from-[#8C6F2D]/50 to-[#001C16]',
      borderGlow: 'hover:border-[#F9DF88] hover:shadow-[0_0_35px_rgba(249,223,136,0.5)]',
      eventsCount: 1,
      description: 'Multi-disciplinary working hardware prototypes and deep-tech innovations presented before industry luminaries.'
    }
  ];

  return (
    <section id="greathall" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#00140F] overflow-hidden border-t border-[#C9A44C]/30">
      
      {/* 1. THE ENCHANTED CEILING & FLOATING ENCHANTED CANDLES */}
      <div className="absolute inset-x-0 top-0 h-64 pointer-events-none overflow-hidden z-0">
        {/* Starry Night Sky Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#08734B]/20 via-[#001C16]/80 to-transparent" />
        
        {/* Array of 16 Floating Candles with Random Drifts */}
        {[
          { left: '8%', top: '25%', delay: '0s' },
          { left: '16%', top: '45%', delay: '1.2s' },
          { left: '24%', top: '15%', delay: '0.5s' },
          { left: '32%', top: '35%', delay: '2.1s' },
          { left: '42%', top: '20%', delay: '1.7s' },
          { left: '50%', top: '50%', delay: '0.2s' },
          { left: '58%', top: '18%', delay: '2.8s' },
          { left: '68%', top: '40%', delay: '1.4s' },
          { left: '76%', top: '22%', delay: '0.9s' },
          { left: '85%', top: '48%', delay: '2.5s' },
          { left: '92%', top: '15%', delay: '1.8s' },
        ].map((candle, idx) => (
          <div
            key={idx}
            className="absolute flex flex-col items-center animate-floating-candle"
            style={{ left: candle.left, top: candle.top, animationDelay: candle.delay }}
          >
            {/* Candle Flame Glow */}
            <div className="w-2.5 h-4 rounded-full bg-[#F9DF88] shadow-[0_0_12px_#F9DF88] animate-candle" />
            {/* Wax Cylinder */}
            <div className="w-2 h-7 bg-gradient-to-b from-[#FFF0B8] to-[#D9C99F] rounded-b opacity-85" />
          </div>
        ))}
      </div>

      {/* 2. GOTHIC STONE COLUMNS & EMERALD HOUSE BANNERS ON FLANKS */}
      <div className="absolute left-4 top-20 bottom-20 w-8 hidden 2xl:flex flex-col justify-between items-center opacity-40 pointer-events-none">
        <div className="w-6 h-48 border-x-2 border-b-2 border-[#C9A44C] bg-[#003B2D] flex items-center justify-center">
          <span className="font-cinzel text-xs text-[#E6C66F] -rotate-90">SLYTHERIN</span>
        </div>
        <div className="w-6 h-48 border-x-2 border-b-2 border-[#C9A44C] bg-[#003B2D] flex items-center justify-center">
          <span className="font-cinzel text-xs text-[#E6C66F] -rotate-90">AMBITION</span>
        </div>
      </div>

      <div className="absolute right-4 top-20 bottom-20 w-8 hidden 2xl:flex flex-col justify-between items-center opacity-40 pointer-events-none">
        <div className="w-6 h-48 border-x-2 border-b-2 border-[#C9A44C] bg-[#003B2D] flex items-center justify-center">
          <span className="font-cinzel text-xs text-[#E6C66F] rotate-90">OLYMPIA</span>
        </div>
        <div className="w-6 h-48 border-x-2 border-b-2 border-[#C9A44C] bg-[#003B2D] flex items-center justify-center">
          <span className="font-cinzel text-xs text-[#E6C66F] rotate-90">EXCELLENCE</span>
        </div>
      </div>

      {/* SECTION CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#001C16]/80 mb-3">
            <Sparkles className="w-4 h-4 text-[#E6C66F]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#E6C66F] uppercase">
              Sanctuary of Ancient Portals
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            The Great Hall of Discovery
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            Step between the ancient gothic pillars. Five grand event gateways await those bold enough to test their mettle before the faculty of Hogwarts.
          </p>
        </div>

        {/* 5 MAGICAL GATEWAYS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gateways.map((gw, index) => {
            const isHovered = hoveredGateway === gw.category;
            const isFullSpan = index === 4; // 5th item centered on large screens

            return (
              <div
                key={gw.category}
                onMouseEnter={() => {
                  setHoveredGateway(gw.category);
                  sound.playWandSparkle();
                }}
                onMouseLeave={() => setHoveredGateway(null)}
                onClick={() => {
                  sound.playDoorOpen();
                  onSelectCategory(gw.category);
                }}
                className={`group relative rounded-xl p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-b ${gw.color} border border-[#C9A44C]/30 ${gw.borderGlow} ${
                  isFullSpan ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''
                }`}
              >
                {/* Ornate Medieval Corners */}
                <div className="corner-ornament corner-tl" />
                <div className="corner-ornament corner-tr" />
                <div className="corner-ornament corner-bl" />
                <div className="corner-ornament corner-br" />

                {/* Gateway Aura Backdrop */}
                <div className="absolute inset-0 rounded-xl bg-[#08734B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Gateway Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 rounded-lg border border-[#C9A44C]/40 bg-[#00140F]/90 group-hover:border-[#E6C66F] group-hover:scale-110 transition-all duration-300">
                    {gw.icon}
                  </div>
                  <span className="px-3 py-1 rounded font-cinzel text-xs tracking-wider text-[#A7F3D0] border border-[#08734B] bg-[#003B2D]/50">
                    {gw.eventsCount} Chambers
                  </span>
                </div>

                {/* Titles */}
                <span className="block font-cinzel text-xs tracking-[0.2em] text-[#C9A44C] uppercase mb-1">
                  {gw.category} Division
                </span>
                <h3 className="font-cinzel text-xl font-bold tracking-wider text-gold-gradient mb-2 group-hover:text-[#FFF0B8] transition-colors">
                  {gw.title}
                </h3>
                <p className="font-cinzel italic text-xs text-[#E6C66F] mb-4">
                  "{gw.tagline}"
                </p>

                {/* Description */}
                <p className="font-cormorant text-base text-[#C6C9C8] mb-6 leading-relaxed">
                  {gw.description}
                </p>

                {/* Enter Gateway Action */}
                <div className="flex items-center space-x-2 text-xs font-cinzel tracking-widest text-[#E6C66F] group-hover:text-[#F9DF88] transition-colors border-t border-[#C9A44C]/20 pt-4">
                  <span>ENTER GATEWAY</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
