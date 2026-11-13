import React from 'react';
import { Crown, Sparkles, Wand2, Shield, Target, Feather } from 'lucide-react';
import { WizardProfile } from '../types';
import { sound } from '../audio/soundEngine';

interface GalleryOfWizardsProps {
  wizards: WizardProfile[];
}

export const GalleryOfWizards: React.FC<GalleryOfWizardsProps> = ({ wizards }) => {
  const getSymbolIcon = (sym: string) => {
    switch (sym) {
      case 'crown': return <Crown className="w-8 h-8 text-[#E6C66F]" />;
      case 'wand': return <Wand2 className="w-8 h-8 text-[#10B981]" />;
      case 'serpent': return <Shield className="w-8 h-8 text-[#E6C66F]" />;
      case 'sparkles': return <Sparkles className="w-8 h-8 text-[#F9DF88]" />;
      case 'target': return <Target className="w-8 h-8 text-[#34D399]" />;
      case 'feather': return <Feather className="w-8 h-8 text-[#C6C9C8]" />;
      default: return <Sparkles className="w-8 h-8 text-[#E6C66F]" />;
    }
  };

  return (
    <section id="wizards" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#00140F] overflow-hidden border-t border-[#C9A44C]/30">
      
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#001C16]/80 mb-3">
            <Crown className="w-4 h-4 text-[#E6C66F]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#E6C66F] uppercase">
              The Moving Portrait Gallery
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            The Gallery of Wizards
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            The distinguished faculty, Grand Inquisitors, and student conveners guiding the halls of Slytherin Olympia 2026. Watch closely as the portraits shift.
          </p>
        </div>

        {/* PORTRAIT FRAMES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wizards.map(wiz => (
            <div
              key={wiz.id}
              onMouseEnter={() => sound.playWandSparkle()}
              className="group relative rounded-xl p-7 bg-[#001C16]/90 border-2 border-[#C9A44C] hover:border-[#FFF0B8] shadow-gold-glow hover:shadow-[0_0_35px_rgba(230,198,111,0.5)] transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Antique Heavy Golden Frame Corners */}
              <div className="corner-ornament corner-tl !border-[#E6C66F] !w-5 !h-5" />
              <div className="corner-ornament corner-tr !border-[#E6C66F] !w-5 !h-5" />
              <div className="corner-ornament corner-bl !border-[#E6C66F] !w-5 !h-5" />
              <div className="corner-ornament corner-br !border-[#E6C66F] !w-5 !h-5" />

              <div>
                {/* Moving Portrait Canvas / Avatar Frame */}
                <div className="relative w-full h-52 rounded-lg bg-gradient-to-b from-[#003B2D] via-[#001C16] to-[#090D0B] border-2 border-[#C9A44C]/60 flex items-center justify-center overflow-hidden mb-6 group-hover:border-[#E6C66F] transition-all">
                  
                  {/* Subtle Canvas Shimmer & Vignette */}
                  <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
                  
                  {/* Moving Living Portrait Animation Character Silhouette */}
                  <div className="relative z-10 flex flex-col items-center animate-[float_6s_easeInOut_infinite] group-hover:scale-105 transition-transform duration-500">
                    <div className="w-20 h-20 rounded-full border-2 border-[#E6C66F] bg-[#00140F] flex items-center justify-center shadow-emerald-glow mb-2">
                      {getSymbolIcon(wiz.portraitSymbol)}
                    </div>
                    <span className="font-cinzel text-[11px] tracking-widest text-[#E6C66F] uppercase font-bold">
                      {wiz.house} House
                    </span>
                  </div>

                  {/* Shifting Golden Aura */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 border border-[#C9A44C]/30 text-[10px] font-cinzel text-[#A7F3D0]">
                    LIVE PORTRAIT
                  </div>
                </div>

                {/* Wizard Info */}
                <span className="block font-cinzel text-[11px] tracking-widest text-[#A7F3D0] uppercase mb-1">
                  {wiz.role}
                </span>
                <h3 className="font-cinzel text-xl font-bold tracking-wide text-gold-gradient mb-1">
                  {wiz.name}
                </h3>
                <p className="font-cormorant text-sm text-[#E6C66F] mb-3">
                  {wiz.title}
                </p>
                <p className="font-cinzel text-[11px] text-[#C6C9C8] mb-4">
                  {wiz.department}
                </p>
              </div>

              {/* Quote Banner */}
              <div className="border-t border-[#C9A44C]/30 pt-4 mt-2">
                <p className="font-cormorant italic text-sm text-[#D9C99F] leading-snug">
                  "{wiz.quote}"
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-cinzel text-[#8C6F2D]">
                  <span>Specialty: {wiz.specialty}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
