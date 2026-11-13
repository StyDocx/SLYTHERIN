import { EventItem, WizardProfile, ScheduleItem, Announcement } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'sly-tech-01',
    name: 'Parseltongue Compiler: Dark Web of Algorithms',
    category: 'Technical',
    tagline: 'Only the cunning unravel the serpent’s recursive cipher.',
    description: 'A high-intensity algorithmic competition where contestants must decipher enchanted cryptic code snippets, optimize asymptotic complexity, and neutralize malicious memory hexes under strict time constraints.',
    date: 'Day 1 — 14 March 2026',
    time: '10:00 AM – 01:00 PM',
    venue: 'Dungeons & Alchemy Computing Lab, Chamber III',
    fee: '150 Galleons (₹150) per wizard',
    participation: 'Solo or Duo',
    rules: [
      'Contestants may summon solutions in C++, Python, Java, or Rust.',
      'Strict wand-check (compiler inspection): zero plagiarism or unapproved magical assistants.',
      'Round 1: Rapid-fire syntax hexes (45 mins). Round 2: Algorithmic labyrinth optimization (75 mins).',
      'The Grand Inquisitor’s decision is final and binding.'
    ],
    prizes: 'First Place: 10,000 Galleons (₹10,000) + Golden Serpent Trophy | Runner-up: 5,000 Galleons',
    maxParticipants: 60,
    chamberName: 'The Parseltongue Terminal',
    iconName: 'Code',
    badge: 'Competitive Programming',
    featured: true,
    coordinators: [
      { name: 'Dr. Valerius Blackwood', title: 'Grand Arithmancer', phone: '+91 98401 23456', owlEmail: 'v.blackwood@slytherin-olympia.org' },
      { name: 'Lady Genevieve Malfoy', title: 'Student Prefect', phone: '+91 94451 98765', owlEmail: 'g.malfoy@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-tech-02',
    name: 'Hex-Web Sorcery: Dark Arts Interface Design',
    category: 'Technical',
    tagline: 'Weave visual enchantments that mesmerize human perception.',
    description: 'An elite frontend engineering and UI/UX design duel. Participants are given a mystical theme and 3 hours to architect a visually stunning, responsive, and animated web experience utilizing modern shaders, 3D canvases, or micro-interactions.',
    date: 'Day 1 — 14 March 2026',
    time: '02:00 PM – 05:00 PM',
    venue: 'The Astronomy Tower Interactive Suite',
    fee: '200 Galleons (₹200) per team',
    participation: 'Team (2-3 Wizards)',
    rules: [
      'Teams must build live from scratch using React, Vue, Three.js, or vanilla WebGL.',
      'Judged on Gothic aesthetic integrity, responsiveness, accessibility, and 60 FPS performance.',
      'All spells (assets) must be properly credited or procedurally generated.',
      'Deployment to a live portal is mandatory before the final hour chimes.'
    ],
    prizes: 'First Place: 8,000 Galleons + Obsidian Wand of Design | Runner-up: 4,000 Galleons',
    maxParticipants: 40,
    chamberName: 'The Lumos Design Guild',
    iconName: 'Layout',
    badge: 'UI/UX & WebGL',
    featured: true,
    coordinators: [
      { name: 'Prof. Severus Vance', title: 'Master of Enchanted Interfaces', phone: '+91 98840 55123', owlEmail: 's.vance@slytherin-olympia.org' },
      { name: 'Rowena Thorne', title: 'Chief Web Alchemist', phone: '+91 97910 44321', owlEmail: 'r.thorne@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-tech-03',
    name: 'Potions & Alchemy: Full-Stack Debugging Draughts',
    category: 'Technical',
    tagline: 'Detect the fatal bug before the cauldron boils over.',
    description: 'A perilous reverse-engineering and bug hunting crucible. Competitors are plunged into broken legacy codebases teeming with concurrency race conditions, poisoned memory leaks, and broken security tokens.',
    date: 'Day 2 — 15 March 2026',
    time: '09:30 AM – 12:30 PM',
    venue: 'Potions Master Laboratory, Lower Vaults',
    fee: '150 Galleons (₹150) per participant',
    participation: 'Solo',
    rules: [
      'Three broken repositories will be injected into each participant’s chamber.',
      'Time penalty applied for incorrect patches.',
      'Automated test suites will grade the safety and speed of fixes in real time.',
      'Strict zero-communication embargo during the trial.'
    ],
    prizes: 'First Place: 7,500 Galleons + Golden Cauldron Medal | Runner-up: 3,500 Galleons',
    maxParticipants: 50,
    chamberName: 'Cauldron Core Chambers',
    iconName: 'Terminal',
    badge: 'Systems & Debugging',
    coordinators: [
      { name: 'Marcus Flint', title: 'Systems Warden', phone: '+91 99620 11223', owlEmail: 'm.flint@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-nontech-01',
    name: 'The Wizengamot Trials: Dark Arts Parliamentary Debate',
    category: 'Non-Technical',
    tagline: 'Words sharper than the finest silver blade.',
    description: 'The supreme parliamentary debating tournament of the wizarding realms. Orators must defend, dissect, and propose provocative magical ethics, AI regulations, autonomous curses, and interplanetary magical treaties.',
    date: 'Day 1 — 14 March 2026',
    time: '11:00 AM – 03:00 PM',
    venue: 'The High Council Chamber of the Great Hall',
    fee: '250 Galleons (₹250) per delegation',
    participation: 'Team of 2 (Government & Opposition)',
    rules: [
      'Asian Parliamentary format with modified wizarding adjudication rules.',
      'Preparation time: Exactly 15 minutes upon release of the mysterious scroll topic.',
      'Points of Information (POIs) allowed between the 1st and 6th minute.',
      'Decorum of noble house standing must be strictly maintained at all times.'
    ],
    prizes: 'First Place: 8,000 Galleons + Silver Gavel of Salazar | Best Orator: 2,500 Galleons',
    maxParticipants: 32,
    chamberName: 'The High Wizengamot',
    iconName: 'Award',
    badge: 'Parliamentary Debate',
    coordinators: [
      { name: 'Baroness Morag MacDougal', title: 'Senior Adjudicator', phone: '+91 98412 88990', owlEmail: 'm.macdougal@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-nontech-02',
    name: 'Chamber of Secrets: Cryptic Campus Scavenger Hunt',
    category: 'Non-Technical',
    tagline: 'Follow the ancient footsteps inscribed in the stones.',
    description: 'A high-octane physical and intellectual quest spanning the labyrinthine corridors, hidden courtyards, and ancient libraries. Decipher riddles written in invisible ink, unlock locked parchment boxes, and reach the final crest first.',
    date: 'Day 2 — 15 March 2026',
    time: '01:30 PM – 04:30 PM',
    venue: 'Courtyard of the Serpent (Starting Point)',
    fee: '300 Galleons (₹300) per clan',
    participation: 'Team (3-4 Members)',
    rules: [
      'Clues will be revealed progressively upon solving the prior location’s puzzle.',
      'No motorized brooms or electronic tracking artifacts allowed.',
      'First clan to arrive at the Chamber of Salazar with the sealed golden talisman triumphs.',
      'Time bonus awarded for speed cipher decipherment.'
    ],
    prizes: 'First Place: 10,000 Galleons + Salazar’s Emerald Medallion | Runner-up: 5,000 Galleons',
    maxParticipants: 80,
    chamberName: 'The Serpent Labyrinth',
    iconName: 'Compass',
    badge: 'Treasure Hunt & Cryptography',
    featured: true,
    coordinators: [
      { name: 'Cassius Warrington', title: 'Master of Mysteries', phone: '+91 99403 66778', owlEmail: 'c.warrington@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-cult-01',
    name: 'The Yule Ball: Gothic Symphony & Theatrical Dance',
    category: 'Cultural',
    tagline: 'Where shadows dance to ancient melodies.',
    description: 'A celebration of cinematic music, gothic choreography, dark classical renditions, and breathtaking theatrical presence on the Great Hall stage illuminated by floating enchanted candles.',
    date: 'Day 1 — 14 March 2026',
    time: '05:30 PM – 09:00 PM',
    venue: 'The Grand Stage of the Great Hall',
    fee: '350 Galleons (₹350) per troupe',
    participation: 'Group (4-10 Performers) or Solo',
    rules: [
      'Time limit: Maximum 8 minutes on stage including setup.',
      'Costumes must reflect gothic medieval, Victorian, or wizarding house elegance.',
      'Props and magical stage effects must receive prior clearance from the stage warden.',
      'Soundtrack audio files must be submitted via owl (admin upload) 2 hours in advance.'
    ],
    prizes: 'First Place: 12,000 Galleons + Silver Lyre Trophy | Runner-up: 6,000 Galleons',
    maxParticipants: 100,
    chamberName: 'The Yule Ball Pavilion',
    iconName: 'Music',
    badge: 'Music & Dance',
    coordinators: [
      { name: 'Madame Celeste Rosier', title: 'Directress of Performing Arts', phone: '+91 98404 12399', owlEmail: 'c.rosier@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-cult-02',
    name: 'Pensieve Portraits: Gothic Photography & Short Film',
    category: 'Cultural',
    tagline: 'Capture the soul of the castle through the glass lens.',
    description: 'Visual artists and cinematographers capture the moody, cinematic textures of Slytherin Olympia 2026. Photographers must capture the contrast between golden warmth and emerald shadows.',
    date: 'Day 2 — 15 March 2026',
    time: '10:00 AM – 03:00 PM',
    venue: 'Viaduct Bridge & Gothic Cloisters',
    fee: '100 Galleons (₹100) per artist',
    participation: 'Solo',
    rules: [
      'All captures must be taken on event premises during the two festival days.',
      'Color grading must honor the Slytherin emerald & gold palette.',
      'Submissions to be uploaded to the Pensieve Gallery by 03:00 PM on Day 2.',
      'Judged by renowned visual cinematographers.'
    ],
    prizes: 'First Place: 5,000 Galleons + Obsidian Lens Award | Best Portrait: 2,500 Galleons',
    maxParticipants: 45,
    chamberName: 'The Pensieve Gallery',
    iconName: 'Camera',
    badge: 'Cinematography',
    coordinators: [
      { name: 'Julian Avery', title: 'Keeper of Moving Visuals', phone: '+91 98844 77881', owlEmail: 'j.avery@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-game-01',
    name: 'Quidditch Esports Arena: Valorant & BGMI Showdown',
    category: 'Gaming',
    tagline: 'Precision, reflexes, and cold-blooded tactical dominance.',
    description: 'The premier tactical esports duel of Olympia 2026. Top college teams clash in high-tier tactical FPS skirmishes cast live with cinematic commentary on the enchanted Great Hall jumbotrons.',
    date: 'Day 1 & Day 2 — 14-15 March 2026',
    time: '11:00 AM – 06:00 PM',
    venue: 'The Slytherin Common Room Esports Arena',
    fee: '400 Galleons (₹400) per squad',
    participation: 'Team (5 Players + 1 Sub)',
    rules: [
      'Standard competitive ruleset, best of 3 for preliminary brackets, best of 5 for grand finals.',
      'BYOD or utilize the tournament provided high-refresh rate obsidian battle stations.',
      'Any toxic hexes or unsportsmanlike behavior results in immediate forfeiture.',
      'Anti-cheat spells active throughout all match rounds.'
    ],
    prizes: 'Championship Trophy + 15,000 Galleons | Runner-up: 7,500 Galleons',
    maxParticipants: 120,
    chamberName: 'The Quidditch Esports Deck',
    iconName: 'Gamepad2',
    badge: 'Competitive Esports',
    featured: true,
    coordinators: [
      { name: 'Viktor Krum Jr.', title: 'Grand Esports Marshal', phone: '+91 97909 33221', owlEmail: 'v.krum@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-game-02',
    name: 'Grandmaster’s Wizard Chess: Blitz & Tactics',
    category: 'Gaming',
    tagline: 'Sacrifice pieces with calculated cold brilliance.',
    description: 'Classical chess transformed into an intense blitz spectacle. Live giant stone pieces strike on the digital board as grandmasters calculate ten moves ahead in silence.',
    date: 'Day 2 — 15 March 2026',
    time: '10:30 AM – 02:00 PM',
    venue: 'The Underground Chess Vault',
    fee: '100 Galleons (₹100) per player',
    participation: 'Solo',
    rules: [
      'FIDE Blitz rules apply: 3 minutes + 2 seconds increment per move.',
      'Swiss system preliminary tournament followed by top-8 knockout bracket.',
      'Touch-move rule strictly enforced by the Arbiter.',
      'Tiebreaks settled via sudden death Armageddon duel.'
    ],
    prizes: 'First Place: 6,000 Galleons + Carved Onyx Chess Set | Runner-up: 3,000 Galleons',
    maxParticipants: 64,
    chamberName: 'The Chess Vault',
    iconName: 'Shield',
    badge: 'Strategy & Blitz Chess',
    coordinators: [
      { name: 'Bartholomew Carrow', title: 'Grandmaster Arbiter', phone: '+91 99401 88229', owlEmail: 'b.carrow@slytherin-olympia.org' }
    ]
  },
  {
    id: 'sly-spec-01',
    name: 'The Salazar Slytherin Grand Project Olympiad',
    category: 'Special',
    tagline: 'Build innovations that push beyond the boundaries of magic and science.',
    description: 'The flagship centerpiece exhibition of Slytherin Olympia 2026. Multi-disciplinary teams exhibit breakthrough hardware innovations, intelligent systems, biotechnology, and autonomous robotics to industry pioneers and academic deans.',
    date: 'Day 2 — 15 March 2026',
    time: '10:00 AM – 04:00 PM',
    venue: 'The Great Hall Central Exhibition Arcade',
    fee: '500 Galleons (₹500) per innovation clan',
    participation: 'Team (2-5 Creators)',
    rules: [
      'Working functional prototypes are strictly required; theoretical posters alone are insufficient.',
      'Evaluation criteria: Technological novelty, societal impact, execution rigor, and commercial viability.',
      'Each team receives 10 minutes of pitch time followed by 5 minutes of jury cross-examination.',
      'Top 3 teams receive incubation grants and patent support.'
    ],
    prizes: 'Grand Trophy: 25,000 Galleons (₹25,000) + Venture Incubation Support | Runner-up: 12,000 Galleons',
    maxParticipants: 50,
    chamberName: 'The Grand Oculus Arcade',
    iconName: 'Sparkles',
    badge: 'Flagship Innovation Expo',
    featured: true,
    coordinators: [
      { name: 'Dr. Salazar V. Sterling', title: 'Dean of Research & Innovation', phone: '+91 98400 99881', owlEmail: 'dean.research@slytherin-olympia.org' },
      { name: 'Miss Seraphina Lestrange', title: 'Lead Student Convener', phone: '+91 94440 11992', owlEmail: 's.lestrange@slytherin-olympia.org' }
    ]
  }
];

export const INITIAL_WIZARDS: WizardProfile[] = [
  {
    id: 'wiz-01',
    name: 'Dr. Salazar V. Sterling',
    role: 'Patron & Chief Patronus',
    title: 'Dean of Advanced Research',
    department: 'School of Advanced Technology & Wizarding Sciences',
    house: 'Slytherin',
    specialty: 'High-Order Arithmancy & Quantum Sorcery',
    quote: 'True intellect is not loud; it is calculated, deliberate, and undeniably triumphant.',
    portraitSymbol: 'crown'
  },
  {
    id: 'wiz-02',
    name: 'Prof. Severus Vance',
    role: 'Faculty Convener',
    title: 'Head of Department of Magical Computing',
    department: 'Department of Computing & Digital Sorcery',
    house: 'Slytherin',
    specialty: 'Distributed Systems & Defensive Hexes',
    quote: 'We do not merely teach you to write code; we teach you to command the digital ether.',
    portraitSymbol: 'wand'
  },
  {
    id: 'wiz-03',
    name: 'Miss Seraphina Lestrange',
    role: 'President of Slytherin Council',
    title: 'Overall Student Convener',
    department: 'Final Year, Computer Science & Sorcery',
    house: 'Slytherin',
    specialty: 'Algorithmic Optimization & Leadership',
    quote: 'Olympia 2026 is built on unyielding ambition. We set the standard; others merely watch.',
    portraitSymbol: 'serpent'
  },
  {
    id: 'wiz-04',
    name: 'Rowena Thorne',
    role: 'Chief Technical Architect',
    title: 'Lead Web Alchemist & Graphics Wizard',
    department: 'Information Alchemy & Visual Design',
    house: 'Slytherin',
    specialty: 'WebGL Shaders & Spatial Interfaces',
    quote: 'Every pixel is a spell. Craft it with conviction or do not cast at all.',
    portraitSymbol: 'sparkles'
  },
  {
    id: 'wiz-05',
    name: 'Viktor Krum Jr.',
    role: 'Head of Tournaments & Esports',
    title: 'Sports & Gaming Coordinator',
    department: 'Physical Sorcery & Tactical Studies',
    house: 'Durmstrang / Slytherin Allied',
    specialty: 'Competitive Tactics & Live Adjudication',
    quote: 'In the arena, hesitating for a single microsecond means defeat. Stay sharp.',
    portraitSymbol: 'target'
  },
  {
    id: 'wiz-06',
    name: 'Lady Genevieve Malfoy',
    role: 'Public Relations & Protocol',
    title: 'Warden of Dignitaries & Media',
    department: 'Diplomatic Wizarding Affairs',
    house: 'Slytherin',
    specialty: 'International Inter-College Relations',
    quote: 'Prestige is not inherited; it is demonstrated at every turn of the tournament.',
    portraitSymbol: 'feather'
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-01',
    day: 1,
    time: '08:30 AM – 09:30 AM',
    event: 'The Grand Entrance & Hogwarts Ingathering',
    category: 'Special',
    venue: 'Great Hall Main Portico',
    status: 'Upcoming',
    description: 'Registration verification, badge allotment, and welcoming draught in the emerald courtyard.'
  },
  {
    id: 'sch-02',
    day: 1,
    time: '09:30 AM – 10:30 AM',
    event: 'Ceremonial Lighting of the Serpent Brazier',
    category: 'Special',
    venue: 'Great Hall High Dais',
    status: 'Upcoming',
    description: 'Inaugural address by the Dean of Research and the sorting of tournament delegations.'
  },
  {
    id: 'sch-03',
    day: 1,
    time: '10:30 AM – 01:30 PM',
    event: 'Parseltongue Compiler: Round 1 & 2',
    category: 'Technical',
    venue: 'Dungeons & Alchemy Computing Lab',
    status: 'Upcoming',
    description: 'High-speed algorithmic duel against time and complex edge cases.'
  },
  {
    id: 'sch-04',
    day: 1,
    time: '11:00 AM – 03:00 PM',
    event: 'The Wizengamot Trials (Debate Prelims)',
    category: 'Non-Technical',
    venue: 'The High Council Chamber',
    status: 'Upcoming',
    description: 'Fiery parliamentary deliberations on emerging tech regulations and ethical boundaries.'
  },
  {
    id: 'sch-05',
    day: 1,
    time: '02:00 PM – 05:00 PM',
    event: 'Hex-Web Sorcery (UI/UX 3-Hour Hack)',
    category: 'Technical',
    venue: 'The Astronomy Tower Interactive Suite',
    status: 'Upcoming',
    description: 'Crafting responsive, shader-driven portals from ground zero.'
  },
  {
    id: 'sch-06',
    day: 1,
    time: '05:30 PM – 08:30 PM',
    event: 'The Yule Ball: Grand Cultural Showcase',
    category: 'Cultural',
    venue: 'The Grand Stage of the Great Hall',
    status: 'Upcoming',
    description: 'Cinematic music, choreography, and dramatic presentations under the enchanted sky.'
  },
  {
    id: 'sch-07',
    day: 2,
    time: '09:30 AM – 12:30 PM',
    event: 'Potions & Alchemy: Full-Stack Debugging',
    category: 'Technical',
    venue: 'Potions Master Laboratory, Lower Vaults',
    status: 'Upcoming',
    description: 'Deconstruct corrupted code and race against automated testing oracles.'
  },
  {
    id: 'sch-08',
    day: 2,
    time: '10:00 AM – 04:00 PM',
    event: 'The Salazar Slytherin Grand Project Olympiad',
    category: 'Special',
    venue: 'The Great Hall Central Exhibition Arcade',
    status: 'Upcoming',
    description: 'Flagship hardware and AI innovation exhibition evaluated by industry deans.'
  },
  {
    id: 'sch-09',
    day: 2,
    time: '01:30 PM – 04:30 PM',
    event: 'Chamber of Secrets: Cryptic Campus Hunt',
    category: 'Non-Technical',
    venue: 'Courtyard of the Serpent (Campus-Wide)',
    status: 'Upcoming',
    description: 'Campus-wide cryptographic trail to unlock the ancient talisman.'
  },
  {
    id: 'sch-10',
    day: 2,
    time: '05:00 PM – 07:00 PM',
    event: 'Valedictory & Best Delegation Coronation',
    category: 'Special',
    venue: 'The Great Hall High Dais',
    status: 'Upcoming',
    description: 'Awarding of Galleons, the House Cup, and the closing anthem of Olympia 2026.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Registration Portals Are Officially Sealed Open!',
    content: 'All inter-college delegations may register their wizards for the 10 competitive chambers before midnight 10 March 2026.',
    timestamp: 'Today at 09:00 AM',
    type: 'urgent'
  },
  {
    id: 'ann-2',
    title: 'The Marauder’s Map Has Revealed Secret Footsteps',
    content: 'Inspect the interactive map on the navigation deck to uncover all 6 event venues and their current trial status.',
    timestamp: 'Yesterday at 04:30 PM',
    type: 'info'
  },
  {
    id: 'ann-3',
    title: 'Official Acceptance Letters Ready for Instant Printing',
    content: 'Upon completing your registration submission, your personalized Hogwarts Acceptance Letter is immediately signed and stamped with the wax seal.',
    timestamp: '2 days ago',
    type: 'scroll'
  }
];
