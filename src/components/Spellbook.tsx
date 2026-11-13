import React, { useState } from 'react';
import { BookOpen, Sparkles, Feather, HelpCircle, Shield, Award, CheckCircle, ChevronRight } from 'lucide-react';
import { sound } from '../audio/soundEngine';

export const Spellbook: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<'general' | 'conduct' | 'eligibility' | 'payment' | 'faq'>('general');

  const chapters = [
    { id: 'general', label: 'I. Code of the Assembly', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'conduct', label: 'II. Wand & Hardware Conduct', icon: <Shield className="w-4 h-4" /> },
    { id: 'eligibility', label: 'III. Delegation Eligibility', icon: <Award className="w-4 h-4" /> },
    { id: 'payment', label: 'IV. Galleon Exchange & Fees', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'faq', label: 'V. Pensieve Inquiries (FAQ)', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  const handleSelectChapter = (id: typeof activeChapter) => {
    sound.playPageTurn();
    setActiveChapter(id);
  };

  return (
    <section id="spellbook" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#00140F] overflow-hidden border-t border-[#C9A44C]/30">
      
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#001C16]/80 mb-3">
            <Feather className="w-4 h-4 text-[#E6C66F]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#E6C66F] uppercase">
              The Grimoire of Salazar
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            The Spellbook of Rules
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            Every great wizard operates under discipline. Turn the leather-bound pages of the tournament charter to consult the statutes of Olympia 2026.
          </p>
        </div>

        {/* 2-COLUMN BOOK INTERACTION: BOOKMARKS / CHAPTER CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chapter Bookmarks / Index Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-cinzel text-xs tracking-widest text-[#C9A44C] uppercase px-2 mb-3">
              Charter Chapters
            </h4>
            {chapters.map(chap => {
              const isActive = activeChapter === chap.id;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleSelectChapter(chap.id as typeof activeChapter)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg font-cinzel text-xs tracking-wider transition-all text-left ${
                    isActive
                      ? 'border-2 border-[#E6C66F] bg-gradient-to-r from-[#003B2D] to-[#001C16] text-[#FFF0B8] shadow-gold-glow font-bold'
                      : 'border border-[#C9A44C]/30 bg-[#001C16]/80 text-[#D9C99F] hover:border-[#C9A44C]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-[#F9DF88]' : 'text-[#8C6F2D]'}>
                      {chap.icon}
                    </span>
                    <span>{chap.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#E6C66F]' : 'text-[#8C6F2D]'}`} />
                </button>
              );
            })}
          </div>

          {/* Grimoire Parchment Page Column */}
          <div className="lg:col-span-8 parchment-card p-8 sm:p-12 rounded-xl border-4 border-[#8C6F2D] shadow-2xl relative min-h-[460px] animate-fadeIn text-[#1A1409]">
            
            <div className="corner-ornament corner-tl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-tr !border-[#8C6F2D]" />
            <div className="corner-ornament corner-bl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-br !border-[#8C6F2D]" />

            {/* CHAPTER 1: GENERAL GUIDELINES */}
            {activeChapter === 'general' && (
              <div className="space-y-4">
                <div className="border-b-2 border-[#8C6F2D] pb-3 mb-4">
                  <span className="font-cinzel text-xs text-[#8C6F2D] font-bold uppercase tracking-widest">
                    Chapter I • Code of the Assembly
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-[#090D0B] mt-1">
                    General Guidelines of Olympia 2026
                  </h3>
                </div>
                <div className="space-y-3 font-cormorant text-base sm:text-lg text-[#1A1409] leading-relaxed">
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Every participating student wizard must carry their valid college identification talisman and official Hogwarts Acceptance Letter.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Delegations must register their presence at the Great Hall Main Portico before 09:30 AM on Day 1.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Smoking, unruly spell casting, and disruptive behavior inside academic vaults result in immediate banishment by the Inquisitorial Squad.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>The decisions rendered by the Grand Inquisitor and panel arbiters are final, sacred, and non-negotiable.</span>
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 2: WAND & HARDWARE CONDUCT */}
            {activeChapter === 'conduct' && (
              <div className="space-y-4">
                <div className="border-b-2 border-[#8C6F2D] pb-3 mb-4">
                  <span className="font-cinzel text-xs text-[#8C6F2D] font-bold uppercase tracking-widest">
                    Chapter II • Code of Tools & Silicon
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-[#090D0B] mt-1">
                    Wand Weighing & Hardware Protocol
                  </h3>
                </div>
                <div className="space-y-3 font-cormorant text-base sm:text-lg text-[#1A1409] leading-relaxed">
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>For technical events, contestants may bring their own battle stations (laptops) or utilize the lab terminal rigs.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>All external wands (USB peripherals, mice, keyboards) must undergo pre-trial inspection by the technical marshals.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Unannounced network interception, spoofing, or unauthorized API querying across trial subnets triggers instant disqualification.</span>
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 3: ELIGIBILITY */}
            {activeChapter === 'eligibility' && (
              <div className="space-y-4">
                <div className="border-b-2 border-[#8C6F2D] pb-3 mb-4">
                  <span className="font-cinzel text-xs text-[#8C6F2D] font-bold uppercase tracking-widest">
                    Chapter III • Delegation Eligibility
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-[#090D0B] mt-1">
                    Student Criteria & Inter-College Standing
                  </h3>
                </div>
                <div className="space-y-3 font-cormorant text-base sm:text-lg text-[#1A1409] leading-relaxed">
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Open to all bona fide undergraduate and postgraduate engineering, arts, and science collegiate students across all recognized universities.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Inter-departmental and inter-college team alliances are warmly welcomed for gaming and innovation expo categories.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>A single student may register for up to three non-clashing events across the two festival days.</span>
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 4: PAYMENT INFORMATION */}
            {activeChapter === 'payment' && (
              <div className="space-y-4">
                <div className="border-b-2 border-[#8C6F2D] pb-3 mb-4">
                  <span className="font-cinzel text-xs text-[#8C6F2D] font-bold uppercase tracking-widest">
                    Chapter IV • Galleons & Treasury
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-[#090D0B] mt-1">
                    Registration Dues & Prize Disbursals
                  </h3>
                </div>
                <div className="space-y-3 font-cormorant text-base sm:text-lg text-[#1A1409] leading-relaxed">
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Nominal event fee tariffs are listed in Galleons (pegged 1 Galleon = ₹1 INR for modern convenience).</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Upon form submission, an authentic Acceptance Letter pass with reference ID is issued instantly. Payments can be confirmed online or at the Gringotts desk on arrival.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>Cash prizes, trophies, and Salazar Medallions will be presented at the Valedictory ceremony on Day 2.</span>
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 5: FAQS */}
            {activeChapter === 'faq' && (
              <div className="space-y-4">
                <div className="border-b-2 border-[#8C6F2D] pb-3 mb-4">
                  <span className="font-cinzel text-xs text-[#8C6F2D] font-bold uppercase tracking-widest">
                    Chapter V • Pensieve Inquiries
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-[#090D0B] mt-1">
                    Frequently Answered Mysteries
                  </h3>
                </div>
                <div className="space-y-4 font-cormorant text-base text-[#1A1409]">
                  <div>
                    <h5 className="font-cinzel text-xs font-bold text-[#8C6F2D] uppercase">
                      Q: Can on-spot registrations be summoned?
                    </h5>
                    <p className="mt-1">
                      A: Limited spot slots will open at the Great Hall Portico on Day 1 morning, subject to remaining chamber capacity. Pre-registration via this portal guarantees your chamber slot.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-cinzel text-xs font-bold text-[#8C6F2D] uppercase">
                      Q: Will food draughts and refreshments be provided?
                    </h5>
                    <p className="mt-1">
                      A: Yes, all registered wizards receive festive banquet lunch and enchanted evening refreshments in the Great Hall.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-cinzel text-xs font-bold text-[#8C6F2D] uppercase">
                      Q: Is accommodation available for distant delegations?
                    </h5>
                    <p className="mt-1">
                      A: Dormitory accommodations inside campus guest towers are available upon contacting the organizing team at least 48 hours prior.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </section>
  );
};
