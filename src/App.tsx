import React, { useState, useEffect } from 'react';
import { CursorEffect } from './components/CursorEffect';
import { AudioControls } from './components/AudioControls';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GreatHall } from './components/GreatHall';
import { EventChambers } from './components/EventChambers';
import { MaraudersMap } from './components/MaraudersMap';
import { SlytherinCommonRoom } from './components/SlytherinCommonRoom';
import { TournamentSchedule } from './components/TournamentSchedule';
import { Spellbook } from './components/Spellbook';
import { AcceptanceLetterRegistration } from './components/AcceptanceLetterRegistration';
import { GalleryOfWizards } from './components/GalleryOfWizards';
import { AdminDashboard } from './components/AdminDashboard';
import { MagicalFooter } from './components/MagicalFooter';

import { EventItem, WizardProfile, ScheduleItem } from './types';
import { INITIAL_EVENTS, INITIAL_WIZARDS, INITIAL_SCHEDULE } from './data/mockData';
import { sound } from './audio/soundEngine';

export function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [wizards] = useState<WizardProfile[]>(INITIAL_WIZARDS);
  const [schedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [preSelectedEvent, setPreSelectedEvent] = useState<EventItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch events from backend API if available
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      }
    } catch (e) {
      console.warn('Backend API offline, utilizing initial event scrolls:', e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'greathall', 'events', 'map', 'commonroom', 'schedule', 'spellbook', 'wizards', 'register'];
      const scrollPos = window.scrollY + 250;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectGatewayCategory = (category: string) => {
    setSelectedCategory(category);
    handleNavigate('events');
  };

  const handleRegisterEventTrigger = (event: EventItem) => {
    setPreSelectedEvent(event);
    handleNavigate('register');
  };

  return (
    <div className="relative min-h-screen bg-[#001C16] text-[#D9C99F] selection:bg-[#08734B] selection:text-[#FFF0B8]">
      
      {/* 1. Custom Magical Wand Sparkles Cursor */}
      <CursorEffect />

      {/* 2. Floating Crystal Sound Sanctuary Audio Controller */}
      <AudioControls />

      {/* 3. Full-Screen Cinematic Opening Experience */}
      {!introFinished && (
        <CinematicIntro
          onEnter={() => {
            setIntroFinished(true);
            sound.startCastleAmbience('castle');
          }}
        />
      )}

      {/* 4. Ornate Hogwarts Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 5. Main Hero — The Living Castle Poster */}
      <HeroSection
        onRegisterClick={() => handleNavigate('register')}
        onExploreEvents={() => handleNavigate('events')}
        onExploreMap={() => handleNavigate('map')}
      />

      {/* 6. The Great Hall — 5 Magical Gateways */}
      <GreatHall
        onSelectCategory={handleSelectGatewayCategory}
      />

      {/* 7. Event Details — The 10 Magical Chambers */}
      <EventChambers
        events={events}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onRegisterEvent={handleRegisterEventTrigger}
      />

      {/* 8. The Marauder's Map — Interactive Castle Floorplans & Footsteps */}
      <MaraudersMap
        onSelectChamber={() => handleNavigate('events')}
      />

      {/* 9. The Slytherin Common Room — Underwater Black Lake & 3D Serpent */}
      <SlytherinCommonRoom />

      {/* 10. Tournament Schedule — Day 1 & Day 2 Chronological Timetable */}
      <TournamentSchedule
        schedule={schedule}
      />

      {/* 11. The Spellbook — Grimoire of Rules, Wand Conduct & FAQ */}
      <Spellbook />

      {/* 12. Registration — The Hogwarts Acceptance Letter with Wax Seal */}
      <AcceptanceLetterRegistration
        events={events}
        preSelectedEvent={preSelectedEvent}
        onRegisteredSuccess={() => fetchEvents()}
      />

      {/* 13. Gallery of Wizards — Moving Portraits of Committee & Faculty */}
      <GalleryOfWizards
        wizards={wizards}
      />

      {/* 14. Admin Chamber Portal (Secured by Passcode: slytherin2026) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        events={events}
        onRefreshEvents={fetchEvents}
      />

      {/* 15. Final Footer — Underground Corridor Fading into Emerald Darkness */}
      <MagicalFooter
        onNavigate={handleNavigate}
      />

    </div>
  );
}

export default App;
