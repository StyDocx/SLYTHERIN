import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter }) => {
  const [scene, setScene] = useState<1 | 2 | 3 | 4>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    // Scene 1 -> Scene 2 (3.5s)
    const timer1 = setTimeout(() => {
      setScene(2);
      sound.playThunder();
    }, 3200);

    // Scene 2 -> Scene 3 (7.5s)
    const timer2 = setTimeout(() => {
      setScene(3);
      sound.playWandSparkle();
    }, 7200);

    // Scene 3 -> Scene 4 (11.5s)
    const timer3 = setTimeout(() => {
      setScene(4);
    }, 11200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleStartAudio = () => {
    sound.init();
    sound.startCastleAmbience('castle');
    setAudioStarted(true);
  };

  const handleEnterCastle = () => {
    sound.init();
    sound.playSpellCast();
    sound.playDoorOpen();
    setIsTransitioning(true);

    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  const handleSkip = () => {
    sound.init();
    sound.playWandSparkle();
    onEnter();
  };

  return (
    <div
      onClick={!audioStarted ? handleStartAudio : undefined}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#00140F] overflow-hidden transition-opacity duration-1000 ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-8 z-30 font-cinzel text-xs tracking-widest text-[#C9A44C] hover:text-[#F9DF88] border border-[#C9A44C]/40 hover:border-[#E6C66F] px-4 py-2 rounded uppercase backdrop-blur-md bg-black/40 transition-all flex items-center space-x-1.5"
      >
        <span>Skip Journey</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Atmospheric Audio Prompt Banner (if not yet interacted) */}
      {!audioStarted && (
        <div className="absolute top-6 left-8 z-30 font-cinzel text-[11px] tracking-wider text-[#E6C66F]/80 flex items-center space-x-2 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Click anywhere to summon the castle audio</span>
        </div>
      )}

      {/* Volumetric Green Fog & Particle Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 bg-radial-vignette transition-opacity duration-1000 ${
            scene >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#08734B]/30 via-transparent to-black transition-opacity duration-1000 ${
            scene >= 2 ? 'opacity-90' : 'opacity-30'
          }`}
        />
      </div>

      {/* Flying Owl Silhouettes in Scene 2 & 3 */}
      {scene >= 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute w-8 h-8 text-black/60 animate-[float_12s_linear_infinite] top-[18%] left-[-5%]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 4 6 4 10C4 14 7 17 9 19C10 20 11 22 12 22C13 22 14 20 15 19C17 17 20 14 20 10C20 6 16 2 12 2ZM8 10C7.45 10 7 9.55 7 9C7 8.45 7.45 8 8 8C8.55 8 9 8.45 9 9C9 9.55 8.55 10 8 10ZM16 10C15.45 10 15 9.55 15 9C15 8.45 15.45 8 16 8C16.55 8 17 8.45 17 9C17 9.55 16.55 10 16 10Z"/>
          </svg>
        </div>
      )}

      {/* SCENE CONTENT CONTAINER */}
      <div className="relative z-20 max-w-4xl px-6 text-center flex flex-col items-center">

        {/* SCENE 1: The Darkness & Green Sparks Awakening */}
        {scene === 1 && (
          <div className="space-y-6 animate-pulse">
            <div className="w-16 h-16 mx-auto rounded-full border border-[#08734B]/40 flex items-center justify-center shadow-emerald-glow">
              <div className="w-4 h-4 rounded-full bg-[#10B981] animate-ping" />
            </div>
            <p className="font-cinzel text-sm tracking-[0.35em] text-[#A7F3D0]/70 uppercase">
              The ancient wards begin to stir...
            </p>
          </div>
        )}

        {/* SCENE 2: Castle Emergence & Lightning */}
        {scene === 2 && (
          <div className="space-y-6 transition-all duration-1000 transform">
            <div className="relative inline-block">
              {/* Silhouette Castle Icon Representation */}
              <div className="w-24 h-24 mx-auto text-[#C9A44C] animate-pulse drop-shadow-[0_0_25px_rgba(8,115,75,0.8)]">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 90 L15 50 L25 40 L25 90 M25 50 L35 40 L35 90 M35 45 L50 25 L65 45 L65 90 M65 50 L75 40 L75 90 M75 50 L85 40 L85 90" />
                  <path d="M47 30 L47 15 L53 15 L53 30" stroke="#F9DF88" />
                  <circle cx="50" cy="55" r="5" fill="#E6C66F" />
                  <rect x="20" y="65" width="4" height="6" fill="#F9DF88" />
                  <rect x="76" y="65" width="4" height="6" fill="#F9DF88" />
                </svg>
              </div>
            </div>
            <h2 className="font-cinzel-dec text-2xl md:text-4xl text-gold-gradient tracking-widest uppercase">
              The Fortress of Salazar Awakens
            </h2>
            <p className="font-cormorant italic text-lg md:text-xl text-[#C6C9C8]">
              Where ancient magic converges with peerless intellect...
            </p>
          </div>
        )}

        {/* SCENE 3 & 4: Metallic Slytherin Crest & Enter CTA */}
        {scene >= 3 && (
          <div className="space-y-8 transition-all duration-1000 transform">
            {/* The Slytherin Serpent Crest */}
            <div className="relative mx-auto w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
              {/* Ambient Green Aura */}
              <div className="absolute inset-0 rounded-full bg-[#08734B]/40 blur-2xl animate-pulse" />

              {/* Ornate Gold Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#C9A44C] shadow-gold-glow animate-[spin_24s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-[#08734B] border-dashed animate-[spin_35s_linear_infinite_reverse]" />

              {/* Serpent Crest SVG */}
              <div className="relative z-10 w-28 h-28 md:w-32 md:h-32 text-[#E6C66F] drop-shadow-[0_0_20px_rgba(230,198,111,0.6)]">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  {/* Outer Shield */}
                  <path
                    d="M50 5 L88 20 L88 60 C88 80 50 95 50 95 C50 95 12 80 12 60 L12 20 Z"
                    fill="#001C16"
                    stroke="#C9A44C"
                    strokeWidth="3.5"
                  />
                  {/* Coiled Serpent */}
                  <path
                    d="M52 24 C44 24 38 29 40 36 C42 43 58 45 60 54 C62 63 52 70 42 68 C35 66 34 58 34 58"
                    stroke="#E6C66F"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Serpent Head & Eye */}
                  <path d="M52 24 L56 22 L55 26 Z" fill="#F9DF88" />
                  <circle cx="53" cy="24" r="1.5" fill="#08734B" />
                  {/* Emerald Star */}
                  <circle cx="50" cy="80" r="3" fill="#10B981" />
                </svg>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <span className="font-cinzel text-xs md:text-sm tracking-[0.4em] text-[#C6C9C8] uppercase">
                Inter-College Grand Wizarding Symposium
              </span>
              <h1 className="font-cinzel-dec text-4xl md:text-7xl font-bold tracking-widest text-gold-gradient">
                SLYTHERIN
              </h1>
              <div className="font-cinzel text-2xl md:text-4xl tracking-[0.25em] text-[#A7F3D0]">
                OLYMPIA 2026
              </div>
              <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent my-3" />
              <p className="font-cinzel italic text-base md:text-lg tracking-widest text-[#E6C66F]">
                "AMBITION HAS NO LIMITS."
              </p>
            </div>

            {/* Scene 4: Enter The Castle Button */}
            {scene === 4 && (
              <div className="pt-4 transition-all duration-700">
                <button
                  onClick={handleEnterCastle}
                  className="group relative inline-flex items-center space-x-3 px-9 py-4 rounded-md font-cinzel text-base tracking-[0.2em] font-bold text-[#090D0B] bg-gradient-to-r from-[#C9A44C] via-[#F9DF88] to-[#C9A44C] border-2 border-[#FFF0B8] shadow-gold-glow hover:scale-105 hover:shadow-[0_0_35px_rgba(230,198,111,0.8)] transition-all duration-300 uppercase"
                >
                  <Shield className="w-5 h-5 text-[#001C16] group-hover:rotate-12 transition-transform" />
                  <span>ENTER THE CASTLE</span>
                  <Sparkles className="w-5 h-5 text-[#001C16] animate-pulse" />
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
