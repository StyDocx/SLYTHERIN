# SLYTHERIN OLYMPIA 2026 — Inter-College Grand Wizarding Symposium

> *"AMBITION HAS NO LIMITS."*  
> *"WHERE AMBITION MEETS MAGIC."*

An extraordinary, cinematic, and fully interactive inter-college wizarding event website crafted as a living extension of the **Slytherin Olympia 2026** poster.

---

## 🏰 Visual Identity & Palette

- **Deep Emerald Green:** `#003B2D`
- **Dark Forest Green:** `#001C16`
- **Enchanted Green:** `#08734B`
- **Antique Gold:** `#C9A44C`
- **Metallic Gold:** `#E6C66F`
- **Silver:** `#C6C9C8`
- **Parchment:** `#D9C99F`
- **Charcoal Black:** `#090D0B`

---

## ⚡ Tech Stack & Architecture

- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Visuals & 3D:** HTML5 2D/3D Canvas volumetric mist & embers simulation, CSS 3D perspective transforms with real-time cursor tilt physics, floating animated candles, and procedural parchment effects.
- **Sound System:** Pure procedural **Web Audio API** engine. Synthesizes ambient castle cathedral drones, wind pink-noise, distant thunder rumbles, ascending crystalline wand sparkles, heavy door rumbles, parchment page turns, and wax seal thumps without external network dependencies or copyright issues.
- **Backend & Database:** Node.js, Express, REST APIs (`/api/events`, `/api/registrations`, `/api/stats`, `/api/export-csv`), persistent JSON database with automatic seeding.

---

## 🌟 Interactive Experiences

1. **Cinematic Opening (The Arrival at Hogwarts):**
   - **Scene 1:** Darkness, distant wind, green fog awakening.
   - **Scene 2:** Spired Hogwarts castle awakening with illuminated gothic windows, lightning, and flying owl silhouettes.
   - **Scene 3:** 3D rotating metallic serpent emblem reflecting emerald light, displaying *"AMBITION HAS NO LIMITS"*.
   - **Scene 4:** Antique-gold *"ENTER THE CASTLE"* button with spell burst and door transition, plus a cinematic skip option.

2. **Living Poster Hero Section:**
   - 3D parallax silhouette castle with glowing windows and floating lanterns.
   - Specular metallic Slytherin serpent crest responding dynamically to cursor position.
   - Institutional insignias (Hogwarts Academy, Salazar Research Foundation).
   - Real-time tournament countdown timer to 14 March 2026.

3. **The Great Hall (Event Discovery):**
   - Floating enchanted candles with flickering physics.
   - 5 magical division gateways: **Technical**, **Non-Technical**, **Cultural**, **Gaming**, and **Special**.

4. **The 10 Event Chambers:**
   - Unfolds as an ancient leather-bound grimoire.
   - Filter by category and search by spell/chamber keyword.
   - Complete with dates, times, venues, bounties (Galleons), team/solo requirements, regulations, and coordinator owl post contacts.

5. **The Marauder's Map:**
   - Activates with *"I solemnly swear that I am up to no good"* and conceals with *"Mischief Managed"*.
   - Animated wandering footsteps (*Draco Malfoy*, *Severus Vance*, *Head Prefect*).
   - Clickable interactive chambers showing live trials and presiding wizards with teleportation jump.

6. **The Slytherin Common Room:**
   - Subterranean lake dungeon with caustic reflections and shadows outside underwater gothic windows.
   - 3D cursor-tracking silver-gold reliquary.
   - Roaring emerald hearth and interactive Ambition Oracle.

7. **Tournament Schedule:**
   - Day 1 (14 March 2026) and Day 2 (15 March 2026) timeline with status badges (*Live Now*, *Upcoming*).

8. **The Spellbook of Rules:**
   - 5 interactive parchment chapters: Code of Assembly, Wand & Hardware Protocol, Delegation Eligibility, Galleon Exchange, and FAQ.

9. **Acceptance Letter Registration:**
   - Official invitation format on textured aged parchment.
   - Live client/server validation and unique Reference ID generation (`SLY-2026-XXXX`).
   - Sealed with an official red wax insignia, celebratory golden confetti, and instant printing/download capability.

10. **The Gallery of Wizards:**
    - Moving portraits with subtle levitation and living frames for faculty and student conveners.

11. **Admin Chamber Portal:**
    - Secured by passcode: `slytherin2026`.
    - Event CRUD (add/edit/delete chambers).
    - Participant list management with status toggle (*Confirmed* vs *Pending*).
    - 1-click **Export to CSV** for participant rolls.
    - Real-time treasury & registration analytics.

12. **Magical Audio Sanctuary:**
    - Floating crystal orb controller with volume slider, mute toggle, ambience toggle, SFX toggle, and castle resonance switcher (*Towers*, *Dungeons*, *Great Hall*).

---

## 🚀 Running the Application

### Development Mode (Vite Hot-Reload):
```bash
npm run dev
```
Runs at `http://localhost:5173`.

### Full-Stack Production Mode:
```bash
npm run build
npm start
```
Runs both the REST API backend and the built frontend at `http://localhost:3000`.

### Admin Access:
- Click the key icon in the navigation bar.
- Passcode: `slytherin2026`
