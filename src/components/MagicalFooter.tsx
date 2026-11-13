import React from 'react';
import { Shield, Sparkles, MapPin, Mail, Phone, ExternalLink, ArrowUp } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const MagicalFooter: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    sound.playGoldClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#00120D] text-[#D9C99F] pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-t-2 border-[#C9A44C]/30">
      
      {/* Dark Underground Castle Corridor Silhouette & Fog */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#003B2D]/30 via-transparent to-black" />
      
      {/* Dim Torchlights Fading on Stone Parapets */}
      <div className="absolute top-8 left-12 w-3 h-3 rounded-full bg-[#F9DF88] shadow-[0_0_15px_#F9DF88] opacity-60 animate-candle pointer-events-none" />
      <div className="absolute top-8 right-12 w-3 h-3 rounded-full bg-[#F9DF88] shadow-[0_0_15px_#F9DF88] opacity-60 animate-candle pointer-events-none" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Cinematic Climax Phrase */}
        <div className="text-center max-w-3xl mx-auto mb-16 pb-12 border-b border-[#C9A44C]/30">
          <p className="font-cinzel text-xs tracking-[0.4em] text-[#C6C9C8] uppercase mb-3">
            The Journey Beyond
          </p>
          <h2 className="font-cinzel-dec text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-gold-gradient uppercase mb-4">
            "EVERY GREAT LEGEND BEGINS WITH AMBITION."
          </h2>
          <div className="font-cinzel text-xl sm:text-2xl tracking-[0.3em] text-[#A7F3D0] uppercase">
            SLYTHERIN OLYMPIA 2026
          </div>
        </div>

        {/* 4-COLUMN FOOTER LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Column 1: Institutional Heraldry */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-[#C9A44C] bg-[#001C16] flex items-center justify-center shadow-gold-glow">
                <Shield className="w-5 h-5 text-[#E6C66F]" />
              </div>
              <span className="font-cinzel text-sm font-bold text-gold-gradient">
                HOGWARTS ACADEMY
              </span>
            </div>
            <p className="font-cormorant text-base text-[#C6C9C8] leading-relaxed">
              Organised by the Department of Digital Alchemy & Sorcery in association with the Salazar Research Foundation.
            </p>
            <p className="font-cinzel text-xs text-[#8C6F2D]">
              Royal Academic Charter Reg. #2026-SLY
            </p>
          </div>

          {/* Column 2: Quick Sanctuaries Navigation */}
          <div>
            <h4 className="font-cinzel text-xs font-bold tracking-widest text-[#E6C66F] uppercase mb-4">
              Castle Navigation
            </h4>
            <ul className="space-y-2.5 font-cinzel text-xs text-[#D9C99F]/80">
              <li>
                <button
                  onClick={() => onNavigate('greathall')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  The Great Hall
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  The 10 Event Chambers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  The Marauder's Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('commonroom')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  Slytherin Common Room
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  Tournament Schedule
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Rules & Portals */}
          <div>
            <h4 className="font-cinzel text-xs font-bold tracking-widest text-[#E6C66F] uppercase mb-4">
              Sanctuary Decrees
            </h4>
            <ul className="space-y-2.5 font-cinzel text-xs text-[#D9C99F]/80">
              <li>
                <button
                  onClick={() => onNavigate('spellbook')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  Code of Conduct
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  Claim Acceptance Letter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('wizards')}
                  className="hover:text-[#FFF0B8] transition-colors"
                >
                  Gallery of Wizards
                </button>
              </li>
              <li>
                <a
                  href="/api/export-csv"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFF0B8] transition-colors flex items-center space-x-1"
                >
                  <span>Download Registry (CSV)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Chamber Owl */}
          <div>
            <h4 className="font-cinzel text-xs font-bold tracking-widest text-[#E6C66F] uppercase mb-4">
              Owl Post & Coordinates
            </h4>
            <div className="space-y-3 font-cinzel text-xs text-[#C6C9C8]">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" />
                <span>The Dungeons & Great Hall, Hogwarts Castle Campus, Highlands</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#E6C66F] flex-shrink-0" />
                <span>council@slytherin-olympia.org</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#E6C66F] flex-shrink-0" />
                <span>+91 98401 23456 / +91 94451 98765</span>
              </p>
            </div>
          </div>

        </div>

        {/* Fading Golden Serpent Emblem into Emerald Darkness */}
        <div className="flex flex-col items-center justify-center my-10">
          <div className="relative w-20 h-20 opacity-40 hover:opacity-100 transition-opacity duration-700">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#C9A44C]">
              <path
                d="M50 8 L85 22 L85 58 C85 76 50 92 50 92 C50 92 15 76 15 58 L15 22 Z"
                fill="#001C16"
                stroke="#C9A44C"
                strokeWidth="2.5"
              />
              <path
                d="M52 24 C44 24 38 29 40 36 C42 43 58 45 60 54 C62 63 52 70 42 68"
                stroke="#E6C66F"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="50" cy="80" r="2.5" fill="#10B981" />
            </svg>
          </div>
        </div>

        {/* Bottom Legal & Return to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#C9A44C]/20 pt-6 text-xs font-cinzel text-[#8C6F2D] gap-4">
          <p>© 2026 SLYTHERIN OLYMPIA. All Magical Rights Reserved. Bound by Salazar's Oath.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-[#E6C66F] hover:text-[#FFF0B8] border border-[#C9A44C]/30 px-3 py-1.5 rounded transition-all"
          >
            <span>ASCEND TO KEEP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </footer>
  );
};
