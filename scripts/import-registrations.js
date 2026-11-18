// One-time: copy data/registrations.json into Supabase. Safe to re-run (skips existing pass IDs).
// Usage: npm run import-registrations
import 'dotenv/config';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
const file = 'data/registrations.json';
if (!fs.existsSync(file)) {
  console.log('Nothing to import (data/registrations.json not found).');
  process.exit(0);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const list = JSON.parse(fs.readFileSync(file, 'utf-8'));
let added = 0;
let skipped = 0;
let maxSeq = 1000;

for (const r of list.reverse()) {
  const n = Number(String(r.passId).replace(/\D/g, ''));
  if (n > maxSeq) maxSeq = n;
  const { error } = await sb.from('registrations').insert({
    pass_id: r.passId,
    registration_key: String(r.registrationNo).trim().toUpperCase(),
    registration_no: r.registrationNo,
    student_name: r.studentName,
    batch: r.batch || '',
    gender: r.gender === 'Female' ? 'Female' : 'Male',
    food_preference: r.foodPreference === 'Non-Veg' ? 'Non-Veg' : 'Veg',
    phone: r.phone || '',
    email: r.email || '',
    track: r.track,
    selected_events: r.selectedEvents || [],
    signature: r.signature || '',
    reg_date: r.date || '',
    created_at: r.createdAt || new Date().toISOString(),
    attendance_scanned: !!r.attendanceScanned,
    attendance_scanned_at: r.attendanceScannedAt || null,
    food_scanned: !!r.foodScanned,
    food_scanned_at: r.foodScannedAt || null,
  });
  if (error) {
    if (error.code === '23505') skipped++;
    else {
      console.error(`Failed ${r.passId}:`, error.message);
      process.exit(1);
    }
  } else added++;
}

const { error: seqErr } = await sb.rpc('set_pass_seq', { n: maxSeq });
if (seqErr) console.warn('Could not bump pass sequence:', seqErr.message);
console.log(`✓ Imported ${added}, skipped ${skipped} already present. Next pass ID: SLY-${maxSeq + 1}`);

