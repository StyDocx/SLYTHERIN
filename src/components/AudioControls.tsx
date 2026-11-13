import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Sliders, X } from 'lucide-react';
import { sound } from '../audio/soundEngine';

export const AudioControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [musicOn, setMusicOn] = useState(sound.getMusicEnabled());
  const [sfxOn, setSfxOn] = useState(sound.getSfxEnabled());
  const [volume, setVolume] = useState(sound.getVolume());
  const [activeTheme, setActiveTheme] = useState<'castle' | 'underwater' | 'hall'>('castle');

  useEffect(() => {
    // Sync with sound engine
    setIsMuted(sound.getIsMuted());
    setMusicOn(sound.getMusicEnabled());
    setSfxOn(sound.getSfxEnabled());
    setVolume(sound.getVolume());
  }, []);

  const handleToggleMute = () => {
    const state = sound.toggleMute();
    setIsMuted(state);
    sound.playGoldClick();
  };

  const handleToggleMusic = () => {
    const state = sound.toggleMusic();
    setMusicOn(state);
    if (state) {
      sound.startCastleAmbience(activeTheme);
    } else {
      sound.stopAmbience();
    }
    sound.playGoldClick();
  };

  const handleToggleSfx = () => {
    const state = sound.toggleSfx();
    setSfxOn(state);
    sound.playGoldClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  const switchTheme = (theme: 'castle' | 'underwater' | 'hall') => {
    setActiveTheme(theme);
    sound.playWandSparkle();
    if (musicOn && !isMuted) {
      sound.startCastleAmbience(theme);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Crystal Orb Trigger */}
      <button
        onClick={() => {
          sound.init();
          sound.playGoldClick();
          setIsOpen(!isOpen);
        }}
        title="Enchanted Sound Sanctuary"
        className="group relative flex items-center justify-center w-13 h-13 p-3 rounded-full bg-[#001C16]/90 border-2 border-[#C9A44C] shadow-gold-glow hover:border-[#E6C66F] hover:scale-105 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-[#08734B]/20 animate-pulse pointer-events-none" />
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-[#8C6F2D] group-hover:text-[#C9A44C]" />
        ) : (
          <Volume2 className="w-5 h-5 text-[#E6C66F] animate-pulse" />
        )}
      </button>

      {/* Expanded Audio Sanctuary Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 p-5 rounded-lg bg-[#001C16]/95 border-2 border-[#C9A44C] shadow-2xl backdrop-blur-md text-[#D9C99F] z-50">
          <div className="corner-ornament corner-tl" />
          <div className="corner-ornament corner-tr" />
          <div className="corner-ornament corner-bl" />
          <div className="corner-ornament corner-br" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#C9A44C]/30 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#E6C66F]" />
              <h4 className="font-cinzel text-sm font-bold tracking-wider text-gold-gradient">
                AUDIO SANCTUARY
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8C6F2D] hover:text-[#E6C66F] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Master Volume Slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs font-cinzel mb-1 text-[#E6C66F]">
              <span>Master Harmony</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-[#C9A44C] cursor-pointer"
            />
          </div>

          {/* Toggle Switches */}
          <div className="space-y-2 mb-4 text-xs font-cinzel">
            <button
              onClick={handleToggleMute}
              className={`w-full flex items-center justify-between p-2 rounded border transition-colors ${
                isMuted
                  ? 'border-red-900/60 bg-red-950/20 text-red-300'
                  : 'border-[#08734B]/60 bg-[#003B2D]/40 text-[#D9C99F]'
              }`}
            >
              <span>Total Silence (Mute)</span>
              <span>{isMuted ? 'SILENCED' : 'ACTIVE'}</span>
            </button>

            <button
              onClick={handleToggleMusic}
              className={`w-full flex items-center justify-between p-2 rounded border transition-colors ${
                musicOn
                  ? 'border-[#C9A44C]/60 bg-[#C9A44C]/10 text-[#E6C66F]'
                  : 'border-zinc-800 bg-black/40 text-zinc-500'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Music className="w-3.5 h-3.5" />
                <span>Atmospheric Ambience</span>
              </span>
              <span>{musicOn ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={handleToggleSfx}
              className={`w-full flex items-center justify-between p-2 rounded border transition-colors ${
                sfxOn
                  ? 'border-[#08734B]/60 bg-[#08734B]/15 text-[#34D399]'
                  : 'border-zinc-800 bg-black/40 text-zinc-500'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Magical Spell SFX</span>
              </span>
              <span>{sfxOn ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Ambient Tone Realm Selector */}
          <div className="border-t border-[#C9A44C]/30 pt-3">
            <div className="text-[11px] font-cinzel tracking-wider text-[#C9A44C] mb-2 uppercase">
              Castle Resonance
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-cinzel">
              <button
                onClick={() => switchTheme('castle')}
                className={`py-1.5 px-1 text-center rounded border transition-all ${
                  activeTheme === 'castle'
                    ? 'border-[#E6C66F] bg-[#08734B]/40 text-[#E6C66F] font-bold'
                    : 'border-[#003B2D] hover:border-[#C9A44C]/50 text-zinc-400'
                }`}
              >
                Towers
              </button>
              <button
                onClick={() => switchTheme('underwater')}
                className={`py-1.5 px-1 text-center rounded border transition-all ${
                  activeTheme === 'underwater'
                    ? 'border-[#E6C66F] bg-[#08734B]/40 text-[#E6C66F] font-bold'
                    : 'border-[#003B2D] hover:border-[#C9A44C]/50 text-zinc-400'
                }`}
              >
                Dungeons
              </button>
              <button
                onClick={() => switchTheme('hall')}
                className={`py-1.5 px-1 text-center rounded border transition-all ${
                  activeTheme === 'hall'
                    ? 'border-[#E6C66F] bg-[#08734B]/40 text-[#E6C66F] font-bold'
                    : 'border-[#003B2D] hover:border-[#C9A44C]/50 text-zinc-400'
                }`}
              >
                Great Hall
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
