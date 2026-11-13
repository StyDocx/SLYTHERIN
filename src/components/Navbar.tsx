import React, { useState } from 'react';
import { Menu, X, Shield, Sparkles, KeyRound } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Castle Keep' },
    { id: 'greathall', label: 'The Great Hall' },
    { id: 'events', label: 'Magical Events' },
    { id: 'map', label: "Marauder's Map" },
    { id: 'commonroom', label: 'Slytherin House' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'spellbook', label: 'The Spellbook' },
    { id: 'wizards', label: 'Our Wizards' },
    { id: 'register', label: 'Acceptance Letter' }
  ];

  const handleNavClick = (id: string) => {
    sound.playGoldClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#00140F]/90 backdrop-blur-md border-b border-[#C9A44C]/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Crest */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 flex items-center justify-center rounded-full border border-[#C9A44C] bg-[#001C16] shadow-emerald-glow group-hover:border-[#E6C66F] group-hover:scale-105 transition-all">
              <Shield className="w-6 h-6 text-[#E6C66F] group-hover:text-[#F9DF88] transition-colors" />
              <div className="absolute inset-0 rounded-full bg-[#08734B]/20 animate-pulse pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xs tracking-[0.25em] text-[#C6C9C8] group-hover:text-[#E6C66F] transition-colors">
                HOGWARTS 2026
              </span>
              <span className="font-cinzel-dec text-base font-bold tracking-widest text-gold-gradient">
                SLYTHERIN OLYMPIA
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => sound.playWandSparkle()}
                  className={`relative px-3 py-2 font-cinzel text-xs tracking-wider transition-all duration-200 group ${
                    isActive
                      ? 'text-[#F9DF88] font-bold text-shadow-gold'
                      : 'text-[#D9C99F]/80 hover:text-[#E6C66F]'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Ornate Golden Underline Hover Effect */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#E6C66F] to-transparent transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}

            {/* Admin Key Icon */}
            <button
              onClick={() => {
                sound.playGoldClick();
                onOpenAdmin();
              }}
              title="Admin Chamber Portal"
              className="ml-3 p-2 rounded border border-[#C9A44C]/40 hover:border-[#E6C66F] text-[#C9A44C] hover:text-[#F9DF88] hover:bg-[#08734B]/20 transition-all"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center space-x-3">
            <button
              onClick={() => {
                sound.playGoldClick();
                onOpenAdmin();
              }}
              className="p-2 text-[#C9A44C] border border-[#C9A44C]/40 rounded hover:border-[#E6C66F]"
              title="Admin Portal"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playGoldClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 rounded text-[#E6C66F] hover:text-[#F9DF88] border border-[#C9A44C]/30 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#001C16]/98 border-b-2 border-[#C9A44C] px-5 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-fadeIn">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left py-2.5 px-3 rounded font-cinzel text-sm tracking-widest border transition-all ${
                activeSection === item.id
                  ? 'border-[#C9A44C] bg-[#08734B]/30 text-[#F9DF88] font-bold'
                  : 'border-transparent text-[#D9C99F] hover:border-[#C9A44C]/40 hover:bg-[#003B2D]/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
