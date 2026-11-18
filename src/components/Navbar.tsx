import React, { useState, useEffect } from 'react';
import { CompassSparkleIcon } from './IconSet';
import { ChamferButton } from './ChamferButton';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface NavBarProps {
  activeId: string;
  onSelectNav: (id: string) => void;
  onRegisterClick: () => void;
}

const LEFT_LINKS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'events', label: 'Events', href: '#events' },
];

const RIGHT_LINKS: NavItem[] = [
  { id: 'teams', label: 'Teams', href: '#teams' },
  { id: 'leaderboard', label: 'Leaderboard', href: '#leaderboard' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const NavBar: React.FC<NavBarProps> = ({
  activeId,
  onSelectNav,
  onRegisterClick,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (y > lastY && y > 28) {
        setCondensed(true);
      } else if (y < lastY || y <= 16) {
        setCondensed(false);
      }
      lastY = y;
    };
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) {
        setCondensed(true);
      } else if (e.deltaY < -10) {
        setCondensed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [drawerOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onSelectNav(id);
    setDrawerOpen(false);
  };

  return (
    <header
      className={`site-header page-fade-item ${scrolled ? 'is-scrolled' : ''} ${
        condensed ? 'is-condensed' : ''
      }`}
    >
      {/* Top Hairline Gold Border with Corner Diamond Accents */}
      <div className="nav-hairline nav-hairline--top" aria-hidden="true">
        <span className="nav-hairline__diamond nav-hairline__diamond--left" />
        <span className="nav-hairline__segment nav-hairline__segment--left" />
        <span className="nav-hairline__gap" />
        <span className="nav-hairline__segment nav-hairline__segment--right" />
        <span className="nav-hairline__diamond nav-hairline__diamond--right" />
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        {/* Left Brand: Slytherin Serpent Shield Asset + Two-Line Text */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="nav-brand"
        >
          <picture className="nav-brand-crest-wrap">
            <source srcSet="/assets/nav-left-crest.webp" type="image/webp" />
            <img
              src="/assets/nav-left-crest.png"
              alt="Slytherin House Serpent Shield Emblem"
              width={42}
              height={48}
              className="nav-brand-crest-img"
              decoding="async"
            />
          </picture>
          <span className="nav-brand__text">
            <span className="nav-brand__line">Zenforianz</span>
            <span className="nav-brand__line">Presents</span>
          </span>
        </a>

        {/* Left Links: Home | About | Events */}
        <ul className="nav-links nav-links--left">
          {LEFT_LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="nav-links__item">
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-links__anchor ${isActive ? 'is-active' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Center Slytherin Serpent Crest Asset + Filigree Wings */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="nav-center-ornament"
          aria-label="Slytherin House Sanctum Home"
        >
          <svg
            className="nav-center-wings"
            viewBox="0 0 220 76"
            fill="none"
            aria-hidden="true"
          >
            {/* Left Acanthus Filigree Wing */}
            <path
              d="M8 62 H56 C65 62 72 56 76 49 C70 50 64 56 54 56 H28"
              stroke="var(--antique-gold)"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M42 62 C47 50 56 44 67 47 C61 40 52 42 46 50"
              stroke="var(--champagne-gold)"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
            <polygon points="18,62 21,59.5 24,62 21,64.5" fill="var(--champagne-gold)" />

            {/* Right Acanthus Filigree Wing */}
            <path
              d="M212 62 H164 C155 62 148 56 144 49 C150 50 156 56 166 56 H192"
              stroke="var(--antique-gold)"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M178 62 C173 50 164 44 153 47 C159 40 168 42 174 50"
              stroke="var(--champagne-gold)"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
            <polygon points="202,62 199,59.5 196,62 199,64.5" fill="var(--champagne-gold)" />
          </svg>
          <picture className="nav-center-crest-wrap">
            <source srcSet="/assets/nav-center-crest.webp" type="image/webp" />
            <img
              src="/assets/nav-center-crest.png"
              alt="Central Slytherin Serpent Crest"
              width={96}
              height={86}
              className="nav-center-crest-img"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </a>

        {/* Right Links: Teams | Leaderboard | Contact */}
        <ul className="nav-links nav-links--right">
          {RIGHT_LINKS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="nav-links__item">
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-links__anchor ${isActive ? 'is-active' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right CTA: Chamfered "Register Now" with Compass Sparkle Icon */}
        <div className="nav-cta">
          <ChamferButton variant="nav" onClick={onRegisterClick}>
            <CompassSparkleIcon />
            <span>Register Now</span>
          </ChamferButton>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`nav-hamburger ${drawerOpen ? 'is-open' : ''}`}
          aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setDrawerOpen((prev) => !prev)}
        >
          <span className="nav-hamburger__bar" />
          <span className="nav-hamburger__bar" />
          <span className="nav-hamburger__bar" />
        </button>
      </nav>

      {/* Bottom Hairline Gold Border (split around center crest) */}
      <div className="nav-hairline nav-hairline--bottom" aria-hidden="true">
        <span className="nav-hairline__diamond nav-hairline__diamond--left" />
        <span className="nav-hairline__segment nav-hairline__segment--left" />
        <span className="nav-hairline__gap" />
        <span className="nav-hairline__segment nav-hairline__segment--right" />
        <span className="nav-hairline__diamond nav-hairline__diamond--right" />
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      <div
        id="mobile-nav-drawer"
        className={`mobile-drawer ${drawerOpen ? 'is-open' : ''}`}
        aria-hidden={!drawerOpen}
      >
        <ul className="mobile-drawer__list">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((item) => (
            <li key={item.id} className="mobile-drawer__item">
              <a
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`mobile-drawer__link ${activeId === item.id ? 'is-active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-drawer__cta">
          <ChamferButton
            variant="primary"
            onClick={() => {
              setDrawerOpen(false);
              onRegisterClick();
            }}
          >
            <CompassSparkleIcon />
            <span>Register Now</span>
          </ChamferButton>
        </div>
      </div>
    </header>
  );
};
