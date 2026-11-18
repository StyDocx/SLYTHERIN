import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { store, clean } from './store.js';
import {
  adminRouter,
  authConfigured,
  createLimiter,
  csrfGuard,
  demoMode,
  requireAdmin,
} from './adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(path.dirname(__filename), '..');

const app = express();
const IS_PROD = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);

// Enable CORS for local Vite dev server, localhost, and Vercel domains
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    origin &&
    (/^https?:\/\/(localhost|127\.0\.0\.1):(5173|3000)$/.test(origin) ||
      /^https:\/\/([a-z0-9-]+)\.vercel\.app$/.test(origin) ||
      origin === 'https://slytherin-eight.vercel.app')
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Security headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https://flqqzwybapmhihaqplfk.supabase.co https://*.supabase.co https://*.vercel.app",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  if (IS_PROD) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

app.use(express.json({ limit: '100kb' }));
app.use('/api', csrfGuard);

if (demoMode) {
  console.warn(
    '🧪 DEMO MODE: Supabase not configured. Sign in at /admin/login with admin@example.com / Slytherin@Demo2026 (disabled when NODE_ENV=production).'
  );
} else if (!authConfigured) {
  console.warn('⚠️  Supabase env vars missing. Admin login & admin APIs are DISABLED.');
}

app.use('/api/admin', adminRouter);

const registerLimiter = createLimiter({ windowMs: 10 * 60_000, max: 30 });

const STORE_LABEL = store.mode === 'supabase' ? 'Supabase (Postgres)' : 'local JSON file (DEV ONLY)';
console.log(`🗄️  Registration storage: ${STORE_LABEL}`);

/** Pushes a change to the Google Sheet webhook. Never blocks or breaks the request. */
async function syncToGoogleSheet(action, payload) {
  try {
    const { googleSheetWebhookUrl } = await store.getSettings();
    if (!googleSheetWebhookUrl) return { synced: false, reason: 'No webhook URL configured' };
    const res = await fetch(googleSheetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, timestamp: new Date().toISOString(), ...payload }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.warn(`Google Sheet sync ${action} failed: HTTP ${res.status}`);
    return { synced: res.ok, status: res.status };
  } catch (err) {
    console.warn(`Google Sheet sync ${action} error:`, String(err));
    return { synced: false, reason: String(err) };
  }
}

const serverError = (res, err) => {
  console.error(err);
  return res.status(500).json({ error: 'Server error. Please try again.' });
};

// 1. GET All Registrations + Stats + Google Sheet Settings (admin only)
app.get('/api/registrations', requireAdmin, async (req, res) => {
  try {
    const registrations = await store.list();
    const settings = await store.getSettings();
    res.json({
      registrations,
      stats: {
        total: registrations.length,
        paidCount: registrations.filter((r) => r.paid).length,
        attendanceCount: registrations.filter((r) => r.attendanceScanned).length,
        foodCount: registrations.filter((r) => r.foodScanned).length,
      },
      googleSheetWebhookUrl: settings.googleSheetWebhookUrl || '',
    });
  } catch (err) {
    serverError(res, err);
  }
});

// 2. POST Create Registration (public) → saved to DB, then pushed to Google Sheet
app.post('/api/registrations', async (req, res) => {
  const ipKey = req.ip || 'unknown';
  if (registerLimiter.isLimited(ipKey)) {
    return res.status(429).json({ error: 'Too many registrations from this network. Try again later.' });
  }
  registerLimiter.hit(ipKey);

  const body = req.body || {};
  const studentName = clean(body.studentName, 120);
  const payload = {
    studentName,
    registrationNo: clean(body.registrationNo, 40),
    batch: clean(body.batch, 40),
    gender: body.gender === 'Female' ? 'Female' : 'Male',
    foodPreference: body.foodPreference === 'Non-Veg' ? 'Non-Veg' : 'Veg',
    phone: clean(body.phone, 20),
    email: clean(body.email, 254),
    track: body.track === 'Olympia Event' ? 'Olympia Event' : 'Cultural Event',
    selectedEvents: Array.isArray(body.selectedEvents)
      ? body.selectedEvents.slice(0, 60).map((e) => clean(e, 80)).filter(Boolean)
      : [],
    signature: clean(body.signature || studentName, 120),
    date: clean(body.date || new Date().toISOString().split('T')[0], 20),
  };

  if (!payload.studentName || !payload.registrationNo || payload.selectedEvents.length === 0) {
    return res.status(400).json({
      error: 'Student Name, Registration No., and at least one selected event are required.',
    });
  }

  try {
    const { record, updatedExisting } = await store.upsert(payload);
    syncToGoogleSheet(updatedExisting ? 'UPSERT_REGISTRATION' : 'NEW_REGISTRATION', { registration: record });
    return res.status(updatedExisting ? 200 : 201).json({ registration: record, updatedExisting });
  } catch (err) {
    return serverError(res, err);
  }
});

// 3 & 4. Scanners (admin only, strict single-scan enforced atomically in the DB)
const scanHandler = (kind) => async (req, res) => {
  try {
    const confirmPaid = Boolean(req.body?.confirmPaid);
    const result = await store.scan(kind, req.body?.code, req.admin.email, confirmPaid);
    if (result.status === 'NOT_FOUND') {
      return res.status(404).json({
        status: 'NOT_FOUND',
        message: 'No registered participant found matching this QR Code or Registration Number.',
      });
    }
    const r = result.record;
    if (result.status === 'PAYMENT_REQUIRED') {
      return res.status(200).json({
        status: 'PAYMENT_REQUIRED',
        message: result.message,
        registration: r,
      });
    }
    if (result.status === 'ALREADY_SCANNED') {
      return res.status(409).json({
        status: 'ALREADY_SCANNED',
        message:
          kind === 'attendance'
            ? `DUPLICATE SCAN BLOCKED: ${r.studentName} (${r.registrationNo}) has already been scanned for Attendance! One person cannot be scanned twice.`
            : `FOOD COUNTER DENIED: ${r.studentName} (${r.registrationNo}) has already used their Food Counter pass! Cannot be scanned more than once.`,
        registration: r,
      });
    }
    syncToGoogleSheet(kind === 'attendance' ? 'ATTENDANCE_SCAN' : 'FOOD_SCAN', { registration: r });
    return res.status(200).json({
      status: 'SUCCESS',
      message:
        kind === 'attendance'
          ? `ATTENDANCE RECORDED: ${r.studentName} (${r.registrationNo}) verified for ${r.track}.`
          : `FOOD COUNTER APPROVED: ${r.studentName} (${r.registrationNo}) may enter inside.`,
      registration: r,
    });
  } catch (err) {
    return serverError(res, err);
  }
};
app.post('/api/scan/attendance', requireAdmin, scanHandler('attendance'));
app.post('/api/scan/food', requireAdmin, scanHandler('food'));

// Toggle / update payment status (admin only)
app.post('/api/registrations/:passId/payment', requireAdmin, async (req, res) => {
  const { passId } = req.params;
  const paid = Boolean(req.body?.paid);
  try {
    const updated = await store.setPayment(passId, paid, req.admin.email);
    if (!updated) {
      return res.status(404).json({ error: 'Registration not found.' });
    }
    syncToGoogleSheet('PAYMENT_UPDATE', { registration: updated });
    return res.json({ registration: updated });
  } catch (err) {
    return serverError(res, err);
  }
});

// 5. Configure & sync Google Sheet webhook (admin only)
app.post('/api/gsheet/config', requireAdmin, async (req, res) => {
  const cleaned = String(req.body?.googleSheetWebhookUrl || '').trim();
  if (cleaned) {
    let u;
    try {
      u = new URL(cleaned);
    } catch {
      return res.status(400).json({ error: 'Invalid URL.' });
    }
    if (u.protocol !== 'https:' || !/(^|\.)(script\.google\.com|script\.googleusercontent\.com)$/.test(u.hostname)) {
      return res.status(400).json({ error: 'Webhook must be an https Google Apps Script URL.' });
    }
  }
  try {
    await store.setSettings({ googleSheetWebhookUrl: cleaned });
    const syncResult = cleaned
      ? await syncToGoogleSheet('FULL_SYNC', { registrations: await store.list() })
      : { synced: false };
    res.json({ googleSheetWebhookUrl: cleaned, syncResult });
  } catch (err) {
    serverError(res, err);
  }
});

app.post('/api/gsheet/sync', requireAdmin, async (req, res) => {
  try {
    const registrations = await store.list();
    const syncResult = await syncToGoogleSheet('FULL_SYNC', { registrations });
    res.json({ syncResult, count: registrations.length });
  } catch (err) {
    serverError(res, err);
  }
});

// 6. Export Google Sheets compatible CSV (admin only)
app.get('/api/export/csv', requireAdmin, async (req, res) => {
  let registrations;
  try {
    registrations = await store.list();
  } catch (err) {
    return serverError(res, err);
  }
  const headers = [
    'Pass ID', 'Registration No', 'Student Name', 'Batch', 'Gender', 'Food Option', 'Payment Status', 'Paid At', 'Phone Number', 'Email ID',
    'Event Track', 'Registered Events', 'Attendance Status', 'Attendance Scanned At',
    'Food Counter Status', 'Food Scanned At', 'Registered At',
  ];
  const escapeCsv = (val) => {
    let str = String(val ?? '');
    if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`; // block CSV/formula injection
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const rows = registrations.map((r) =>
    [
      r.passId, r.registrationNo, r.studentName, r.batch, r.gender, r.foodPreference || 'Veg',
      r.paid ? 'PAID' : 'UNPAID', r.paidAt || '',
      r.phone, r.email, r.track,
      (r.selectedEvents || []).join('; '),
      r.attendanceScanned ? 'PRESENT' : 'PENDING', r.attendanceScannedAt || '',
      r.foodScanned ? 'USED (ENTERED)' : 'UNUSED', r.foodScannedAt || '',
      r.createdAt || '',
    ].map(escapeCsv).join(',')
  );
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="slytherin_registrations_google_sheet.csv"');
  res.send('\uFEFF' + [headers.join(','), ...rows].join('\r\n'));
});

// Serve public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve production build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Return 404 for missing static assets instead of SPA index.html fallback
app.use(['/assets', '/images', '/fonts', '/video'], (req, res) => {
  res.status(404).end();
});

// Unknown API routes must never fall through to the SPA
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

export default app;

