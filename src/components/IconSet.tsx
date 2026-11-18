import React from 'react';

/* ==========================================================================
   NAVIGATION & BUTTON ICONS
   ========================================================================== */

export const CompassSparkleIcon: React.FC<{ className?: string }> = ({
  className = 'icon-sparkle',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 1.5 L12.1 7.9 L18.5 10 L12.1 12.1 L10 18.5 L7.9 12.1 L1.5 10 L7.9 7.9 Z"
      fill="var(--champagne-gold)"
      stroke="var(--antique-gold)"
      strokeWidth="0.8"
    />
    <path
      d="M5 5 L15 15 M15 5 L5 15"
      stroke="var(--champagne-gold)"
      strokeWidth="0.9"
      strokeLinecap="round"
    />
    <circle cx="10" cy="10" r="1.6" fill="var(--warm-ivory)" />
  </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({
  className = 'icon-arrow',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M3.5 10 H15.8 M11.2 5.5 L16 10 L11.2 14.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DocumentBrochureIcon: React.FC<{ className?: string }> = ({
  className = 'icon-doc',
}) => (
  <svg className={className} viewBox="0 0 20 22" fill="none" aria-hidden="true">
    <path
      d="M4 2.5 H12.5 L16.5 6.5 V19.5 H4 V2.5 Z"
      fill="rgba(7, 26, 20, 0.08)"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinejoin="round"
    />
    <path
      d="M12 2.5 V7 H16.5"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinejoin="round"
    />
    <line
      x1="7"
      y1="10.5"
      x2="13.5"
      y2="10.5"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="13.5"
      x2="13.5"
      y2="13.5"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="16.5"
      x2="11"
      y2="16.5"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
    />
  </svg>
);

export const DiamondBulletIcon: React.FC<{ className?: string }> = ({
  className = 'tagline-diamond',
}) => (
  <svg className={className} viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <polygon points="5,1 9,5 5,9 1,5" fill="var(--champagne-gold)" />
  </svg>
);

/* ==========================================================================
   HERO SERPENT DIVIDER ORNAMENT (Below Motto, Above CTAs)
   ========================================================================== */

export const HeroSerpentDivider: React.FC<{ className?: string }> = ({
  className = 'hero-serpent-divider',
}) => (
  <svg
    className={className}
    viewBox="0 0 260 36"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="divGoldGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(198, 161, 91, 0)" />
        <stop offset="25%" stopColor="#C6A15B" />
        <stop offset="50%" stopColor="#F5EBD5" />
        <stop offset="75%" stopColor="#C6A15B" />
        <stop offset="100%" stopColor="rgba(198, 161, 91, 0)" />
      </linearGradient>
      <linearGradient id="serpentBodyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5EBD5" />
        <stop offset="50%" stopColor="#E5CC91" />
        <stop offset="100%" stopColor="#9B7838" />
      </linearGradient>
    </defs>

    {/* Left & Right Tapering Gold Lines */}
    <line x1="6" y1="18" x2="96" y2="18" stroke="url(#divGoldGrad)" strokeWidth="1.2" />
    <line x1="164" y1="18" x2="254" y2="18" stroke="url(#divGoldGrad)" strokeWidth="1.2" />

    {/* Left & Right Scroll Flourishes */}
    <path
      d="M96 18 C101 18 104 14 107 14 C110 14 111 17 109 19 C107 21 103 19 101 18"
      stroke="#E5CC91"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M164 18 C159 18 156 14 153 14 C150 14 149 17 151 19 C153 21 157 19 159 18"
      stroke="#E5CC91"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <polygon points="84,18 87,15.5 90,18 87,20.5" fill="#E5CC91" />
    <polygon points="170,18 173,15.5 176,18 173,20.5" fill="#E5CC91" />

    {/* Center Coiled Golden Serpent ('S') */}
    <path
      d="M124 10 C127 6.5 134 6.5 135.5 10.5 C137 14.5 123 17.5 123.5 23.5 C124 28.5 132.5 29.5 136 25.5 C137.5 23.8 136.5 20.8 133.5 21 C131 21.2 130.5 23.5 132 24.5"
      stroke="url(#serpentBodyGrad)"
      strokeWidth="3.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Serpent Head & Forked Tongue */}
    <circle cx="124.2" cy="9.8" r="1.8" fill="#F5EBD5" />
    <path d="M122.5 10.2 L119.5 11.2 M121 10.7 L119.8 9.5" stroke="#E5CC91" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

/* ==========================================================================
   FEATURE CARD ICONS (Champagne & Antique Gold 3D-Styled Vector Emblems)
   ========================================================================== */

export const LaurelTrophyCardIcon: React.FC<{ className?: string }> = ({
  className = 'card-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 64 50" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="cardGold1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5EBD5" />
        <stop offset="45%" stopColor="#E5CC91" />
        <stop offset="85%" stopColor="#C6A15B" />
        <stop offset="100%" stopColor="#8C6D32" />
      </linearGradient>
    </defs>
    {/* Left Laurel Wreath */}
    <path
      d="M18 39 C10 32 9 19 16 10"
      stroke="url(#cardGold1)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <ellipse cx="11.5" cy="29" rx="3.2" ry="1.6" transform="rotate(-35 11.5 29)" fill="url(#cardGold1)" />
    <ellipse cx="10.5" cy="22.5" rx="3.2" ry="1.6" transform="rotate(-15 10.5 22.5)" fill="url(#cardGold1)" />
    <ellipse cx="12.2" cy="16" rx="3.2" ry="1.6" transform="rotate(10 12.2 16)" fill="url(#cardGold1)" />
    <ellipse cx="15.5" cy="10.8" rx="3" ry="1.5" transform="rotate(30 15.5 10.8)" fill="url(#cardGold1)" />
    <ellipse cx="15" cy="33.5" rx="3" ry="1.5" transform="rotate(-50 15 33.5)" fill="url(#cardGold1)" />

    {/* Right Laurel Wreath */}
    <path
      d="M46 39 C54 32 55 19 48 10"
      stroke="url(#cardGold1)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <ellipse cx="52.5" cy="29" rx="3.2" ry="1.6" transform="rotate(35 52.5 29)" fill="url(#cardGold1)" />
    <ellipse cx="53.5" cy="22.5" rx="3.2" ry="1.6" transform="rotate(15 53.5 22.5)" fill="url(#cardGold1)" />
    <ellipse cx="51.8" cy="16" rx="3.2" ry="1.6" transform="rotate(-10 51.8 16)" fill="url(#cardGold1)" />
    <ellipse cx="48.5" cy="10.8" rx="3" ry="1.5" transform="rotate(-30 48.5 10.8)" fill="url(#cardGold1)" />
    <ellipse cx="49" cy="33.5" rx="3" ry="1.5" transform="rotate(50 49 33.5)" fill="url(#cardGold1)" />

    {/* Trophy Handles */}
    <path d="M23.5 14 C18.5 14 18.5 23 24.5 24.5" stroke="url(#cardGold1)" strokeWidth="1.7" />
    <path d="M40.5 14 C45.5 14 45.5 23 39.5 24.5" stroke="url(#cardGold1)" strokeWidth="1.7" />

    {/* Trophy Cup */}
    <path
      d="M23 10.5 H41 L38.6 25 C37.8 30.2 32 32 32 32 C32 32 26.2 30.2 25.4 25 Z"
      fill="url(#cardGold1)"
    />
    {/* Star Cutout */}
    <polygon
      points="32,14.5 33.3,18 37,18 34,20.2 35.1,23.8 32,21.6 28.9,23.8 30,20.2 27,18 30.7,18"
      fill="#05231B"
    />
    {/* Stem & Base */}
    <rect x="30.2" y="32" width="3.6" height="5.5" fill="url(#cardGold1)" />
    <rect x="24.5" y="37.5" width="15" height="3.2" rx="1" fill="url(#cardGold1)" />
  </svg>
);

export const TeamGroupCardIcon: React.FC<{ className?: string }> = ({
  className = 'card-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 64 50" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="cardGold2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5EBD5" />
        <stop offset="50%" stopColor="#E5CC91" />
        <stop offset="90%" stopColor="#C6A15B" />
        <stop offset="100%" stopColor="#8C6D32" />
      </linearGradient>
    </defs>
    {/* Left Member */}
    <circle cx="18" cy="20" r="4.5" fill="url(#cardGold2)" />
    <path
      d="M9.5 37.5 C9.5 30.5 13.5 27.5 18 27.5 C21.5 27.5 24 29 25 32.2"
      fill="url(#cardGold2)"
      opacity="0.85"
    />
    {/* Right Member */}
    <circle cx="46" cy="20" r="4.5" fill="url(#cardGold2)" />
    <path
      d="M54.5 37.5 C54.5 30.5 50.5 27.5 46 27.5 C42.5 27.5 40 29 39 32.2"
      fill="url(#cardGold2)"
      opacity="0.85"
    />
    {/* Center Squad Leader */}
    <circle cx="32" cy="16" r="5.8" fill="url(#cardGold2)" />
    <path
      d="M19.5 39.5 C19.5 29.8 24.8 25 32 25 C39.2 25 44.5 29.8 44.5 39.5 Z"
      fill="url(#cardGold2)"
    />
  </svg>
);

export const StarTrophyCardIcon: React.FC<{ className?: string }> = ({
  className = 'card-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 64 50" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="cardGold3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5EBD5" />
        <stop offset="48%" stopColor="#E5CC91" />
        <stop offset="88%" stopColor="#C6A15B" />
        <stop offset="100%" stopColor="#8C6D32" />
      </linearGradient>
    </defs>
    {/* Ornate Handles */}
    <path
      d="M22 12.5 H16.5 C16.5 21 20 25 24.5 25.8 M42 12.5 H47.5 C47.5 21 44 25 39.5 25.8"
      stroke="url(#cardGold3)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Cup Body */}
    <path
      d="M21.5 9.5 H42.5 L39.8 25.5 C38.8 31 32 33 32 33 C32 33 25.2 31 24.2 25.5 Z"
      fill="url(#cardGold3)"
    />
    {/* Center Star Cutout */}
    <polygon
      points="32,13.5 33.5,17.5 37.8,17.5 34.3,20 35.6,24 32,21.5 28.4,24 29.7,20 26.2,17.5 30.5,17.5"
      fill="#05231B"
    />
    {/* Pedestal */}
    <rect x="29.8" y="33" width="4.4" height="6" fill="url(#cardGold3)" />
    <path d="M23 39 H41 L42.5 42.5 H21.5 Z" fill="url(#cardGold3)" />
  </svg>
);

export const ScrollQuillCardIcon: React.FC<{ className?: string }> = ({
  className = 'card-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 64 50" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="cardGold4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F5EBD5" />
        <stop offset="50%" stopColor="#E5CC91" />
        <stop offset="90%" stopColor="#C6A15B" />
        <stop offset="100%" stopColor="#8C6D32" />
      </linearGradient>
    </defs>
    {/* Unfurled Golden Parchment Scroll */}
    <path
      d="M21 8.5 H42 C44.2 8.5 45.2 10.5 44.2 13.2 L40.2 35.5 C39.2 38.5 37.5 40 34.5 40 H17.5 C15.2 40 14.5 37.5 15.5 34.8 L19.2 12 C19.7 9.8 20.2 8.5 21 8.5 Z"
      fill="url(#cardGold4)"
    />
    {/* Top Roll Hollow */}
    <ellipse cx="42.5" cy="11.2" rx="2.5" ry="3" fill="#05231B" stroke="url(#cardGold4)" strokeWidth="1.5" />
    {/* Bottom Roll Curl */}
    <path
      d="M15 36.2 C15 39.2 17.5 41.2 20.5 41.2 H36.5 C39.2 41.2 40.5 38.5 39.5 36 H16.5 Z"
      fill="#8C6D32"
      stroke="url(#cardGold4)"
      strokeWidth="1.2"
    />
    {/* Inscribed Dark Rules Lines */}
    <line x1="23.5" y1="16.5" x2="36.5" y2="16.5" stroke="#05231B" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="22.5" y1="22" x2="35.5" y2="22" stroke="#05231B" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="21.5" y1="27.5" x2="32.5" y2="27.5" stroke="#05231B" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="20.5" y1="32.5" x2="28.5" y2="32.5" stroke="#05231B" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const CardCircleArrowIcon: React.FC<{ className?: string }> = ({
  className = 'feature-card__arrow-svg',
}) => (
  <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle
      cx="14"
      cy="14"
      r="12.5"
      fill="rgba(5, 34, 25, 0.65)"
      stroke="var(--antique-gold)"
      strokeWidth="1.15"
    />
    <path
      d="M9.5 14 H18.2 M14.8 10.5 L18.5 14 L14.8 17.5"
      stroke="var(--champagne-gold)"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ==========================================================================
   FOOTER SOCIAL ICONS & SERPENT EMBLEM
   ========================================================================== */

export const FooterSerpentEmblem: React.FC<{ className?: string }> = ({
  className = 'footer-serpent-svg',
}) => (
  <svg className={className} viewBox="0 0 36 32" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="footerSerpGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5EBD5" />
        <stop offset="50%" stopColor="#E5CC91" />
        <stop offset="100%" stopColor="#9B7838" />
      </linearGradient>
    </defs>
    <path
      d="M14 6.5 C17 3 23.5 3.5 24.5 7.5 C25.5 11.5 12 14.5 12.5 21 C13 26.5 21.5 27.5 25 23.5 C26.8 21.5 25.5 18 22.2 18.2 C19.5 18.5 19 21 20.8 22.2"
      stroke="url(#footerSerpGrad)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="14.2" cy="6.2" r="1.9" fill="#F5EBD5" />
    <path d="M12.2 6.8 L9 7.8 M10.6 7.3 L9.4 6" stroke="#E5CC91" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const DiscordSocialIcon: React.FC<{ className?: string }> = ({
  className = 'social-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M18.9 6.2 C17.6 5.6 16.2 5.2 14.7 5 C14.5 5.4 14.3 5.8 14.1 6.2 C12.7 6 11.3 6 9.9 6.2 C9.7 5.8 9.5 5.4 9.3 5 C7.8 5.2 6.4 5.6 5.1 6.2 C2.5 10.1 1.8 13.9 2.1 17.6 C3.8 18.9 5.5 19.7 7.2 20.2 C7.6 19.6 8 19 8.3 18.3 C7.7 18.1 7.1 17.8 6.5 17.4 C6.7 17.3 6.8 17.1 7 17 C10.2 18.5 13.8 18.5 17 17 C17.2 17.1 17.3 17.3 17.5 17.4 C16.9 17.8 16.3 18.1 15.7 18.3 C16 19 16.4 19.6 16.8 20.2 C18.5 19.7 20.2 18.9 21.9 17.6 C22.3 13.3 21.2 9.5 18.9 6.2 Z M8.8 15.2 C7.8 15.2 7 14.3 7 13.2 C7 12.1 7.8 11.2 8.8 11.2 C9.8 11.2 10.6 12.1 10.6 13.2 C10.6 14.3 9.8 15.2 8.8 15.2 Z M15.2 15.2 C14.2 15.2 13.4 14.3 13.4 13.2 C13.4 12.1 14.2 11.2 15.2 11.2 C16.2 11.2 17 12.1 17 13.2 C17 14.3 16.2 15.2 15.2 15.2 Z"
      fill="currentColor"
    />
  </svg>
);

export const InstagramSocialIcon: React.FC<{ className?: string }> = ({
  className = 'social-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4.5"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="16.8" cy="7.2" r="1.15" fill="currentColor" />
  </svg>
);

export const YouTubeSocialIcon: React.FC<{ className?: string }> = ({
  className = 'social-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="3"
      y="5.5"
      width="18"
      height="13"
      rx="3.6"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <polygon points="10,9 15.5,12 10,15" fill="currentColor" />
  </svg>
);

export const XSocialIcon: React.FC<{ className?: string }> = ({
  className = 'social-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 5 L19 19 M19 5 L5 19"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

/* ==========================================================================
   OFFICIAL REGISTRATION MODAL ICONS (MATCHING LUXURY REFERENCE DESIGN)
   ========================================================================== */

/** Top Center Heraldic Laurel Torch Emblem */
export const LaurelTorchEmblemIcon: React.FC<{ className?: string }> = ({
  className = 'reg-laurel-torch-svg',
}) => (
  <svg className={className} viewBox="0 0 72 64" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="torchGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF2D6" />
        <stop offset="30%" stopColor="#F0D597" />
        <stop offset="70%" stopColor="#C6A15B" />
        <stop offset="100%" stopColor="#7E5F20" />
      </linearGradient>
      <linearGradient id="flameGlow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FFF8E7" />
        <stop offset="50%" stopColor="#F5C042" />
        <stop offset="100%" stopColor="#B37410" />
      </linearGradient>
      <filter id="torchAura" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Central Ornate Shield Background */}
    <path
      d="M26 12 L36 8 L46 12 C46 25 36 34 36 34 C36 34 26 25 26 12 Z"
      fill="rgba(2, 28, 20, 0.85)"
      stroke="url(#torchGold)"
      strokeWidth="1.4"
    />

    {/* Torch Base and Handle */}
    <path
      d="M33 28 L39 28 L37.5 32 L34.5 32 Z"
      fill="url(#torchGold)"
    />
    <path
      d="M32 20 L40 20 L38.5 28 L33.5 28 Z"
      fill="url(#torchGold)"
      stroke="#7E5F20"
      strokeWidth="0.5"
    />
    <ellipse cx="36" cy="20" rx="4.2" ry="1.6" fill="#FFF2D6" />

    {/* Torch Flame with Radiant Glow */}
    <path
      d="M36 9 C38.5 13 41 16 38.5 19 C37.5 17 37 15 36 14 C35 15.5 34.5 17.5 33.5 19 C31 16 33.5 13 36 9 Z"
      fill="url(#flameGlow)"
      filter="url(#torchAura)"
    />

    {/* Left Laurel Branch */}
    <g stroke="url(#torchGold)" strokeWidth="1.1" fill="url(#torchGold)">
      {/* Stem */}
      <path d="M32 46 C24 44 14 36 14 20" fill="none" strokeWidth="1.2" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M14 20 C11 19 8 22 10 24 C12 25 14 22 14 20 Z" />
      <path d="M15 25 C12 25 10 28 12 30 C14 31 16 28 15 25 Z" />
      <path d="M18 31 C15 32 13 35 16 37 C18 38 20 34 18 31 Z" />
      <path d="M22 37 C19 39 18 42 21 44 C23 44 24 41 22 37 Z" />
      <path d="M27 42 C25 45 25 48 28 49 C30 49 30 46 27 42 Z" />
    </g>

    {/* Right Laurel Branch */}
    <g stroke="url(#torchGold)" strokeWidth="1.1" fill="url(#torchGold)">
      {/* Stem */}
      <path d="M40 46 C48 44 58 36 58 20" fill="none" strokeWidth="1.2" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M58 20 C61 19 64 22 62 24 C60 25 58 22 58 20 Z" />
      <path d="M57 25 C60 25 62 28 60 30 C58 31 56 28 57 25 Z" />
      <path d="M54 31 C57 32 59 35 56 37 C54 38 52 34 54 31 Z" />
      <path d="M50 37 C53 39 54 42 51 44 C49 44 48 41 50 37 Z" />
      <path d="M45 42 C47 45 47 48 44 49 C42 49 42 46 45 42 Z" />
    </g>

    {/* Bottom Ribbon / Tie Knot */}
    <path
      d="M36 47 C33 46 31 49 34 52 L36 49 L38 52 C41 49 39 46 36 47 Z"
      fill="url(#torchGold)"
      stroke="url(#torchGold)"
      strokeWidth="0.8"
    />
    <circle cx="36" cy="48" r="1.5" fill="#FFF2D6" />

    {/* Top Star Accent */}
    <polygon
      points="36,2 37.2,5 40.5,5 37.8,7 38.8,10 36,8.2 33.2,10 34.2,7 31.5,5 34.8,5"
      fill="url(#torchGold)"
    />
  </svg>
);

/** Gold Circular Close Button Icon */
export const GoldCloseCircleIcon: React.FC<{ className?: string }> = ({
  className = 'reg-close-circle-svg',
}) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle
      cx="16"
      cy="16"
      r="14.5"
      fill="rgba(5, 25, 19, 0.85)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.2"
    />
    <circle
      cx="16"
      cy="16"
      r="12.5"
      stroke="rgba(198, 161, 91, 0.35)"
      strokeWidth="0.7"
    />
    <path
      d="M11 11 L21 21 M21 11 L11 21"
      stroke="var(--warm-ivory)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/** User / Student Name Icon */
export const UserFieldIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="6.5" r="3.5" fill="var(--champagne-gold)" />
    <path
      d="M4.5 17 C4.5 13.5 7 11.5 10 11.5 C13 11.5 15.5 13.5 15.5 17"
      stroke="var(--champagne-gold)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/** ID Card / Badge Icon */
export const IdCardFieldIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect
      x="2.5"
      y="4.5"
      width="15"
      height="11"
      rx="2"
      stroke="var(--champagne-gold)"
      strokeWidth="1.4"
      fill="rgba(5, 30, 22, 0.4)"
    />
    <rect x="4.8" y="7" width="3.4" height="4" rx="0.8" fill="var(--champagne-gold)" />
    <line x1="10.2" y1="8" x2="15.2" y2="8" stroke="var(--champagne-gold)" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="10.2" y1="11" x2="14" y2="11" stroke="var(--champagne-gold)" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Graduation Cap (Batch) Icon */
export const GradCapFieldIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 3.5 L18 7.5 L10 11.5 L2 7.5 Z"
      fill="var(--champagne-gold)"
      stroke="var(--champagne-gold)"
      strokeWidth="0.8"
    />
    <path
      d="M5.5 10 V14.5 C5.5 16.2 7.5 17.5 10 17.5 C12.5 17.5 14.5 16.2 14.5 14.5 V10"
      stroke="var(--champagne-gold)"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M16 8.5 V14 L17.5 14.5" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Gender Icon (Combined ⚥) */
export const GenderFieldIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9.5" cy="10.5" r="4.2" stroke="var(--champagne-gold)" strokeWidth="1.4" />
    {/* Male Arrow */}
    <path d="M12.5 7.5 L16.5 3.5 M13 3.5 H16.5 V7" stroke="var(--champagne-gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Female Cross */}
    <path d="M9.5 14.7 V18.5 M7.5 16.5 H11.5" stroke="var(--champagne-gold)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** Mars / Male Symbol ♂ */
export const MaleSymbolIcon: React.FC<{ className?: string }> = ({
  className = 'reg-gender-symbol',
}) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="6.5" cy="9.5" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9.5 6.5 L14 2 M10 2 H14 V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Venus / Female Symbol ♀ */
export const FemaleSymbolIcon: React.FC<{ className?: string }> = ({
  className = 'reg-gender-symbol',
}) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 10 V15 M5.5 12.5 H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Phone Number Icon */
export const PhoneFieldIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5 3.5 C4.2 3.5 3.5 4.2 3.5 5 C3.5 11.4 8.6 16.5 15 16.5 C15.8 16.5 16.5 15.8 16.5 15 L14.5 12 C14.1 11.5 13.4 11.4 12.9 11.8 L11.8 12.7 C9.8 11.6 8.4 10.2 7.3 8.2 L8.2 7.1 C8.6 6.6 8.5 5.9 8 5.5 L5 3.5 Z"
      fill="var(--champagne-gold)"
      stroke="var(--champagne-gold)"
      strokeWidth="0.8"
    />
  </svg>
);

/** E-mail ID Icon */
export const MailFieldIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect
      x="2.5"
      y="4.5"
      width="15"
      height="11"
      rx="2"
      stroke="var(--champagne-gold)"
      strokeWidth="1.4"
      fill="rgba(5, 30, 22, 0.4)"
    />
    <path
      d="M3.2 5.5 L10 11 L16.8 5.5"
      stroke="var(--champagne-gold)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Info Circle Icon */
export const InfoCircleIcon: React.FC<{ className?: string }> = ({
  className = 'reg-info-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="var(--champagne-gold)" strokeWidth="1.3" />
    <circle cx="10" cy="6.2" r="1.1" fill="var(--champagne-gold)" />
    <path d="M10 9 V14 M8.5 9 H10" stroke="var(--champagne-gold)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** Theatrical Masks Icon 🎭 */
export const MasksTheaterIcon: React.FC<{ className?: string }> = ({
  className = 'reg-category-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {/* Comedy Mask */}
    <path
      d="M4 4 C10 2 15 5 15 11 C15 16 11 18 8 18 C3 18 2 13 4 4 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <circle cx="7" cy="8.5" r="1.1" fill="currentColor" />
    <circle cx="11.5" cy="8.5" r="1.1" fill="currentColor" />
    <path d="M6.5 12.5 C8 14.5 10.5 14.5 12 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />

    {/* Tragedy Mask Overlay */}
    <path
      d="M14 8 C18 7 21 9 21 15 C21 19 18 21 15 21 C12 21 11 19 12 17"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <circle cx="17.5" cy="12.5" r="1" fill="currentColor" />
    <path d="M15.5 16.5 C16.5 15.5 18 15.5 19 16.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Olympia Trophy Icon 🏆 */
export const TrophyOlympiaIcon: React.FC<{ className?: string }> = ({
  className = 'reg-category-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 4 H17 V10 C17 13.5 14 15.5 12 15.5 C10 15.5 7 13.5 7 10 V4 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path d="M7 6 H4 C3 6 3 9 5 10 C6 10.5 7 10.5 7 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M17 6 H20 C21 6 21 9 19 10 C18 10.5 17 10.5 17 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M12 15.5 V19 M9 21 H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Musical Notes Icon ♫ (Solo Western, Music) */
export const MusicNotesIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <ellipse cx="6" cy="14.5" rx="3" ry="2.2" fill="var(--champagne-gold)" />
    <ellipse cx="14" cy="11.5" rx="3" ry="2.2" fill="var(--champagne-gold)" />
    <path d="M9 14.5 V5.5 L17 2.5 V11.5" stroke="var(--champagne-gold)" strokeWidth="1.5" />
    <path d="M9 7.5 L17 4.5" stroke="var(--champagne-gold)" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/** Electric Guitar Icon 🎸 (Band) */
export const ElectricGuitarIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5.5 9.5 C3 10.5 2 13 3 15.5 C4 18 6.5 18.5 9 17.5 C11.5 16.5 12 14.5 11 12.5 C10.5 11.5 10 11 11.5 9.5 L17 4 L15.5 2.5 L10 8 C8.5 9.5 8 9 7 8.5 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="14" r="1.5" fill="var(--champagne-gold)" />
    <line x1="6" y1="14" x2="16" y2="4" stroke="var(--champagne-gold)" strokeWidth="0.8" />
  </svg>
);

/** Classical Dancer Icon 💃 (Solo Classical, Dance) */
export const ClassicalDancerIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="3.5" r="1.8" fill="var(--champagne-gold)" />
    {/* Graceful Arms and Mudra */}
    <path d="M4 6.5 C6.5 5 8 7 10 7.5 C12 7 13.5 5 16 6.5" stroke="var(--champagne-gold)" strokeWidth="1.3" strokeLinecap="round" />
    {/* Body / Torso */}
    <path d="M10 7.5 V11" stroke="var(--champagne-gold)" strokeWidth="1.4" />
    {/* Flared Dance Skirt / Pose */}
    <path
      d="M7.5 11 L5 16 C8.5 17 11.5 17 15 16 L12.5 11 Z"
      fill="rgba(198, 161, 91, 0.3)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.2"
    />
    <path d="M8.5 16 V19 M11.5 16 V18.5" stroke="var(--champagne-gold)" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Duet Dancers Icon 💃🕺 (Duet Dancing) */
export const DuetDancerIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Left Dancer */}
    <circle cx="6.5" cy="4" r="1.5" fill="var(--champagne-gold)" />
    <path d="M3.5 6.5 C5 5.5 6.5 6.5 7.5 7" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6.5 7 V11" stroke="var(--champagne-gold)" strokeWidth="1.3" />
    <path d="M4.5 11 L3 16 C5.5 16.8 7.5 16.8 9.5 16 L8.5 11 Z" fill="rgba(198, 161, 91, 0.3)" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <path d="M5 16 V18.5 M7.5 16 V18" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />

    {/* Hand Clasp / Arch between dancers */}
    <path d="M7.5 7 C9.5 6.2 10.5 6.2 12.5 7" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />

    {/* Right Dancer */}
    <circle cx="13.5" cy="4" r="1.5" fill="var(--champagne-gold)" />
    <path d="M12.5 7 V11" stroke="var(--champagne-gold)" strokeWidth="1.3" />
    <path d="M16.5 6.5 C15 5.5 13.5 6.5 12.5 7" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11.5 11 L10.5 16 C12.5 16.8 14.5 16.8 17 16 L15.5 11 Z" fill="rgba(198, 161, 91, 0.3)" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <path d="M12.5 16 V18 M15 16 V18.5" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Drums / Percussion Icon 🥁 (Solo Instrumental) */
export const DrumsIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <ellipse cx="10" cy="7" rx="7" ry="2.6" fill="rgba(198, 161, 91, 0.3)" stroke="var(--champagne-gold)" strokeWidth="1.3" />
    <path d="M3 7 V12.5 C3 14 6 15.5 10 15.5 C14 15.5 17 14 17 12.5 V7" stroke="var(--champagne-gold)" strokeWidth="1.3" />
    {/* Tension Struts */}
    <line x1="5.5" y1="8.5" x2="7.5" y2="14.5" stroke="var(--champagne-gold)" strokeWidth="1" />
    <line x1="10" y1="9.5" x2="10" y2="15.5" stroke="var(--champagne-gold)" strokeWidth="1" />
    <line x1="14.5" y1="8.5" x2="12.5" y2="14.5" stroke="var(--champagne-gold)" strokeWidth="1" />
    {/* Drumsticks */}
    <line x1="4" y1="2" x2="9" y2="6.5" stroke="var(--warm-ivory)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="16" y1="2" x2="11" y2="6.5" stroke="var(--warm-ivory)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Duet Microphones Icon 🎙️🎙️ (Duet) */
export const DuetMicrophonesIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Left Mic */}
    <g transform="translate(-1, 0)">
      <rect x="5.5" y="4" width="3.2" height="6.2" rx="1.6" fill="var(--champagne-gold)" />
      <path d="M4.5 7.5 C4.5 9.8 6 11.5 7.1 11.5 C8.2 11.5 9.7 9.8 9.7 7.5" stroke="var(--champagne-gold)" strokeWidth="1.1" fill="none" />
      <line x1="7.1" y1="11.5" x2="7.1" y2="15.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
      <line x1="5.2" y1="15.5" x2="9" y2="15.5" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
    {/* Right Mic */}
    <g transform="translate(5.5, 0)">
      <rect x="5.5" y="4" width="3.2" height="6.2" rx="1.6" fill="var(--champagne-gold)" />
      <path d="M4.5 7.5 C4.5 9.8 6 11.5 7.1 11.5 C8.2 11.5 9.7 9.8 9.7 7.5" stroke="var(--champagne-gold)" strokeWidth="1.1" fill="none" />
      <line x1="7.1" y1="11.5" x2="7.1" y2="15.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
      <line x1="5.2" y1="15.5" x2="9" y2="15.5" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

/** Solo Singing / Microphone Icon 🎤 */
export const MicrophoneIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="7.5" y="3.5" width="5" height="8.5" rx="2.5" fill="var(--champagne-gold)" />
    <path d="M5.5 8 C5.5 11.2 7.5 13.5 10 13.5 C12.5 13.5 14.5 11.2 14.5 8" stroke="var(--champagne-gold)" strokeWidth="1.3" fill="none" />
    <line x1="10" y1="13.5" x2="10" y2="17" stroke="var(--champagne-gold)" strokeWidth="1.4" />
    <line x1="7" y1="17" x2="13" y2="17" stroke="var(--champagne-gold)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Quill & Scroll Icon 📜 (Literary, Essay, Poetry) */
export const QuillScrollEventIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4 4.5 H13 C14.5 4.5 15.5 5.5 15 7 L13.5 14 C13 15.5 11.8 16 10.5 16 H3.5 C2 16 1.8 14.5 2.5 13 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.2"
    />
    <path d="M12 2 C16 4 17 8 15 13 L12 15 L12.5 12" stroke="var(--champagne-gold)" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="5.5" y1="8" x2="11" y2="8" stroke="var(--champagne-gold)" strokeWidth="1" strokeLinecap="round" />
    <line x1="5" y1="11" x2="10.5" y2="11" stroke="var(--champagne-gold)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/** Palette & Brush Icon 🎨 (Arts, Face Painting, Rangoli) */
export const PaletteEventIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 2.5 C4.8 2.5 2.5 6 2.5 10 C2.5 14.5 6 17.5 10 17.5 C11.5 17.5 12.5 16.5 12.5 15.2 C12.5 14.5 12.2 14 12.2 13.5 C12.2 12.5 13 11.8 14 11.8 H15.5 C17 11.8 18 10.2 17.5 8.2 C16.5 4.5 13.5 2.5 10 2.5 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
    />
    <circle cx="6.5" cy="7.5" r="1.1" fill="var(--champagne-gold)" />
    <circle cx="9.5" cy="5.8" r="1.1" fill="var(--champagne-gold)" />
    <circle cx="13" cy="7.5" r="1.1" fill="var(--champagne-gold)" />
    <circle cx="7.5" cy="12" r="1.1" fill="var(--champagne-gold)" />
  </svg>
);

/** Camera Icon 📷 (Photography, Short Film) */
export const CameraEventIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M3 6.5 H6.5 L7.8 4.5 H12.2 L13.5 6.5 H17 C17.8 6.5 18.5 7.2 18.5 8 V15 C18.5 15.8 17.8 16.5 17 16.5 H3 C2.2 16.5 1.5 15.8 1.5 15 V8 C1.5 7.2 2.2 6.5 3 6.5 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
    />
    <circle cx="10" cy="11.5" r="3.2" stroke="var(--champagne-gold)" strokeWidth="1.3" />
    <circle cx="10" cy="11.5" r="1.2" fill="var(--champagne-gold)" />
  </svg>
);

/** Gamepad Icon 🎮 (Gaming: PUBG, COD) */
export const GamepadEventIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5 5.5 H15 C17 5.5 18.5 7.5 18 10.5 L17 14.5 C16.5 16 15 16.5 13.5 15 L12 13.5 H8 L6.5 15 C5 16.5 3.5 16 3 14.5 L2 10.5 C1.5 7.5 3 5.5 5 5.5 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
    />
    <path d="M6 8 V11 M4.5 9.5 H7.5" stroke="var(--champagne-gold)" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="13.5" cy="9" r="0.8" fill="var(--champagne-gold)" />
    <circle cx="15.2" cy="10.5" r="0.8" fill="var(--champagne-gold)" />
  </svg>
);

/** Chef Hat Icon 👨‍🍳 (Cooking, Eatathon) */
export const ChefHatEventIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M4.5 10 C3 9 3 6.5 5 5.5 C5.5 3.5 8 3 10 3.5 C12 3 14.5 3.5 15 5.5 C17 6.5 17 9 15.5 10 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
    />
    <rect x="4.5" y="10" width="11" height="5.5" stroke="var(--champagne-gold)" strokeWidth="1.3" fill="rgba(5, 25, 18, 0.5)" />
    <line x1="4.5" y1="13" x2="15.5" y2="13" stroke="var(--champagne-gold)" strokeWidth="0.9" />
  </svg>
);

/** Soccer / Football Icon ⚽ */
export const SportsSoccerIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" stroke="var(--champagne-gold)" strokeWidth="1.4" />
    <polygon points="10,6.5 12.8,8.5 11.7,11.8 8.3,11.8 7.2,8.5" fill="var(--champagne-gold)" />
    <line x1="10" y1="6.5" x2="10" y2="2.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <line x1="12.8" y1="8.5" x2="16.5" y2="7.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <line x1="11.7" y1="11.8" x2="14.5" y2="15.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <line x1="8.3" y1="11.8" x2="5.5" y2="15.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <line x1="7.2" y1="8.5" x2="3.5" y2="7.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
  </svg>
);

/** Cricket Icon 🏏 */
export const SportsCricketIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Crossed Bat */}
    <path d="M4 16 L12 8 L14 10 L6 18 Z" fill="rgba(198, 161, 91, 0.3)" stroke="var(--champagne-gold)" strokeWidth="1.2" />
    <line x1="13" y1="9" x2="17" y2="5" stroke="var(--warm-ivory)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Ball */}
    <circle cx="15.5" cy="14.5" r="2.2" fill="var(--champagne-gold)" />
    <path d="M14 14.5 C15.5 13.5 16.5 15.5 17 14.5" stroke="#05271F" strokeWidth="0.7" />
  </svg>
);

/** Volleyball Icon 🏐 */
export const SportsVolleyballIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" stroke="var(--champagne-gold)" strokeWidth="1.4" />
    <path d="M10 2.5 C10 6 7 10 2.5 10" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <path d="M17.5 10 C13 10 10 14 10 17.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <path d="M5 16 C8.5 13.5 13.5 8.5 15 4" stroke="var(--champagne-gold)" strokeWidth="1.1" />
  </svg>
);

/** Basketball Icon 🏀 */
export const SportsBasketballIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" stroke="var(--champagne-gold)" strokeWidth="1.4" />
    <line x1="2.5" y1="10" x2="17.5" y2="10" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <line x1="10" y1="2.5" x2="10" y2="17.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <path d="M4.5 4.5 C7.5 7.5 7.5 12.5 4.5 15.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
    <path d="M15.5 4.5 C12.5 7.5 12.5 12.5 15.5 15.5" stroke="var(--champagne-gold)" strokeWidth="1.1" />
  </svg>
);

/** Tennis / Racket Icon 🏸 */
export const SportsTennisIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <ellipse cx="12" cy="7.5" rx="5" ry="4" stroke="var(--champagne-gold)" strokeWidth="1.3" />
    <line x1="8" y1="10.5" x2="3.5" y2="16.5" stroke="var(--champagne-gold)" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="9.5" y1="5.5" x2="14.5" y2="9.5" stroke="var(--champagne-gold)" strokeWidth="0.8" />
    <line x1="14.5" y1="5.5" x2="9.5" y2="9.5" stroke="var(--champagne-gold)" strokeWidth="0.8" />
  </svg>
);

/** Chess / Strategy Icon ♟️ */
export const SportsChessIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M6 16.5 H14 V15 C13 14 12 12.5 12 11 C13.5 10 14 8 13.5 6 C13 4 10.5 3 9.5 3.5 C8 4 6.5 5.5 6.5 8 C6.5 9 6 10 5 11 L8 11 C8 12.5 7 14 6 15 Z"
      fill="rgba(198, 161, 91, 0.25)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="5.5" r="0.8" fill="var(--champagne-gold)" />
  </svg>
);

/** Athletics / Runner Icon 🏃 */
export const SportsAthleticsIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="13" cy="4" r="1.8" fill="var(--champagne-gold)" />
    <path d="M7 8 L10.5 6 L12 8.5 L9.5 12 L12.5 16 M9.5 12 L6.5 14.5" stroke="var(--champagne-gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8.5 L15 10 L16.5 8.5" stroke="var(--champagne-gold)" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Shield with Checkmark Icon 🛡️ (Student Declaration) */
export const ShieldCheckIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 2.5 L16.5 5.2 V10.2 C16.5 14.2 13.7 17.2 10 18.2 C6.3 17.2 3.5 14.2 3.5 10.2 V5.2 Z"
      fill="rgba(198, 161, 91, 0.2)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.4"
    />
    <path d="M7 10.2 L9 12.2 L13.5 7.8" stroke="var(--champagne-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Quill Pen / Signature Nib Icon 🖋️ */
export const QuillPenIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M16 2.5 L17.5 4 L8.5 14 L5.5 15 L6.5 12 Z"
      fill="rgba(198, 161, 91, 0.3)"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <line x1="8" y1="13.5" x2="6" y2="14.5" stroke="var(--champagne-gold)" strokeWidth="1.2" />
    <line x1="3" y1="17.5" x2="16" y2="17.5" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Calendar Icon 📅 (Date) */
export const CalendarFieldIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect
      x="3"
      y="4.5"
      width="14"
      height="12.5"
      rx="2"
      stroke="var(--champagne-gold)"
      strokeWidth="1.3"
      fill="rgba(5, 30, 22, 0.4)"
    />
    <line x1="3" y1="8.5" x2="17" y2="8.5" stroke="var(--champagne-gold)" strokeWidth="1.2" />
    <line x1="6.5" y1="2.5" x2="6.5" y2="5" stroke="var(--champagne-gold)" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="13.5" y1="2.5" x2="13.5" y2="5" stroke="var(--champagne-gold)" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="7" cy="11.5" r="0.9" fill="var(--champagne-gold)" />
    <circle cx="10" cy="11.5" r="0.9" fill="var(--champagne-gold)" />
    <circle cx="13" cy="11.5" r="0.9" fill="var(--champagne-gold)" />
    <circle cx="7" cy="14" r="0.9" fill="var(--champagne-gold)" />
    <circle cx="10" cy="14" r="0.9" fill="var(--champagne-gold)" />
  </svg>
);

/** Food Cutlery / Utensils Icon 🍽️ (Food Preference Row) */
export const FoodUtensilsIcon: React.FC<{ className?: string }> = ({
  className = 'reg-field-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Fork */}
    <path d="M5 3 V7 C5 8.1 5.9 9 7 9 V17 M5 3 V7 M7 3 V7 M9 3 V7 C9 8.1 8.1 9 7 9" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" />
    {/* Knife */}
    <path d="M13 3 C14.5 4.5 15 8 15 11 H13 V17 M13 3 V17" stroke="var(--champagne-gold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Pure Veg Leaf Icon 🥬 */
export const LeafVegIcon: React.FC<{ className?: string }> = ({
  className = 'reg-food-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M13.5 2.5 C7.5 2 2.5 7 2.5 13.5 C9 13.5 14 8.5 13.5 2.5 Z"
      fill="rgba(76, 175, 80, 0.35)"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M2.5 13.5 C6.5 10 9 6.5 13.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/** Non-Veg Meat Drumstick Icon 🍗 */
export const MeatNonVegIcon: React.FC<{ className?: string }> = ({
  className = 'reg-food-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {/* Drumstick Meat */}
    <path
      d="M14 6 C14 3.5 11.5 2 9 3 C6.5 4 6 7 7.5 9.5 C8.5 11 10.5 11 12 10 C13.5 9 14 7.5 14 6 Z"
      fill="rgba(239, 83, 80, 0.35)"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    {/* Bone */}
    <path d="M7 9 L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="3" cy="13" r="1.2" stroke="currentColor" strokeWidth="1" />
    <circle cx="4" cy="14" r="1.2" stroke="currentColor" strokeWidth="1" />
  </svg>
);

/** Medical Quiz / Caduceus Icon ⚕️ (Marrow Med Quiz) */
export const MedQuizIcon: React.FC<{ className?: string }> = ({
  className = 'reg-tile-icon-svg',
}) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {/* Cross / Medical Staff */}
    <path d="M10 2 V18 M8 4 H12" stroke="var(--champagne-gold)" strokeWidth="1.4" strokeLinecap="round" />
    {/* Serpent 1 entwining */}
    <path
      d="M6 7 C6 5 8 5 10 7 C12 9 14 9 14 7 C14 5 12 5 10 7"
      stroke="var(--champagne-gold)"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Serpent 2 lower loop */}
    <path
      d="M6 13 C6 11 8 11 10 13 C12 15 14 15 14 13"
      stroke="var(--champagne-gold)"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Star / Quiz Diamond at top */}
    <polygon points="10,2 11,3.5 10,5 9,3.5" fill="var(--champagne-gold)" />
  </svg>
);

