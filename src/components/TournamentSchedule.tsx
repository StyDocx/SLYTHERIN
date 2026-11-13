import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ScheduleItem } from '../types';
import { sound } from '../audio/soundEngine';

interface TournamentScheduleProps {
  schedule: ScheduleItem[];
}

export const TournamentSchedule: React.FC<TournamentScheduleProps> = ({ schedule }) => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSchedule = schedule.filter(item => {
    const matchesDay = item.day === activeDay;
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch =
      item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    sound.playPageTurn();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="schedule" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#001C16] overflow-hidden border-t border-[#C9A44C]/30">
      
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#00140F]/80 mb-3">
            <Calendar className="w-4 h-4 text-[#E6C66F]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#E6C66F] uppercase">
              The Tournament Register
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            Tournament Schedule
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            The chronological order of trials, banquets, debates, and grand championship finals across the two legendary days of Olympia 2026.
          </p>
        </div>

        {/* Day Selector & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Day 1 / Day 2 Tabs */}
          <div className="flex items-center space-x-3 p-1.5 rounded-lg border border-[#C9A44C]/40 bg-[#00140F]/90">
            <button
              onClick={() => {
                sound.playGoldClick();
                setActiveDay(1);
              }}
              className={`px-6 py-2.5 rounded font-cinzel text-xs tracking-widest font-bold transition-all uppercase ${
                activeDay === 1
                  ? 'bg-gradient-to-r from-[#C9A44C] to-[#E6C66F] text-[#090D0B] shadow-gold-glow'
                  : 'text-[#D9C99F] hover:text-[#E6C66F]'
              }`}
            >
              DAY 1 — 14 MARCH 2026
            </button>

            <button
              onClick={() => {
                sound.playGoldClick();
                setActiveDay(2);
              }}
              className={`px-6 py-2.5 rounded font-cinzel text-xs tracking-widest font-bold transition-all uppercase ${
                activeDay === 2
                  ? 'bg-gradient-to-r from-[#C9A44C] to-[#E6C66F] text-[#090D0B] shadow-gold-glow'
                  : 'text-[#D9C99F] hover:text-[#E6C66F]'
              }`}
            >
              DAY 2 — 15 MARCH 2026
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search schedule timeline..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded border border-[#C9A44C]/40 bg-[#00140F]/90 text-sm text-[#D9C99F] placeholder-[#8C6F2D] focus:border-[#E6C66F] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#C9A44C] absolute left-3.5 top-3" />
          </div>

        </div>

        {/* TIMELINE LIST */}
        <div className="relative border-l-2 border-[#C9A44C]/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-6">
          {filteredSchedule.length === 0 ? (
            <div className="p-8 rounded-lg border border-[#C9A44C]/30 bg-[#00140F]/80 text-center font-cinzel text-sm text-[#E6C66F]">
              No scheduled trials found for this day matching your criteria.
            </div>
          ) : (
            filteredSchedule.map(item => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="relative group p-6 rounded-xl border border-[#C9A44C]/30 bg-[#001C16]/90 hover:border-[#E6C66F] hover:shadow-emerald-glow transition-all duration-300"
                >
                  {/* Timeline Node Point */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-4 h-4 rounded-full border-2 border-[#C9A44C] bg-[#001C16] shadow-gold-glow group-hover:scale-125 group-hover:bg-[#E6C66F] transition-all" />

                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1.5 font-cinzel text-xs text-[#E6C66F] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.time}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded font-cinzel text-[10px] text-[#A7F3D0] border border-[#08734B] bg-[#003B2D]/50 uppercase">
                        {item.category}
                      </span>
                    </div>

                    <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full font-cinzel text-[11px] font-bold uppercase ${
                      item.status === 'Live Now'
                        ? 'border border-red-500 bg-red-950/40 text-red-400 animate-pulse'
                        : 'border border-[#08734B] bg-[#003B2D]/40 text-[#34D399]'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient tracking-wide mb-2">
                    {item.event}
                  </h3>

                  {/* Venue */}
                  <div className="flex items-center space-x-2 text-xs font-cinzel text-[#C6C9C8] mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Chamber Venue: {item.venue}</span>
                  </div>

                  {/* Expandable Briefing */}
                  {item.description && (
                    <div className="border-t border-[#C9A44C]/20 pt-3 mt-3">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="flex items-center space-x-1.5 text-xs font-cinzel text-[#E6C66F] hover:text-[#FFF0B8]"
                      >
                        <span>{isExpanded ? 'Conceal Briefing' : 'Inspect Chamber Briefing'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <p className="font-cormorant italic text-base text-[#D9C99F] mt-2 animate-fadeIn">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

    </section>
  );
};
