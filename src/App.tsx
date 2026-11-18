import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavBar } from './components/Navbar';
import { OrnateFrame } from './components/OrnateFrame';
import { ChamferButton } from './components/ChamferButton';
import { FeatureCard } from './components/FeatureCard';
import { QrPassView, RegisteredParticipant } from './components/QrPassView';
import { AdminGate } from './components/AdminGate';
import { AdminLogin } from './components/AdminLogin';
import { IntroOverlay } from './motion/intro';
import { ParallaxScene } from './motion/parallax';
import { ParticlesCanvas } from './motion/particles';
import { CustomCursor } from './motion/cursor';
import { AmbientSoundToggle, PageTransitionWipe } from './motion/sound';
import { initHeroMagneticButtons, initSmoothScrollAndTriggers } from './motion/hero';
import { initFeatureCardsMotion } from './motion/cards';
import {
  ArrowRightIcon,
  DocumentBrochureIcon,
  DiamondBulletIcon,
  HeroSerpentDivider,
  LaurelTrophyCardIcon,
  TeamGroupCardIcon,
  StarTrophyCardIcon,
  ScrollQuillCardIcon,
  FooterSerpentEmblem,
  DiscordSocialIcon,
  InstagramSocialIcon,
  YouTubeSocialIcon,
  XSocialIcon,
  LaurelTorchEmblemIcon,
  GoldCloseCircleIcon,
  UserFieldIcon,
  IdCardFieldIcon,
  GradCapFieldIcon,
  GenderFieldIcon,
  MaleSymbolIcon,
  FemaleSymbolIcon,
  PhoneFieldIcon,
  MailFieldIcon,
  InfoCircleIcon,
  MasksTheaterIcon,
  TrophyOlympiaIcon,
  MusicNotesIcon,
  ElectricGuitarIcon,
  ClassicalDancerIcon,
  DuetDancerIcon,
  DrumsIcon,
  DuetMicrophonesIcon,
  MicrophoneIcon,
  QuillScrollEventIcon,
  PaletteEventIcon,
  CameraEventIcon,
  GamepadEventIcon,
  ChefHatEventIcon,
  SportsSoccerIcon,
  SportsCricketIcon,
  SportsVolleyballIcon,
  SportsBasketballIcon,
  SportsTennisIcon,
  SportsChessIcon,
  SportsAthleticsIcon,
  ShieldCheckIcon,
  QuillPenIcon,
  CalendarFieldIcon,
  FoodUtensilsIcon,
  LeafVegIcon,
  MeatNonVegIcon,
  MedQuizIcon,
} from './components/IconSet';

type ModalKind =
  | 'register'
  | 'brochure'
  | 'events'
  | 'teams'
  | 'leaderboard'
  | 'rules'
  | 'about'
  | 'contact'
  | null;

type RegistrationTrack = 'choice' | 'cultural' | 'olympia';

const TITLE_CHARS = ['S', 'L', 'Y', 'T', 'H', 'E', 'R', 'I', 'N'];
const MOTTO_WORDS = ['AMBITION', 'CUNNING', 'LEADERSHIP', 'EXCELLENCE'];

/* Exact Sports Events – Male from Page 1 of the PDF */
const SPORTS_EVENTS_MALE: string[] = [
  'Cricket',
  'Futsal',
  'Football',
  'Volleyball',
  'Beach Volleyball',
  'Kho-Kho',
  'Chess',
  'Carrom',
  'Table Tennis',
  'Badminton',
  "Basketball (5's)",
  "Basketball (3's)",
  'Athletics',
];

/* Exact Sports Events – Female from Page 1 of the PDF */
const SPORTS_EVENTS_FEMALE: string[] = [
  'Futsal',
  'Volleyball',
  'Throwball',
  'Kho-Kho',
  'Leg Cricket',
  'Turf Cricket',
  'Chess',
  'Carrom',
  'Table Tennis',
  'Badminton',
  "Basketball (5's)",
  "Basketball (3's)",
  'Athletics',
];

/* Official Cultural Events (with featured reference events at top) */
const CULTURAL_EVENTS_LIST: string[] = [
  'Solo Western',
  'Band',
  'Solo Classical',
  'Solo Instrumental',
  'Duet Dancing',
  'Solo Singing',
  'Group Dance',
  'Adapt Tunes',
  'Replica',
  'Duet Singing',
  'Fashion Show',
  'Debate',
  'Short Film',
  'Marrow Med Quiz',
  'Tamil Elocution',
  'JAM Tamil',
  'English Elocution',
  'English JAM',
  'Tamil Essay',
  'English Essay',
  'English Poetry',
  'Tamil Poetry',
  'Ads',
  'Face Painting',
  'Painting',
  'Pencil Art',
  'Hairdo',
  'Veg Carving',
  'Best Out of Waste',
  'Rangoli',
  'Mehendi',
  'Connection',
  'Fireless Cooking',
  'Spell Bee',
  'Eatathon',
  'Photography',
  'Digital Painting',
  'Reel Making',
  'Movie Scene Recreation',
  'PUBG',
  'Free Fire',
  'COD',
  'Clash Royale',
  'IPL Auction',
];

/** Formats an ISO YYYY-MM-DD date string into "DD / MM / YYYY" for luxury parchment display */
const formatDateDisplay = (isoDate: string): string => {
  if (!isoDate) return '17 / 11 / 2026';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
  }
  return isoDate;
};

/** Thematic SVG Icon Resolver for Cultural & Sports Events */
const getEventIcon = (name: string): React.ReactNode => {
  const n = name.toLowerCase();
  if (n === 'solo western') return <MusicNotesIcon />;
  if (n === 'band') return <ElectricGuitarIcon />;
  if (n === 'solo classical') return <ClassicalDancerIcon />;
  if (n === 'solo instrumental') return <DrumsIcon />;
  if (n === 'duet dancing' || n === 'duet dance' || n === 'duet') return <DuetDancerIcon />;
  if (n === 'solo singing') return <MicrophoneIcon />;
  if (n === 'duet singing') return <DuetMicrophonesIcon />;
  if (n.includes('dance') || n.includes('adapt tune')) return <ClassicalDancerIcon />;
  if (n.includes('singing') || n.includes('western') || n.includes('music')) return <MusicNotesIcon />;
  if (n.includes('instrumental') || n.includes('drum')) return <DrumsIcon />;
  if (n.includes('elocution') || n.includes('jam') || n.includes('debate')) return <MicrophoneIcon />;
  if (n.includes('essay') || n.includes('poetry') || n.includes('spell bee')) return <QuillScrollEventIcon />;
  if (n.includes('painting') || n.includes('art') || n.includes('rangoli') || n.includes('mehendi')) return <PaletteEventIcon />;
  if (n.includes('photo') || n.includes('film') || n.includes('reel') || n.includes('scene') || n.includes('ads')) return <CameraEventIcon />;
  if (n.includes('marrow') || n.includes('med quiz')) return <MedQuizIcon />;
  if (n.includes('pubg') || n.includes('free fire') || n.includes('cod') || n.includes('clash royale')) return <GamepadEventIcon />;
  if (n.includes('cooking') || n.includes('eatathon') || n.includes('veg carving') || n.includes('waste')) return <ChefHatEventIcon />;
  if (n.includes('football') || n.includes('futsal')) return <SportsSoccerIcon />;
  if (n.includes('cricket') || n.includes('ipl')) return <SportsCricketIcon />;
  if (n.includes('volleyball') || n.includes('throwball')) return <SportsVolleyballIcon />;
  if (n.includes('basketball')) return <SportsBasketballIcon />;
  if (n.includes('tennis') || n.includes('badminton')) return <SportsTennisIcon />;
  if (n.includes('chess') || n.includes('carrom')) return <SportsChessIcon />;
  if (n.includes('athletics') || n.includes('kho-kho')) return <SportsAthleticsIcon />;
  return <MusicNotesIcon />;
};

const LEADERBOARD_DATA = [
  { rank: 'I', squad: 'Order of the Emerald Fang', captain: 'S. Malfoy', points: '2,480 PTS' },
  { rank: 'II', squad: 'Salazar’s Sovereign Vanguard', captain: 'V. Rosier', points: '2,310 PTS' },
  { rank: 'III', squad: 'Obsidian Crown Syndicate', captain: 'A. Avery', points: '2,195 PTS' },
  { rank: 'IV', squad: 'Black Lake Conclave', captain: 'C. Nott', points: '2,040 PTS' },
];

export function App() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [activeNav, setActiveNav] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const adminPath = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  const isAdminLoginRoute = adminPath === '/admin/login';
  const isAdminView = adminPath === '/admin' || adminPath.startsWith('/admin/');
  const [localRegistrations, setLocalRegistrations] = useState<RegisteredParticipant[]>(() => {
    try {
      const saved = localStorage.getItem('slytherin_registrations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* Registration Flow State */
  const [regTrack, setRegTrack] = useState<RegistrationTrack>('choice');
  const [studentName, setStudentName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [batch, setBatch] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [foodPreference, setFoodPreference] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedMaleSports, setSelectedMaleSports] = useState<string[]>([]);
  const [selectedFemaleSports, setSelectedFemaleSports] = useState<string[]>([]);
  const [selectedCultural, setSelectedCultural] = useState<string[]>([]);
  const [declarationChecked, setDeclarationChecked] = useState(true);
  const [signature, setSignature] = useState('');
  const [regDate, setRegDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<RegisteredParticipant | null>(null);

  const updateLocalRegistrations = useCallback((list: RegisteredParticipant[]) => {
    setLocalRegistrations(list);
    try {
      localStorage.setItem('slytherin_registrations', JSON.stringify(list));
    } catch {
      // Ignore storage quota
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal]);

  const openRegistrationPicker = () => {
    setSubmittedRecord(null);
    setFormError(null);
    setRegTrack('choice');
    setActiveModal('register');
  };

  const handleNavSelection = (id: string) => {
    setActiveNav(id);
    if (id === 'home') {
      setActiveModal(null);
    } else if (
      id === 'about' ||
      id === 'events' ||
      id === 'teams' ||
      id === 'leaderboard' ||
      id === 'contact'
    ) {
      setActiveModal(id);
    }
  };

  const handleCardSelect = (id: string) => {
    if (id === 'events' || id === 'teams' || id === 'leaderboard' || id === 'rules') {
      setActiveNav(id === 'rules' ? 'home' : id);
      setActiveModal(id);
    }
  };

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setFormError(null);
    setList((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const activeEvents =
      regTrack === 'cultural'
        ? selectedCultural
        : gender === 'Male' && selectedMaleSports.length > 0
          ? selectedMaleSports
          : gender === 'Female' && selectedFemaleSports.length > 0
            ? selectedFemaleSports
            : Array.from(new Set([...selectedMaleSports, ...selectedFemaleSports]));

    if (activeEvents.length === 0) {
      setFormError(
        regTrack === 'cultural'
          ? 'Please tick at least one Cultural Event to participate in.'
          : `Please tick at least one event from Sports Events – ${gender}.`
      );
      return;
    }

    if (!declarationChecked) {
      setFormError('Please confirm the Student Declaration before submitting.');
      return;
    }

    const payload = {
      track: (regTrack === 'cultural' ? 'Cultural Event' : 'Olympia Event') as
        | 'Cultural Event'
        | 'Olympia Event',
      studentName: studentName.trim(),
      registrationNo: registrationNo.trim(),
      batch: batch.trim(),
      gender,
      foodPreference,
      phone: phone.trim(),
      email: email.trim(),
      selectedEvents: activeEvents,
      signature: signature.trim() || studentName.trim(),
      date: regDate,
    };

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        const saved: RegisteredParticipant = data.registration;
        setSubmittedRecord(saved);
        updateLocalRegistrations([
          saved,
          ...localRegistrations.filter((r) => r.passId !== saved.passId),
        ]);
        setTimeout(() => {
          document.querySelector('.modal-dialog')?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
        return;
      }
    } catch {
      // Fallback to local storage registration record if backend is unreachable
    }

    const seq = 1001 + localRegistrations.length;
    const passId = `SLY-${seq}`;
    const fallbackRecord: RegisteredParticipant = {
      passId,
      qrPayload: `SLY|${passId}|${payload.registrationNo.toUpperCase()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      attendanceScanned: false,
      attendanceScannedAt: null,
      foodScanned: false,
      foodScannedAt: null,
    };
    updateLocalRegistrations([fallbackRecord, ...localRegistrations]);
    setSubmittedRecord(fallbackRecord);
  };

  useEffect(() => {
    if (isAdminView) return;
    const stageEl = stageRef.current;
    const cleanupMagnetic = initHeroMagneticButtons(stageEl);
    const cleanupCards = initFeatureCardsMotion(stageEl);
    const cleanupScroll = initSmoothScrollAndTriggers(stageEl);
    return () => {
      cleanupMagnetic();
      cleanupCards();
      cleanupScroll();
    };
  }, [isAdminView]);

  if (isAdminView) {
    return isAdminLoginRoute ? (
      <AdminLogin />
    ) : (
      <>
        <CustomCursor />
        <AdminGate
          localRegistrations={localRegistrations}
          onUpdateLocalRegistrations={updateLocalRegistrations}
        />
      </>
    );
  }

  return (
    <div id="home" ref={stageRef} className="homepage-stage">
      {/* Page Transition Wipe */}
      <PageTransitionWipe activeTrigger={isAdminView} />

      {/* Once-Per-Session Skippable Intro Sequence + Master GSAP Timeline */}
      <IntroOverlay stageRef={stageRef} />

      {/* Desktop Custom Gold Cursor & Sparkle Trail */}
      <CustomCursor />

      {/* 5-Layer Parallax Castle Scene, Aurora, Moon, Windows, Fog, Banners & Lanterns */}
      <ParallaxScene />

      {/* Luxury Golden-Ivory & Deep-Emerald Color Grade + Readability Vignette */}
      <div className="stage-vignette" aria-hidden="true" />

      {/* Floating Emerald & Gold Embers / Fireflies Canvas (Paused when Hidden) */}
      <ParticlesCanvas />

      {/* 1. NAVIGATION BAR */}
      <NavBar
        activeId={activeNav}
        onSelectNav={handleNavSelection}
        onRegisterClick={openRegistrationPicker}
      />

      {/* 2. HERO MAIN CONTENT */}
      <main className="hero-main">
        <div className="hero-centerpiece">
          {/* Main Heading: SLYTHERIN */}
          <div className="hero-title-wrap">
            <h1 className="hero-title" aria-label="SLYTHERIN">
              {TITLE_CHARS.map((char, index) => {
                const isEdge = index === 0 || index === TITLE_CHARS.length - 1;
                return (
                  <span key={index} className="hero-title__mask" aria-hidden="true">
                    <span
                      className={`hero-title__char ${isEdge ? 'hero-title__char--edge' : ''}`}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </h1>
          </div>

          {/* Subtitle: THE HOUSE EVENT */}
          <div className="hero-subtitle-row">
            <span className="hero-subtitle-line hero-subtitle-line--left" aria-hidden="true" />
            <p className="hero-subtitle">THE HOUSE EVENT</p>
            <span className="hero-subtitle-line hero-subtitle-line--right" aria-hidden="true" />
          </div>

          {/* House Motto: AMBITION • CUNNING • LEADERSHIP • EXCELLENCE */}
          <p className="hero-tagline">
            {MOTTO_WORDS.map((word, idx) => (
              <React.Fragment key={word}>
                <span className="hero-motto-word">{word}</span>
                {idx < MOTTO_WORDS.length - 1 && <DiamondBulletIcon />}
              </React.Fragment>
            ))}
          </p>

          {/* Centered Golden Serpent Ornamental Divider */}
          <div className="hero-divider-wrap" aria-hidden="true">
            <HeroSerpentDivider />
          </div>

          {/* Symmetrical Primary & Secondary Chamfered CTAs */}
          <div className="hero-ctas">
            <ChamferButton
              variant="primary"
              onClick={openRegistrationPicker}
            >
              <span>Register Now</span>
              <ArrowRightIcon />
            </ChamferButton>

            <ChamferButton
              variant="secondary"
              href="/slytherin-brochure.pdf"
              target="_blank"
              download="Slytherin'26 Brochure.pdf"
            >
              <DocumentBrochureIcon />
              <span>Event Brochure</span>
            </ChamferButton>
          </div>
        </div>

        {/* 3. FOUR LUXURY FEATURE CARDS */}
        <section
          className="feature-cards-section"
          aria-label="Event categories and portals"
        >
          {/* Thin Antique-Gold Divider Line Above Feature Cards */}
          <div className="feature-cards__top-rule" aria-hidden="true">
            <span className="feature-cards__top-rule-line" />
            <span className="feature-cards__top-rule-gem" />
            <span className="feature-cards__top-rule-line" />
          </div>

          <ul className="feature-cards__list">
            <FeatureCard
              id="events"
              href="#events"
              icon={<LaurelTrophyCardIcon />}
              title="Events"
              caption="Explore the challenges"
              onSelect={handleCardSelect}
            />
            <FeatureCard
              id="teams"
              href="#teams"
              icon={<TeamGroupCardIcon />}
              title="Teams"
              caption="Form your house squad"
              onSelect={handleCardSelect}
            />
            <FeatureCard
              id="leaderboard"
              href="#leaderboard"
              icon={<StarTrophyCardIcon />}
              title="Leaderboard"
              caption="Track your progress"
              onSelect={handleCardSelect}
            />
            <FeatureCard
              id="rules"
              href="#rules"
              icon={<ScrollQuillCardIcon />}
              title="Rules & Guidelines"
              caption="Know the regulations"
              onSelect={handleCardSelect}
            />
          </ul>
        </section>
      </main>

      {/* 4. LUXURY HERO FOOTER (Emerald Velvet Ribbons, Socials, SLYTHERIN • FOREVER, Quote) */}
      <footer className="hero-footer page-fade-item stagger-5">
        {/* Sweeping Emerald Velvet & Antique Gold Corner Ribbons */}
        <svg
          className="hero-footer__velvet hero-footer__velvet--left"
          viewBox="0 0 540 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="velvetLeftFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#043326" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#031D16" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#05120E" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="velvetGoldStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E5CC91" />
              <stop offset="65%" stopColor="#C6A15B" />
              <stop offset="100%" stopColor="rgba(198,161,91,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,12 C110,24 195,92 340,104 C420,111 485,116 540,120 L0,120 Z"
            fill="url(#velvetLeftFill)"
          />
          <path
            d="M0,12 C110,24 195,92 340,104 C420,111 485,116 540,120"
            fill="none"
            stroke="url(#velvetGoldStroke)"
            strokeWidth="2"
          />
          <path
            d="M0,52 C95,62 180,96 310,114"
            fill="none"
            stroke="url(#velvetGoldStroke)"
            strokeWidth="1.2"
            strokeOpacity="0.75"
          />
        </svg>

        <svg
          className="hero-footer__velvet hero-footer__velvet--right"
          viewBox="0 0 540 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M540,12 C430,24 345,92 200,104 C120,111 55,116 0,120 L540,120 Z"
            fill="url(#velvetLeftFill)"
          />
          <path
            d="M540,12 C430,24 345,92 200,104 C120,111 55,116 0,120"
            fill="none"
            stroke="url(#velvetGoldStroke)"
            strokeWidth="2"
          />
          <path
            d="M540,52 C445,62 360,96 230,114"
            fill="none"
            stroke="url(#velvetGoldStroke)"
            strokeWidth="1.2"
            strokeOpacity="0.75"
          />
        </svg>

        <div className="hero-footer__inner">
          {/* Bottom Left: Discord, Instagram, YouTube, X */}
          <ul className="hero-footer__socials" aria-label="Official social channels">
            <li>
              <a
                href="#discord"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveModal('contact');
                }}
                className="hero-footer__social-btn"
                aria-label="Discord"
                title="Discord"
              >
                <DiscordSocialIcon />
              </a>
            </li>
            <li>
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveModal('contact');
                }}
                className="hero-footer__social-btn"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramSocialIcon />
              </a>
            </li>
            <li>
              <a
                href="#youtube"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveModal('contact');
                }}
                className="hero-footer__social-btn"
                aria-label="YouTube"
                title="YouTube"
              >
                <YouTubeSocialIcon />
              </a>
            </li>
            <li>
              <a
                href="#x"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveModal('contact');
                }}
                className="hero-footer__social-btn"
                aria-label="X (formerly Twitter)"
                title="X"
              >
                <XSocialIcon />
              </a>
            </li>
          </ul>

          {/* Bottom Center: Decorative Divider + SLYTHERIN • FOREVER + Serpent Emblem */}
          <div className="hero-footer__center">
            <div className="hero-footer__motto-row">
              <span className="hero-footer__line hero-footer__line--left" aria-hidden="true" />
              <span className="hero-footer__forever">
                SLYTHERIN <span className="hero-footer__dot">•</span> FOREVER
              </span>
              <span className="hero-footer__line hero-footer__line--right" aria-hidden="true" />
            </div>
            <FooterSerpentEmblem />
          </div>

          {/* Bottom Right Quote & Sound Toggle */}
          <div className="hero-footer__right-group">
            <AmbientSoundToggle />
            <p className="hero-footer__quote">
              — &ldquo;Ambition drives us forward.&rdquo; —
            </p>
          </div>
        </div>
      </footer>

      {/* Accessible Interactive Modal Portals */}
      {activeModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setActiveModal(null)}
        >
          {activeModal === 'register' ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="modal-dialog modal-dialog--registration"
            >
              {submittedRecord ? (
                <div className="reg-pass-wrap">
                  <button
                    type="button"
                    className="reg-modal-close"
                    aria-label="Close pass"
                    onClick={() => setActiveModal(null)}
                  >
                    <GoldCloseCircleIcon />
                  </button>
                  <QrPassView
                    record={submittedRecord}
                    onRegisterAnother={() => {
                      setSubmittedRecord(null);
                      setRegTrack('choice');
                    }}
                    onClose={() => setActiveModal(null)}
                  />
                </div>
              ) : regTrack === 'choice' ? (
                <div className="reg-lux-container">
                  <button
                    type="button"
                    className="reg-modal-close"
                    aria-label="Close dialog"
                    onClick={() => setActiveModal(null)}
                  >
                    <GoldCloseCircleIcon />
                  </button>

                  <div className="reg-header-block">
                    <LaurelTorchEmblemIcon />
                    <h2 id="modal-title" className="reg-modal-title">
                      COLLEGE CULTURAL &amp; SPORTS FEST
                    </h2>
                    <div className="reg-modal-subtitle">✦ SELECT EVENT REGISTRATION TRACK ✦</div>
                    <div className="reg-modal-diamond">◆</div>
                    <div className="reg-modal-tagline">STUDENT REGISTRATION FORM</div>
                  </div>

                  <div className="reg-choice-stage">
                    <p className="reg-choice-intro">
                      Choose your event registration track below to open the official registration form:
                    </p>

                    <div className="reg-choice-grid">
                      {/* Button 1: Cultural Event */}
                      <button
                        type="button"
                        className="reg-choice-card"
                        onClick={() => {
                          setSubmittedRecord(null);
                          setFormError(null);
                          setRegTrack('cultural');
                        }}
                      >
                        <span className="reg-choice-card__icon" aria-hidden="true">
                          <MasksTheaterIcon />
                        </span>
                        <span className="reg-choice-card__title">Cultural Event</span>
                        <span className="reg-choice-card__desc">
                          Music, Dance, Literary, Fine Arts, Stage, Med Quiz &amp; Gaming (44 Events)
                        </span>
                        <span className="reg-choice-card__cta">
                          <span>Open Cultural Form</span>
                          <ArrowRightIcon />
                        </span>
                      </button>

                      {/* Button 2: Olympia Event */}
                      <button
                        type="button"
                        className="reg-choice-card"
                        onClick={() => {
                          setSubmittedRecord(null);
                          setFormError(null);
                          setRegTrack('olympia');
                        }}
                      >
                        <span className="reg-choice-card__icon" aria-hidden="true">
                          <TrophyOlympiaIcon />
                        </span>
                        <span className="reg-choice-card__title">Olympia Event</span>
                        <span className="reg-choice-card__desc">
                          Sports Events – Male (13 Events) &amp; Sports Events – Female (13 Events)
                        </span>
                        <span className="reg-choice-card__cta">
                          <span>Open Olympia Form</span>
                          <ArrowRightIcon />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* OFFICIAL LUXURY REGISTRATION FORM (MATCHING REFERENCE IMAGE) */
                <form className="reg-lux-form" onSubmit={handleRegistrationSubmit}>
                  {/* Top Right Gold Circular Close Button */}
                  <button
                    type="button"
                    className="reg-modal-close"
                    aria-label="Close dialog"
                    onClick={() => setActiveModal(null)}
                  >
                    <GoldCloseCircleIcon />
                  </button>

                  {/* Top Center Laurel Torch Heraldic Crest & Grand Header */}
                  <div className="reg-header-block">
                    <LaurelTorchEmblemIcon />
                    <h2 id="modal-title" className="reg-modal-title">
                      COLLEGE CULTURAL &amp; SPORTS FEST
                    </h2>
                    <div className="reg-modal-subtitle">
                      ✦ {regTrack === 'cultural' ? 'CULTURAL EVENT REGISTRATION' : 'OLYMPIA EVENT REGISTRATION'} ✦
                    </div>
                    <div className="reg-modal-diamond">◆</div>
                    <div className="reg-modal-tagline">STUDENT REGISTRATION FORM</div>
                  </div>

                  {/* Navigation Bar: Back link + Dual Pill Tabs */}
                  <div className="reg-track-bar">
                    <button
                      type="button"
                      className="reg-back-link"
                      onClick={() => {
                        setFormError(null);
                        setRegTrack('choice');
                      }}
                    >
                      <span>← Back to Event Selection</span>
                    </button>

                    <div className="reg-track-pills" role="tablist" aria-label="Event Track Selection">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={regTrack === 'cultural'}
                        className={`reg-track-pill ${regTrack === 'cultural' ? 'is-active' : ''}`}
                        onClick={() => {
                          setFormError(null);
                          setRegTrack('cultural');
                        }}
                      >
                        <MasksTheaterIcon className="reg-track-pill-icon" />
                        <span>CULTURAL EVENT</span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        aria-selected={regTrack === 'olympia'}
                        className={`reg-track-pill ${regTrack === 'olympia' ? 'is-active' : ''}`}
                        onClick={() => {
                          setFormError(null);
                          setRegTrack('olympia');
                        }}
                      >
                        <TrophyOlympiaIcon className="reg-track-pill-icon" />
                        <span>OLYMPIA EVENT</span>
                      </button>
                    </div>
                  </div>

                  {/* ============================================================
                      CARD 1: 1. STUDENT DETAILS —————
                      ============================================================ */}
                  <div className="reg-card">
                    <div className="reg-card-head">
                      <h3 className="reg-card-head-title">1. STUDENT DETAILS</h3>
                      <div className="reg-card-head-line" aria-hidden="true" />
                    </div>

                    <div className="reg-details-table">
                      {/* Row 1: Student Name */}
                      <div className="reg-detail-row">
                        <div className="reg-detail-label">
                          <UserFieldIcon className="reg-detail-icon" />
                          <span>Student Name</span>
                        </div>
                        <div className="reg-detail-control">
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Enter full name"
                            className="reg-detail-input"
                          />
                        </div>
                      </div>

                      {/* Row 2: Registration No. */}
                      <div className="reg-detail-row">
                        <div className="reg-detail-label">
                          <IdCardFieldIcon className="reg-detail-icon" />
                          <span>Registration No.</span>
                        </div>
                        <div className="reg-detail-control">
                          <input
                            type="text"
                            required
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                            placeholder="Enter registration number"
                            className="reg-detail-input"
                          />
                        </div>
                      </div>

                      {/* Row 3: Batch */}
                      <div className="reg-detail-row">
                        <div className="reg-detail-label">
                          <GradCapFieldIcon className="reg-detail-icon" />
                          <span>Batch</span>
                        </div>
                        <div className="reg-detail-control">
                          <input
                            type="text"
                            required
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            placeholder="e.g. 2023 – 2027"
                            className="reg-detail-input"
                          />
                        </div>
                      </div>

                      {/* Row 4: Gender */}
                      <div className="reg-detail-row">
                        <div className="reg-detail-label">
                          <GenderFieldIcon className="reg-detail-icon" />
                          <span>Gender</span>
                        </div>
                        <div className="reg-detail-control">
                          <div className="reg-gender-pills" role="radiogroup" aria-label="Gender Selection">
                            <button
                              type="button"
                              role="radio"
                              aria-checked={gender === 'Male'}
                              className={`reg-gender-pill ${gender === 'Male' ? 'is-active' : ''}`}
                              onClick={() => setGender('Male')}
                            >
                              <MaleSymbolIcon />
                              <span>Male</span>
                            </button>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={gender === 'Female'}
                              className={`reg-gender-pill ${gender === 'Female' ? 'is-active' : ''}`}
                              onClick={() => setGender('Female')}
                            >
                              <FemaleSymbolIcon />
                              <span>Female</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Row 5: Food Option */}
                      <div className="reg-detail-row">
                        <div className="reg-detail-label">
                          <FoodUtensilsIcon className="reg-detail-icon" />
                          <span>Food Option</span>
                        </div>
                        <div className="reg-detail-control">
                          <div className="reg-gender-pills" role="radiogroup" aria-label="Food Option Selection">
                            <button
                              type="button"
                              role="radio"
                              aria-checked={foodPreference === 'Veg'}
                              className={`reg-gender-pill ${foodPreference === 'Veg' ? 'is-active is-veg' : ''}`}
                              onClick={() => setFoodPreference('Veg')}
                            >
                              <LeafVegIcon />
                              <span>Veg</span>
                            </button>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={foodPreference === 'Non-Veg'}
                              className={`reg-gender-pill ${foodPreference === 'Non-Veg' ? 'is-active is-nonveg' : ''}`}
                              onClick={() => setFoodPreference('Non-Veg')}
                            >
                              <MeatNonVegIcon />
                              <span>Non-Veg</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Row 5: Phone Number */}
                      <div className="reg-detail-row">
                        <div className="reg-detail-label">
                          <PhoneFieldIcon className="reg-detail-icon" />
                          <span>Phone Number</span>
                        </div>
                        <div className="reg-detail-control">
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter 10-digit mobile number"
                            className="reg-detail-input"
                          />
                        </div>
                      </div>

                      {/* Row 6: E-mail ID */}
                      <div className="reg-detail-row">
                        <div className="reg-detail-label">
                          <MailFieldIcon className="reg-detail-icon" />
                          <span>E-mail ID</span>
                        </div>
                        <div className="reg-detail-control">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@college.edu"
                            className="reg-detail-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Note footer inside Card 1 */}
                    <div className="reg-detail-note">
                      <InfoCircleIcon className="reg-detail-note-icon" />
                      <span>
                        Please enter your details clearly. Tick the events you wish to participate in.
                        {regTrack === 'olympia' ? ' Choose events matching your gender.' : ''}
                      </span>
                    </div>
                  </div>

                  {/* ============================================================
                      CARD 2: 4. CULTURAL EVENTS (or 4. OLYMPIA EVENTS)
                      ============================================================ */}
                  {regTrack === 'cultural' ? (
                    <div className="reg-card">
                      <div className="reg-card-head-between">
                        <div className="reg-card-title-group">
                          <MasksTheaterIcon className="reg-card-title-icon" />
                          <h3 className="reg-card-head-title">4. CULTURAL EVENTS</h3>
                        </div>
                        <span className="reg-badge-counter">{selectedCultural.length} Selected</span>
                      </div>

                      <p className="reg-card-desc">
                        Tick all cultural events you wish to participate in. If an event allows a team or group,
                        the organisers may collect additional participant details separately.
                      </p>

                      <div className="reg-events-grid-2col">
                        {CULTURAL_EVENTS_LIST.map((eventTitle) => {
                          const checked = selectedCultural.includes(eventTitle);
                          return (
                            <label
                              key={eventTitle}
                              className={`reg-event-tile ${checked ? 'is-checked' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleItem(selectedCultural, setSelectedCultural, eventTitle)
                                }
                              />
                              <span className="reg-tile-checkbox" aria-hidden="true" />
                              <span className="reg-tile-icon-wrap" aria-hidden="true">
                                {getEventIcon(eventTitle)}
                              </span>
                              <span className="reg-tile-text">{eventTitle}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="reg-card">
                      <div className="reg-card-head-between">
                        <div className="reg-card-title-group">
                          <TrophyOlympiaIcon className="reg-card-title-icon" />
                          <h3 className="reg-card-head-title">
                            4. OLYMPIA EVENTS — {gender === 'Male' ? 'MALE' : 'FEMALE'}
                          </h3>
                        </div>
                        <span className="reg-badge-counter">
                          {gender === 'Male'
                            ? `${selectedMaleSports.length} Selected`
                            : `${selectedFemaleSports.length} Selected`}
                        </span>
                      </div>

                      <p className="reg-card-desc">
                        Tick all sports events you wish to participate in ({gender} category). If an event
                        allows a team or squad, details will be confirmed prior to tournament fixtures.
                      </p>

                      <div className="reg-events-grid-2col">
                        {(gender === 'Male' ? SPORTS_EVENTS_MALE : SPORTS_EVENTS_FEMALE).map(
                          (sportTitle) => {
                            const checked =
                              gender === 'Male'
                                ? selectedMaleSports.includes(sportTitle)
                                : selectedFemaleSports.includes(sportTitle);
                            return (
                              <label
                                key={sportTitle}
                                className={`reg-event-tile ${checked ? 'is-checked' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    if (gender === 'Male') {
                                      toggleItem(
                                        selectedMaleSports,
                                        setSelectedMaleSports,
                                        sportTitle
                                      );
                                    } else {
                                      toggleItem(
                                        selectedFemaleSports,
                                        setSelectedFemaleSports,
                                        sportTitle
                                      );
                                    }
                                  }}
                                />
                                <span className="reg-tile-checkbox" aria-hidden="true" />
                                <span className="reg-tile-icon-wrap" aria-hidden="true">
                                  {getEventIcon(sportTitle)}
                                </span>
                                <span className="reg-tile-text">{sportTitle}</span>
                              </label>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* ============================================================
                      CARD 3: 🛡 STUDENT DECLARATION
                      ============================================================ */}
                  <div className="reg-card">
                    <div className="reg-card-title-group reg-card-title-group--spaced">
                      <ShieldCheckIcon className="reg-card-title-icon" />
                      <h3 className="reg-card-head-title">STUDENT DECLARATION</h3>
                    </div>

                    <label className={`reg-declaration-check ${declarationChecked ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={declarationChecked}
                        onChange={(e) => setDeclarationChecked(e.target.checked)}
                      />
                      <span className="reg-tile-checkbox" aria-hidden="true" />
                      <span className="reg-declaration-text">
                        I confirm that the information provided above is correct and that I wish to
                        register for the events selected.
                      </span>
                    </label>

                    <div className="reg-declaration-grid">
                      <div className="reg-declaration-field">
                        <div className="reg-sublabel">
                          <QuillPenIcon className="reg-sublabel-icon" />
                          <span>Student Signature</span>
                        </div>
                        <input
                          type="text"
                          value={signature}
                          onChange={(e) => setSignature(e.target.value)}
                          placeholder="Type full name as digital signature"
                          className="reg-detail-input"
                        />
                      </div>

                      <div className="reg-declaration-field">
                        <div className="reg-sublabel">
                          <CalendarFieldIcon className="reg-sublabel-icon" />
                          <span>Date</span>
                        </div>
                        <div className="reg-date-box">
                          <input
                            type="date"
                            value={regDate}
                            onChange={(e) => setRegDate(e.target.value)}
                            className="reg-date-input-hidden"
                            id="reg-date-picker"
                          />
                          <label htmlFor="reg-date-picker" className="reg-date-styled-display">
                            <span>{formatDateDisplay(regDate)}</span>
                            <CalendarFieldIcon className="reg-date-icon" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Error Notification */}
                  {formError && (
                    <p className="reg-form-error" role="alert">
                      {formError}
                    </p>
                  )}

                  {/* Centered Glowing Submit Button & Fest Tagline Footer */}
                  <div className="reg-submit-container">
                    <button type="submit" className="reg-submit-btn">
                      <span>SUBMIT REGISTRATION</span>
                      <ArrowRightIcon className="reg-submit-arrow" />
                    </button>
                    <div className="reg-footer-diamond">◆</div>
                    <p className="reg-footer-tagline">COLLEGE CULTURAL &amp; SPORTS FEST • 2026</p>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="modal-dialog"
            >
              <OrnateFrame variant="card">
                <div className="modal-dialog__body">
                  <div className="modal-dialog__header">
                    <div>
                      <h2 id="modal-title" className="modal-dialog__title">
                        {activeModal === 'brochure' && 'Official Event Brochure'}
                        {activeModal === 'events' && 'Events — Cultural &amp; Olympia Trials'}
                        {activeModal === 'teams' && 'Teams — Form Your House Squad'}
                        {activeModal === 'leaderboard' && 'Leaderboard — Track Your Progress'}
                        {activeModal === 'rules' && 'Rules &amp; Guidelines'}
                        {activeModal === 'about' && 'About — Zenforianz'}
                        {activeModal === 'contact' && 'Contact — Zenforianz Secretariat'}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="modal-dialog__close"
                      aria-label="Close dialog"
                      onClick={() => setActiveModal(null)}
                    >
                      ×
                    </button>
                  </div>

                {activeModal === 'brochure' && (
                  <div className="modal-dialog__content">
                    <p className="modal-dialog__text">
                      The College Cultural &amp; Sports Fest features two grand tracks under the
                      Slytherin House Event: <strong>Cultural Events</strong> (44 stage, literary, fine
                      arts, medical quiz &amp; gaming competitions) and <strong>Olympia Events</strong> (13 Male &amp;
                      13 Female sports championships).
                    </p>
                    <div className="reg-choice-grid">
                      <div className="reg-choice-card reg-choice-card--static">
                        <span className="reg-choice-card__title">Cultural Events (44)</span>
                        <span className="reg-choice-card__desc">
                          Group Dance, Adapt Tunes, Replica, Solo Western, Solo Classical, Duet Dancing, Band,
                          Solo Instrumental, Solo/Duet Singing, Fashion Show, Debate, Short Film,
                          Marrow Med Quiz, Elocution, JAM, Essay, Poetry, Ads, Fine Arts, Photography, Reels,
                          PUBG, Free Fire, COD, Clash Royale &amp; IPL Auction.
                        </span>
                      </div>
                      <div className="reg-choice-card reg-choice-card--static">
                        <span className="reg-choice-card__title">Olympia Sports (26)</span>
                        <span className="reg-choice-card__desc">
                          <strong>Male:</strong> Cricket, Futsal, Football, Volleyball, Beach
                          Volleyball, Kho-Kho, Chess, Carrom, Table Tennis, Badminton, Basketball
                          (5&rsquo;s &amp; 3&rsquo;s), Athletics.
                          <br />
                          <strong>Female:</strong> Futsal, Volleyball, Throwball, Kho-Kho, Leg Cricket,
                          Turf Cricket, Chess, Carrom, Table Tennis, Badminton, Basketball (5&rsquo;s
                          &amp; 3&rsquo;s), Athletics.
                        </span>
                      </div>
                    </div>
                    <div className="modal-form__actions modal-form__actions--split">
                      <ChamferButton
                        variant="secondary"
                        href="/slytherin-brochure.pdf"
                        target="_blank"
                        download="Slytherin'26 Brochure.pdf"
                      >
                        <DocumentBrochureIcon />
                        <span>Download Brochure (PDF)</span>
                      </ChamferButton>
                      <ChamferButton variant="primary" onClick={openRegistrationPicker}>
                        <span>Register Now</span>
                        <ArrowRightIcon />
                      </ChamferButton>
                    </div>
                  </div>
                )}

                {activeModal === 'events' && (
                  <div className="modal-dialog__content">
                    <p className="modal-dialog__text">
                      Select an event category below to view and register for all official competitions:
                    </p>
                    <div className="reg-choice-grid">
                      <button
                        type="button"
                        className="reg-choice-card"
                        onClick={() => {
                          setSubmittedRecord(null);
                          setFormError(null);
                          setRegTrack('cultural');
                          setActiveModal('register');
                        }}
                      >
                        <span className="reg-choice-card__icon" aria-hidden="true">
                          <ScrollQuillCardIcon />
                        </span>
                        <span className="reg-choice-card__title">Cultural Event</span>
                        <span className="reg-choice-card__desc">
                          Explore &amp; tick from all 44 Cultural Events
                        </span>
                        <span className="reg-choice-card__cta">
                          <span>Register Cultural</span>
                          <ArrowRightIcon />
                        </span>
                      </button>
                      <button
                        type="button"
                        className="reg-choice-card"
                        onClick={() => {
                          setSubmittedRecord(null);
                          setFormError(null);
                          setRegTrack('olympia');
                          setActiveModal('register');
                        }}
                      >
                        <span className="reg-choice-card__icon" aria-hidden="true">
                          <LaurelTrophyCardIcon />
                        </span>
                        <span className="reg-choice-card__title">Olympia Event</span>
                        <span className="reg-choice-card__desc">
                          Explore &amp; tick from Male &amp; Female Sports Events
                        </span>
                        <span className="reg-choice-card__cta">
                          <span>Register Olympia</span>
                          <ArrowRightIcon />
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'teams' && (
                  <div className="modal-dialog__content">
                    <p className="modal-dialog__text">
                      Assemble your House delegation for Group Dance, Band, Duet Dancing, Short Film, IPL
                      Auction, or Olympia team sports (Cricket, Football, Futsal, Volleyball,
                      Throwball, Kho-Kho, Basketball).
                    </p>
                    <div className="modal-form__actions">
                      <ChamferButton variant="primary" onClick={openRegistrationPicker}>
                        <span>Register Your Participation</span>
                        <ArrowRightIcon />
                      </ChamferButton>
                    </div>
                  </div>
                )}

                {activeModal === 'leaderboard' && (
                  <div className="modal-dialog__content">
                    <ul className="modal-list">
                      {LEADERBOARD_DATA.map((row) => (
                        <li key={row.rank} className="modal-list__item modal-list__item--row">
                          <span className="modal-list__tag">#{row.rank}</span>
                          <div className="modal-list__grow">
                            <strong className="modal-list__heading">{row.squad}</strong>
                            <p className="modal-list__sub">Captain: {row.captain}</p>
                          </div>
                          <span className="modal-list__points">{row.points}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeModal === 'rules' && (
                  <div className="modal-dialog__content">
                    <ul className="modal-list">
                      <li className="modal-list__item">
                        <span className="modal-list__tag">I</span>
                        <p className="modal-list__sub">
                          Please enter your Student Details clearly (Name, Registration No., Batch,
                          Gender, Phone Number, and E-mail ID).
                        </p>
                      </li>
                      <li className="modal-list__item">
                        <span className="modal-list__tag">II</span>
                        <p className="modal-list__sub">
                          For Olympia Sports Events, choose sports events only from the section matching
                          your gender (Male or Female).
                        </p>
                      </li>
                      <li className="modal-list__item">
                        <span className="modal-list__tag">III</span>
                        <p className="modal-list__sub">
                          For Cultural Events, tick all cultural events you wish to participate in. If
                          an event allows a team or group, the organisers may collect additional
                          participant details separately.
                        </p>
                      </li>
                    </ul>
                  </div>
                )}

                {activeModal === 'about' && (
                  <p className="modal-dialog__text">
                    Presented by Zenforianz, the Slytherin House Event hosts the
                    College Cultural &amp; Sports Fest — uniting Cultural artistry and Olympia athletic
                    excellence.
                  </p>
                )}

                {activeModal === 'contact' && (
                  <p className="modal-dialog__text">
                    Zenforianz Secretariat • College Cultural &amp; Sports Fest Desk •
                    Official dispatches available via Discord, Instagram, YouTube, and X.
                  </p>
                )}
              </div>
            </OrnateFrame>
          </div>
        )}
      </div>
    )}
    </div>
  );
}

export default App;
