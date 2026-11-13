import React, { useState } from 'react';
import { Compass, Eye, EyeOff, Footprints, MapPin, Sparkles, X, ChevronRight } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface MapLocation {
  id: string;
  name: string;
  chamber: string;
  x: number; // percentage
  y: number; // percentage
  status: string;
  category: string;
  description: string;
  activeWizard: string;
}

export const MaraudersMap: React.FC<{ onSelectChamber?: (name: string) => void }> = ({ onSelectChamber }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const locations: MapLocation[] = [
    {
      id: 'loc-1',
      name: 'The Dungeons Computing Lab',
      chamber: 'Chamber of Parseltongue',
      x: 22,
      y: 72,
      status: 'Live Duel (Active)',
      category: 'Technical',
      description: 'Ancient stone archways illuminated by emerald flames. Hundreds of terminal monitors hum as wizards code.',
      activeWizard: 'Severus Snape (Inspecting Algorithms)'
    },
    {
      id: 'loc-2',
      name: 'The Astronomy Tower Interactive Suite',
      chamber: 'The Lumos Design Guild',
      x: 78,
      y: 28,
      status: 'Design Trials',
      category: 'Technical',
      description: 'The highest spired observatory overlooking the Black Lake. Shaders and celestial web interfaces rendered live.',
      activeWizard: 'Rowena Thorne (Crafting Shaders)'
    },
    {
      id: 'loc-3',
      name: 'The Great Hall High Dais',
      chamber: 'The High Council Chamber',
      x: 50,
      y: 52,
      status: 'Wizengamot Debates',
      category: 'Non-Technical',
      description: 'Thousands of floating candles illuminate the parliamentarians debating the ethics of forbidden artificial intelligence.',
      activeWizard: 'Dr. Salazar V. Sterling (Adjudicating)'
    },
    {
      id: 'loc-4',
      name: 'The Slytherin Common Room Vaults',
      chamber: 'The Quidditch Esports Deck',
      x: 35,
      y: 84,
      status: 'Esports Bracket Finals',
      category: 'Gaming',
      description: 'Beneath the icy waters of the Black Lake. Strategic tactical teams clash in Valorant and Wizard Chess.',
      activeWizard: 'Viktor Krum Jr. (Live Casting)'
    },
    {
      id: 'loc-5',
      name: 'The Grand Oculus Arcade',
      chamber: 'Salazar Innovation Expo',
      x: 62,
      y: 65,
      status: 'Hardware Prototypes Running',
      category: 'Special',
      description: 'Breakthrough robotics, neural charms, and autonomous wizarding artifacts undergoing jury cross-examination.',
      activeWizard: 'Miss Seraphina Lestrange (Evaluating)'
    },
    {
      id: 'loc-6',
      name: 'The Viaduct Cloisters',
      chamber: 'Pensieve Film & Photography',
      x: 18,
      y: 35,
      status: 'Exhibition & Scouting',
      category: 'Cultural',
      description: 'Cinematographers capturing the moody fog rolling over the stone gothic parapets.',
      activeWizard: 'Julian Avery (Framing Shots)'
    }
  ];

  const handleReveal = () => {
    sound.playSpellCast();
    sound.playPageTurn();
    setIsRevealed(true);
  };

  const handleConceal = () => {
    sound.playPageTurn();
    setIsRevealed(false);
    setSelectedLocation(null);
  };

  const handlePinClick = (loc: MapLocation) => {
    sound.playWandSparkle();
    setSelectedLocation(loc);
  };

  return (
    <section id="map" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#00140F] overflow-hidden border-t border-[#C9A44C]/30">
      
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#001C16]/80 mb-3">
            <Compass className="w-4 h-4 text-[#E6C66F]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#E6C66F] uppercase">
              Cartographic Enchantment
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            The Marauder's Map
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            "Messrs. Moony, Wormtail, Padfoot, and Prongs are proud to present the live interactive blueprints of Hogwarts Castle for Olympia 2026."
          </p>
        </div>

        {/* MAP ACTIVATION / FOLDED STATE */}
        {!isRevealed ? (
          <div className="relative max-w-2xl mx-auto p-10 sm:p-14 rounded-xl parchment-card text-center border-4 border-[#8C6F2D] shadow-2xl">
            <div className="corner-ornament corner-tl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-tr !border-[#8C6F2D]" />
            <div className="corner-ornament corner-bl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-br !border-[#8C6F2D]" />

            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#8C6F2D] bg-[#F5EEDC] flex items-center justify-center shadow-inner">
              <Footprints className="w-10 h-10 text-[#8C6F2D] animate-pulse" />
            </div>

            <h3 className="font-cinzel text-2xl font-bold tracking-wider text-[#1A1409] mb-3">
              THE PARCHMENT RESTS BLANK
            </h3>
            <p className="font-cormorant italic text-lg text-[#5A461E] mb-8">
              Speak the ancient oath to awaken the footsteps of every contestant and judge moving within the stone corridors.
            </p>

            <button
              onClick={handleReveal}
              className="group relative inline-flex items-center space-x-3 px-8 py-4 rounded-md font-cinzel text-sm font-bold tracking-[0.2em] text-[#090D0B] bg-gradient-to-r from-[#C9A44C] via-[#F9DF88] to-[#C9A44C] border-2 border-[#8C6F2D] shadow-xl hover:scale-105 transition-all uppercase"
            >
              <Eye className="w-4 h-4 text-[#001C16]" />
              <span>"I SOLEMNLY SWEAR THAT I AM UP TO NO GOOD"</span>
            </button>
          </div>
        ) : (
          /* THE ENCHANTED LIVING MAP VIEW */
          <div className="relative w-full rounded-xl parchment-card border-4 border-[#8C6F2D] p-4 sm:p-8 shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b-2 border-[#8C6F2D]/50 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <Footprints className="w-6 h-6 text-[#8C6F2D] animate-bounce" />
                <div>
                  <h4 className="font-cinzel text-base font-bold text-[#1A1409] tracking-wider uppercase">
                    HOGWARTS CASTLE — LIVE CONTESTANT SURVEILLANCE
                  </h4>
                  <span className="font-cormorant italic text-xs text-[#5A461E]">
                    Click any chamber pin to inspect active tournament trials and presiding wizards
                  </span>
                </div>
              </div>

              <button
                onClick={handleConceal}
                className="mt-3 sm:mt-0 px-4 py-2 rounded font-cinzel text-xs font-bold tracking-widest text-[#1A1409] hover:bg-[#8C6F2D]/20 border border-[#8C6F2D] flex items-center space-x-1.5 transition-colors uppercase"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>"MISCHIEF MANAGED"</span>
              </button>
            </div>

            {/* Interactive SVG Blueprint Canvas */}
            <div className="relative w-full h-[520px] rounded-lg bg-[#F5EEDC] border-2 border-[#8C6F2D]/60 overflow-hidden shadow-inner">
              
              {/* Hand-Drawn Gothic Floorplan Graphic SVG */}
              <svg className="w-full h-full opacity-65" viewBox="0 0 1000 600" fill="none" stroke="#7A6126" strokeWidth="2">
                {/* Outer Bailey & Walls */}
                <rect x="50" y="50" width="900" height="500" strokeDasharray="10 5" />
                
                {/* Great Hall Wing */}
                <polygon points="350,200 650,200 650,380 350,380" strokeWidth="3" />
                <line x1="350" y1="260" x2="650" y2="260" strokeDasharray="4 4" />
                <line x1="350" y1="320" x2="650" y2="320" strokeDasharray="4 4" />
                <text x="430" y="240" fill="#7A6126" className="font-cinzel text-xs font-bold" stroke="none">THE GREAT HALL</text>
                
                {/* Astronomy Tower (Top Right) */}
                <circle cx="780" cy="180" r="80" strokeWidth="3" />
                <circle cx="780" cy="180" r="50" strokeDasharray="6 3" />
                <text x="730" y="185" fill="#7A6126" className="font-cinzel text-[11px] font-bold" stroke="none">ASTRONOMY TOWER</text>

                {/* Dungeons & Slytherin Vaults (Bottom Left) */}
                <polygon points="120,400 320,400 320,520 120,520" strokeWidth="3" />
                <path d="M120 440 H320 M120 480 H320" strokeDasharray="4 4" />
                <text x="145" y="465" fill="#7A6126" className="font-cinzel text-[11px] font-bold" stroke="none">POTIONS DUNGEONS</text>

                {/* Viaduct Bridge (Top Left) */}
                <path d="M100 120 Q 220 120 280 200" strokeWidth="4" />
                <text x="130" y="110" fill="#7A6126" className="font-cinzel text-[10px] font-bold" stroke="none">VIADUCT CLOISTERS</text>

                {/* Courtyards & Corridors */}
                <path d="M320 460 Q 450 460 500 380" strokeDasharray="6 4" />
                <path d="M650 290 Q 720 290 780 260" strokeDasharray="6 4" />
              </svg>

              {/* Animated Footprints Wandering Paths */}
              <div className="absolute top-[28%] left-[45%] flex items-center space-x-1 animate-footstep">
                <Footprints className="w-4 h-4 text-[#7A6126] -rotate-45" />
                <span className="font-cormorant italic text-[11px] text-[#5A461E] bg-[#F5EEDC]/80 px-1 rounded">
                  Draco Malfoy (Moving to Dungeons)
                </span>
              </div>

              <div className="absolute top-[68%] left-[28%] flex items-center space-x-1 animate-footstep" style={{ animationDelay: '2s' }}>
                <Footprints className="w-4 h-4 text-[#7A6126] rotate-90" />
                <span className="font-cormorant italic text-[11px] text-[#5A461E] bg-[#F5EEDC]/80 px-1 rounded">
                  Head Prefect (Patrolling Lab)
                </span>
              </div>

              <div className="absolute top-[38%] left-[72%] flex items-center space-x-1 animate-footstep" style={{ animationDelay: '1.2s' }}>
                <Footprints className="w-4 h-4 text-[#7A6126] rotate-180" />
                <span className="font-cormorant italic text-[11px] text-[#5A461E] bg-[#F5EEDC]/80 px-1 rounded">
                  Severus Vance
                </span>
              </div>

              {/* Interactive Location Markers */}
              {locations.map(loc => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handlePinClick(loc)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  >
                    {/* Pulsing Pin Ring */}
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-[#003B2D] bg-[#08734B] scale-125 shadow-lg'
                        : 'border-[#8C6F2D] bg-[#D9C99F] group-hover:scale-115 group-hover:bg-[#E6C66F]'
                    }`}>
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#FFF0B8]' : 'text-[#7A6126]'}`} />
                    </div>

                    {/* Hover Location Badge */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-9 px-2 py-1 rounded bg-[#1A1409] text-[#F9DF88] font-cinzel text-[10px] tracking-wider whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      {loc.name}
                    </div>
                  </button>
                );
              })}

            </div>

            {/* Selected Location Details Drawer */}
            {selectedLocation && (
              <div className="mt-6 p-5 rounded-lg bg-[#F5EEDC] border-2 border-[#8C6F2D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded font-cinzel text-[10px] font-bold text-white bg-[#003B2D] uppercase">
                      {selectedLocation.category}
                    </span>
                    <span className="font-cinzel text-xs text-[#08734B] font-bold">
                      {selectedLocation.status}
                    </span>
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-[#1A1409] mt-1">
                    {selectedLocation.name}
                  </h3>
                  <p className="font-cormorant text-base text-[#4A3B18] mt-0.5">
                    {selectedLocation.description}
                  </p>
                  <p className="font-cinzel text-xs text-[#8C6F2D] mt-2 font-bold">
                    Presiding Wizard: {selectedLocation.activeWizard}
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playWandSparkle();
                    if (onSelectChamber) onSelectChamber(selectedLocation.chamber);
                  }}
                  className="px-6 py-2.5 rounded font-cinzel text-xs font-bold tracking-widest text-[#090D0B] bg-[#C9A44C] hover:bg-[#F9DF88] border border-[#8C6F2D] shadow transition-all uppercase whitespace-nowrap"
                >
                  TELEPORT TO CHAMBER
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </section>
  );
};
