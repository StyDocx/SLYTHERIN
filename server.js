import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial seed data helper
function getInitialData() {
  return {
    events: [
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
          'Strict wand-check: zero plagiarism or unapproved magical assistants.',
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
          { name: 'Dr. Salazar V. Sterling', title: 'Dean of Research & Innovation', phone: '+91 98400 99881', owlEmail: 'dean.research@slytherin-olympia.org' }
        ]
      }
    ],
    registrations: [
      {
        id: 'reg-001',
        referenceId: 'SLY-2026-9481',
        eventId: 'sly-tech-01',
        eventName: 'Parseltongue Compiler: Dark Web of Algorithms',
        fullName: 'Alexander Blackthorn',
        email: 'alex.blackthorn@durmstrang.edu',
        phone: '+91 98401 11223',
        college: 'Imperial Institute of Arcane Technology',
        department: 'Computer Science & Sorcery',
        year: '3rd Year',
        participationType: 'Solo',
        status: 'Confirmed',
        timestamp: '2026-03-01T10:15:30Z'
      },
      {
        id: 'reg-002',
        referenceId: 'SLY-2026-7729',
        eventId: 'sly-spec-01',
        eventName: 'The Salazar Slytherin Grand Project Olympiad',
        fullName: 'Cassandra Vane',
        email: 'cassandra.vane@ravenclaw.ac.uk',
        phone: '+91 98840 22334',
        college: 'Royal College of Arithmancy & AI',
        department: 'Biotechnology & Hextech Systems',
        year: '4th Year',
        participationType: 'Team',
        teamName: 'The Serpent Synthesizers',
        teamMembers: 'Cassandra Vane, Julian Rosier, Elena Greengrass',
        status: 'Confirmed',
        timestamp: '2026-03-02T14:22:10Z'
      }
    ],
    announcements: [
      {
        id: 'ann-1',
        title: 'Registration Portals Are Officially Sealed Open!',
        content: 'All inter-college delegations may register their wizards for the 10 competitive chambers before midnight 10 March 2026.',
        timestamp: '14 March 2026',
        type: 'urgent'
      }
    ]
  };
}

// Database helper functions
function loadData() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return getInitialData();
  }
}

function saveData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// --- API ROUTES ---

// GET /api/events
app.get('/api/events', (req, res) => {
  const data = loadData();
  res.json(data.events || []);
});

// POST /api/events (Admin create event)
app.post('/api/events', (req, res) => {
  const data = loadData();
  const newEvent = {
    id: `sly-custom-${Date.now()}`,
    name: req.body.name || 'Untitled Magical Event',
    category: req.body.category || 'Technical',
    tagline: req.body.tagline || 'Honor the code of Slytherin.',
    description: req.body.description || 'Chamber description pending.',
    date: req.body.date || 'Day 1 — 14 March 2026',
    time: req.body.time || '10:00 AM',
    venue: req.body.venue || 'The Great Hall',
    fee: req.body.fee || '150 Galleons',
    participation: req.body.participation || 'Solo',
    rules: Array.isArray(req.body.rules) ? req.body.rules : ['Observe tournament protocol.'],
    prizes: req.body.prizes || '5,000 Galleons + Trophy',
    maxParticipants: req.body.maxParticipants || 50,
    chamberName: req.body.chamberName || 'The Ancient Chamber',
    iconName: req.body.iconName || 'Sparkles',
    badge: req.body.badge || req.body.category,
    coordinators: req.body.coordinators || [
      { name: 'Prefect in Charge', title: 'Coordinator', phone: '+91 90000 00000', owlEmail: 'prefect@slytherin-olympia.org' }
    ]
  };
  data.events = [newEvent, ...(data.events || [])];
  saveData(data);
  res.status(201).json(newEvent);
});

// PUT /api/events/:id
app.put('/api/events/:id', (req, res) => {
  const data = loadData();
  const idx = data.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Event not found in the tournament scrolls.' });
  }
  data.events[idx] = { ...data.events[idx], ...req.body };
  saveData(data);
  res.json(data.events[idx]);
});

// DELETE /api/events/:id
app.delete('/api/events/:id', (req, res) => {
  const data = loadData();
  data.events = data.events.filter(e => e.id !== req.params.id);
  saveData(data);
  res.json({ message: 'Event banished from tournament records.' });
});

// GET /api/registrations
app.get('/api/registrations', (req, res) => {
  const data = loadData();
  res.json(data.registrations || []);
});

// POST /api/registrations (Acceptance Letter registration)
app.post('/api/registrations', (req, res) => {
  const {
    eventId,
    eventName,
    fullName,
    email,
    phone,
    college,
    department,
    year,
    participationType,
    teamName,
    teamMembers
  } = req.body;

  if (!fullName || !email || !college || !department) {
    return res.status(400).json({ error: 'Mandatory wizard credentials missing.' });
  }

  const data = loadData();
  const referenceNumber = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `SLY-2026-${referenceNumber}`;

  const newRegistration = {
    id: `reg-${Date.now()}`,
    referenceId,
    eventId: eventId || 'general',
    eventName: eventName || 'Slytherin Olympia Tournament',
    fullName,
    email,
    phone: phone || 'Unlisted Owl',
    college,
    department,
    year: year || '1st Year',
    participationType: participationType || 'Solo',
    teamName: teamName || '',
    teamMembers: teamMembers || '',
    status: 'Confirmed',
    timestamp: new Date().toISOString()
  };

  data.registrations = [newRegistration, ...(data.registrations || [])];
  saveData(data);

  res.status(201).json({
    success: true,
    message: 'Acceptance parchment sealed and recorded in Hogwarts registers.',
    registration: newRegistration
  });
});

// PUT /api/registrations/:id/status
app.put('/api/registrations/:id/status', (req, res) => {
  const { status } = req.body;
  const data = loadData();
  const reg = data.registrations.find(r => r.id === req.params.id);
  if (!reg) {
    return res.status(404).json({ error: 'Registration record not found.' });
  }
  reg.status = status;
  saveData(data);
  res.json(reg);
});

// DELETE /api/registrations/:id
app.delete('/api/registrations/:id', (req, res) => {
  const data = loadData();
  data.registrations = data.registrations.filter(r => r.id !== req.params.id);
  saveData(data);
  res.json({ message: 'Record erased.' });
});

// GET /api/stats (Live dashboard analytics)
app.get('/api/stats', (req, res) => {
  const data = loadData();
  const regs = data.registrations || [];
  const events = data.events || [];

  const totalRegistrations = regs.length;
  const verifiedCount = regs.filter(r => r.status === 'Confirmed').length;
  const estimatedRevenue = regs.reduce((sum, r) => sum + 150, 0); // Galleons estimate

  // Category breakdown
  const categoryCount = {};
  regs.forEach(r => {
    const ev = events.find(e => e.id === r.eventId);
    const cat = ev ? ev.category : 'General';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  res.json({
    totalRegistrations,
    verifiedCount,
    estimatedRevenue,
    categoryCount,
    totalEvents: events.length
  });
});

// GET /api/export-csv
app.get('/api/export-csv', (req, res) => {
  const data = loadData();
  const regs = data.registrations || [];

  const headers = ['Reference ID', 'Full Name', 'Email', 'Phone', 'College', 'Department', 'Year', 'Event Name', 'Type', 'Team Name', 'Team Members', 'Status', 'Date'];
  const rows = regs.map(r => [
    `"${r.referenceId}"`,
    `"${r.fullName}"`,
    `"${r.email}"`,
    `"${r.phone}"`,
    `"${r.college.replace(/"/g, '""')}"`,
    `"${r.department.replace(/"/g, '""')}"`,
    `"${r.year}"`,
    `"${r.eventName.replace(/"/g, '""')}"`,
    `"${r.participationType}"`,
    `"${(r.teamName || '').replace(/"/g, '""')}"`,
    `"${(r.teamMembers || '').replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${r.timestamp}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="slytherin_olympia_2026_participants.csv"');
  res.send(csvContent);
});

// GET /api/announcements
app.get('/api/announcements', (req, res) => {
  const data = loadData();
  res.json(data.announcements || []);
});

// Serve frontend if built
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🏰 Slytherin Olympia 2026 Sanctuary Backend running on port ${PORT}`);
});
