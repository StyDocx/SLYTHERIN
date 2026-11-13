import React, { useState } from 'react';
import { 
  Sparkles, Calendar, Clock, MapPin, Users, Coins, 
  ShieldCheck, Phone, Mail, X, Search, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { sound } from '../audio/soundEngine';

interface EventChambersProps {
  events: EventItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onRegisterEvent: (event: EventItem) => void;
}

export const EventChambers: React.FC<EventChambersProps> = ({
  events,
  selectedCategory,
  onSelectCategory,
  onRegisterEvent
}) => {
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Technical',
    'Non-Technical',
    'Cultural',
    'Gaming',
    'Special'
  ];

  const filteredEvents = events.filter(ev => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.chamberName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenChamber = (event: EventItem) => {
    sound.playPageTurn();
    setActiveModalEvent(event);
  };

  const handleCloseModal = () => {
    sound.playGoldClick();
    setActiveModalEvent(null);
  };

  return (
    <section id="events" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#001C16] overflow-hidden">
      
      {/* Background Volumetric Mist */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#08734B]/15 via-transparent to-black" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#00140F]/80 mb-3">
            <Sparkles className="w-4 h-4 text-[#E6C66F]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#E6C66F] uppercase">
              The 10 Trial Vaults
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            Magical Event Chambers
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            Unseal the grimoires of Olympia 2026. Every chamber is guarded by its own ancient regulations, trial coordinators, and legendary bounties.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-12">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playGoldClick();
                    onSelectCategory(cat);
                  }}
                  className={`px-4 py-2 rounded font-cinzel text-xs tracking-wider transition-all duration-200 uppercase ${
                    isSelected
                      ? 'border-2 border-[#E6C66F] bg-[#003B2D] text-[#FFF0B8] shadow-gold-glow font-bold'
                      : 'border border-[#C9A44C]/30 bg-[#00140F]/80 text-[#D9C99F] hover:border-[#C9A44C]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Spell / Event Search Bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by spell or chamber name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded border border-[#C9A44C]/40 bg-[#00140F]/90 text-sm text-[#D9C99F] placeholder-[#8C6F2D] focus:border-[#E6C66F] focus:outline-none focus:shadow-gold-glow transition-all"
            />
            <Search className="w-4 h-4 text-[#C9A44C] absolute left-3.5 top-3" />
          </div>

        </div>

        {/* CHAMBER VAULTS DISPLAY GRID */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-lg border border-[#C9A44C]/30 bg-[#00140F]/80">
            <p className="font-cinzel text-lg text-[#E6C66F] mb-2">No mystical chambers found matching your query.</p>
            <p className="font-cormorant text-sm text-[#C6C9C8]">Clear your search term or select another category tab above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="group relative rounded-xl border-2 border-[#C9A44C]/40 bg-[#001C16]/90 p-7 flex flex-col justify-between hover:border-[#E6C66F] hover:shadow-[0_0_30px_rgba(8,115,75,0.45)] transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Ancient Corner Ornaments */}
                <div className="corner-ornament corner-tl" />
                <div className="corner-ornament corner-tr" />
                <div className="corner-ornament corner-bl" />
                <div className="corner-ornament corner-br" />

                <div>
                  {/* Chamber Badge & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-cinzel text-[11px] tracking-widest text-[#E6C66F] px-2.5 py-0.5 rounded border border-[#C9A44C]/50 bg-[#003B2D]/50 uppercase">
                      {event.category}
                    </span>
                    <span className="font-cinzel text-xs text-[#A7F3D0]">
                      {event.badge}
                    </span>
                  </div>

                  {/* Chamber Title */}
                  <h3 className="font-cinzel text-xl font-bold tracking-wider text-gold-gradient mb-2 group-hover:text-[#FFF0B8] transition-colors">
                    {event.name}
                  </h3>

                  {/* Tagline */}
                  <p className="font-cinzel italic text-xs text-[#E6C66F] mb-4">
                    "{event.tagline}"
                  </p>

                  {/* Description snippet */}
                  <p className="font-cormorant text-sm text-[#C6C9C8] line-clamp-3 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Quick Meta Stats */}
                  <div className="space-y-2 text-xs font-cinzel text-[#D9C99F] border-t border-[#C9A44C]/20 pt-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-[#E6C66F]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-[#E6C66F]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coins className="w-3.5 h-3.5 text-[#F9DF88]" />
                      <span>{event.fee}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Inspect Grimoire & Register */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#C9A44C]/20">
                  <button
                    onClick={() => handleOpenChamber(event)}
                    className="flex-1 py-2.5 px-3 rounded font-cinzel text-xs tracking-wider text-[#D9C99F] hover:text-[#FFF0B8] border border-[#C9A44C]/50 hover:border-[#E6C66F] bg-[#00140F] transition-all text-center flex items-center justify-center space-x-1"
                  >
                    <span>UNFOLD SCROLL</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      sound.playSealStamp();
                      onRegisterEvent(event);
                    }}
                    className="py-2.5 px-4 rounded font-cinzel text-xs font-bold tracking-wider text-[#090D0B] bg-gradient-to-r from-[#C9A44C] via-[#F9DF88] to-[#C9A44C] border border-[#FFF0B8] hover:scale-105 shadow-gold-glow transition-all uppercase"
                  >
                    REGISTER
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* FULL-SCREEN UNFOLDED MAGICAL GRIMOIRE MODAL */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto parchment-card p-6 sm:p-10 rounded-lg shadow-2xl text-[#1A1409]">
            
            {/* Ornate Gold Trim Corners */}
            <div className="corner-ornament corner-tl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-tr !border-[#8C6F2D]" />
            <div className="corner-ornament corner-bl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-br !border-[#8C6F2D]" />

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-full border border-[#8C6F2D] hover:bg-[#8C6F2D]/20 text-[#1A1409] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Chamber Header */}
            <div className="border-b-2 border-[#8C6F2D] pb-4 mb-6">
              <span className="font-cinzel text-xs tracking-[0.25em] text-[#8C6F2D] font-bold uppercase">
                {activeModalEvent.chamberName} • {activeModalEvent.category} Division
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wide text-[#090D0B] mt-1">
                {activeModalEvent.name}
              </h2>
              <p className="font-cormorant italic text-lg text-[#5A461E] mt-1">
                "{activeModalEvent.tagline}"
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="font-cinzel text-sm font-bold tracking-wider text-[#8C6F2D] uppercase mb-2">
                Chamber Briefing & Lore
              </h4>
              <p className="font-cormorant text-lg text-[#1A1409] leading-relaxed">
                {activeModalEvent.description}
              </p>
            </div>

            {/* Trial Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded bg-[#9A8350]/20 border border-[#8C6F2D]/40 mb-6 font-cinzel text-xs">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#8C6F2D]" />
                <span><strong>Date:</strong> {activeModalEvent.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#8C6F2D]" />
                <span><strong>Timings:</strong> {activeModalEvent.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#8C6F2D]" />
                <span><strong>Chamber Venue:</strong> {activeModalEvent.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#8C6F2D]" />
                <span><strong>Participation:</strong> {activeModalEvent.participation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-[#8C6F2D]" />
                <span><strong>Registration Fee:</strong> {activeModalEvent.fee}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#8C6F2D]" />
                <span><strong>Max Capacity:</strong> {activeModalEvent.maxParticipants || 'Open'} Wizards</span>
              </div>
            </div>

            {/* Rules and Regulations */}
            <div className="mb-6">
              <h4 className="font-cinzel text-sm font-bold tracking-wider text-[#8C6F2D] uppercase mb-3 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Tournament Rules & Wand Conduct</span>
              </h4>
              <ul className="space-y-2">
                {activeModalEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 font-cormorant text-base text-[#1A1409]">
                    <CheckCircle2 className="w-4 h-4 text-[#08734B] flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prizes / Galleons */}
            <div className="p-4 rounded border-2 border-[#8C6F2D] bg-[#F5EEDC] mb-6">
              <h5 className="font-cinzel text-xs font-bold tracking-widest text-[#8C6F2D] uppercase mb-1">
                Declared Tournament Bounties
              </h5>
              <p className="font-cinzel text-sm font-bold text-[#003B2D]">
                {activeModalEvent.prizes}
              </p>
            </div>

            {/* Coordinators */}
            <div className="border-t border-[#8C6F2D]/40 pt-4 mb-6">
              <h4 className="font-cinzel text-xs font-bold tracking-wider text-[#8C6F2D] uppercase mb-3">
                Chamber Wardens & Coordinators
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-cinzel">
                {activeModalEvent.coordinators.map((coord, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#9A8350]/20 border border-[#8C6F2D]/30">
                    <p className="font-bold text-[#090D0B]">{coord.name}</p>
                    <p className="text-[#5A461E]">{coord.title}</p>
                    {coord.phone && (
                      <p className="flex items-center space-x-1.5 mt-1 text-[#003B2D]">
                        <Phone className="w-3 h-3" />
                        <span>{coord.phone}</span>
                      </p>
                    )}
                    {coord.owlEmail && (
                      <p className="flex items-center space-x-1.5 text-[#003B2D] truncate">
                        <Mail className="w-3 h-3" />
                        <span>{coord.owlEmail}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-[#8C6F2D]">
              <span className="font-cormorant italic text-sm text-[#5A461E]">
                Official acceptance seals granted upon submission.
              </span>
              <button
                onClick={() => {
                  sound.playSealStamp();
                  onRegisterEvent(activeModalEvent);
                  setActiveModalEvent(null);
                }}
                className="w-full sm:w-auto px-8 py-3 rounded font-cinzel text-sm font-bold tracking-widest text-[#090D0B] bg-gradient-to-r from-[#C9A44C] via-[#F9DF88] to-[#C9A44C] border-2 border-[#8C6F2D] hover:scale-105 shadow-lg uppercase transition-all"
              >
                PROCEED TO REGISTRATION
              </button>
            </div>

          </div>

        </div>
      )}

    </section>
  );
};
