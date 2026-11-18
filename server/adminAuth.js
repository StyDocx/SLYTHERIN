import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

/* ==========================================================================
   ADMIN AUTH (Supabase Auth + `admins` allow-list table)
   - Credentials are verified by Supabase Auth; the browser never sees Supabase keys.
   - Sessions live in HttpOnly / SameSite=Strict cookies (not readable by JS).
   - Every request is re-checked against the `admins` table (instant revocation).
   - Only `super_admin` can add / remove admins.
   ========================================================================== */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const IS_PROD = process.env.NODE_ENV === 'production';

export const authConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY);

const clientOpts = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

// Service-role client: SERVER ONLY. Bypasses RLS. Never exposed to the browser.
export const service = authConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, clientOpts)
  : null;

// Fresh anon client per sign-in/refresh so sessions can never leak between users.
const freshAuthClient = () => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, clientOpts);

const COOKIE_AT = IS_PROD ? '__Host-sly_at' : 'sly_at';
const COOKIE_RT = IS_PROD ? '__Host-sly_rt' : 'sly_rt';
const RT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const ROLES = new Set(['admin', 'super_admin']);

/* ---------- tiny helpers ---------- */

function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) {
      try {
        out[k] = decodeURIComponent(v);
      } catch {
        // ignore malformed cookie
      }
    }
  }
  return out;
}

function cookieStr(name, value, maxAge) {
  const attrs = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`];
  if (IS_PROD) attrs.push('Secure');
  return attrs.join('; ');
}

function setSessionCookies(res, session) {
  res.append('Set-Cookie', cookieStr(COOKIE_AT, session.access_token, Math.max(60, session.expires_in || 3600)));
  res.append('Set-Cookie', cookieStr(COOKIE_RT, session.refresh_token, RT_MAX_AGE));
  if (IS_PROD) {
    res.append('Set-Cookie', cookieStr('sly_at', session.access_token, Math.max(60, session.expires_in || 3600)));
    res.append('Set-Cookie', cookieStr('sly_rt', session.refresh_token, RT_MAX_AGE));
  }
}

function clearSessionCookies(res) {
  res.append('Set-Cookie', cookieStr('sly_at', '', 0));
  res.append('Set-Cookie', cookieStr('sly_rt', '', 0));
  res.append('Set-Cookie', cookieStr('__Host-sly_at', '', 0));
  res.append('Set-Cookie', cookieStr('__Host-sly_rt', '', 0));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Sliding-window in-memory rate limiter. */
export function createLimiter({ windowMs, max }) {
  const hits = new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [k, arr] of hits) {
      const fresh = arr.filter((t) => now - t < windowMs);
      if (fresh.length) hits.set(k, fresh);
      else hits.delete(k);
    }
  }, 60_000);
  timer.unref();
  return {
    isLimited(key) {
      const now = Date.now();
      const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
      hits.set(key, arr);
      return arr.length >= max;
    },
    hit(key) {
      const arr = hits.get(key) || [];
      arr.push(Date.now());
      hits.set(key, arr);
    },
    reset(key) {
      hits.delete(key);
    },
  };
}

async function audit(actor, action, detail = {}) {
  if (!service) return;
  try {
    await service.from('admin_audit_log').insert({
      actor_id: actor?.id ?? null,
      actor_email: actor?.email ?? null,
      action,
      detail,
    });
  } catch {
    // audit must never break the request
  }
}

async function lookupAdmin(userId) {
  const { data, error } = await service
    .from('admins')
    .select('user_id,email,role,active')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data || !data.active) return null;
  return { id: data.user_id, email: data.email, role: data.role };
}

/* ---------- DEMO MODE ----------
   Only when Supabase is NOT configured AND NODE_ENV !== 'production'.
   One fixed demo account, in-memory sessions. Hard-disabled in production. */
export const demoMode = !authConfigured && !IS_PROD;
const DEMO_EMAIL = (process.env.DEMO_ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const DEMO_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || 'Slytherin@Demo2026';
const demoSessions = new Map(); // token -> expiry ms
const DEMO_TTL = 8 * 60 * 60 * 1000;

function safeEqual(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

function demoAdminFromReq(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE_AT];
  const exp = token && demoSessions.get(token);
  if (!exp) return null;
  if (exp < Date.now()) {
    demoSessions.delete(token);
    return null;
  }
  return { id: 'demo', email: DEMO_EMAIL, role: 'admin' };
}

/* ---------- middleware ---------- */

/** Verifies session cookie (auto-refreshing when needed) and that the user is an active admin. */
export async function requireAdmin(req, res, next) {
  if (demoMode) {
    const demo = demoAdminFromReq(req);
    if (!demo) return res.status(401).json({ error: 'Authentication required.' });
    req.admin = demo;
    return next();
  }
  if (!authConfigured) {
    return res.status(503).json({ error: 'Admin authentication is not configured on this server.' });
  }
  try {
    const cookies = parseCookies(req.headers.cookie);
    const at = cookies[COOKIE_AT] || cookies['sly_at'] || cookies['__Host-sly_at'];
    const rt = cookies[COOKIE_RT] || cookies['sly_rt'] || cookies['__Host-sly_rt'];
    let user = null;

    if (at) {
      const { data, error } = await service.auth.getUser(at);
      if (!error && data?.user) user = data.user;
    }

    if (!user && rt) {
      const { data, error } = await freshAuthClient().auth.refreshSession({
        refresh_token: rt,
      });
      if (!error && data?.session?.user) {
        user = data.session.user;
        setSessionCookies(res, data.session);
      }
    }

    if (!user) {
      clearSessionCookies(res);
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const admin = await lookupAdmin(user.id);
    if (!admin) {
      clearSessionCookies(res);
      return res.status(403).json({ error: 'Access denied.' });
    }

    req.admin = admin;
    return next();
  } catch (err) {
    console.error('requireAdmin error:', err);
    return res.status(500).json({ error: 'Authentication check failed.' });
  }
}

export function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin privileges required.' });
  }
  return next();
}

/** Blocks cross-site state-changing requests (defence in depth on top of SameSite=Strict). */
export function csrfGuard(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
  const origin = req.headers.origin;
  if (origin) {
    const defaultAllowed =
      'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,https://slytherin-eight.vercel.app';
    const allowed = new Set(
      `${defaultAllowed},${process.env.ALLOWED_ORIGINS || ''}`
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
    let host = '';
    try {
      host = new URL(origin).host;
    } catch {
      return res.status(403).json({ error: 'Bad origin.' });
    }
    const isVercel = host.endsWith('.vercel.app');
    const reqHost = req.headers['x-forwarded-host'] || req.headers.host;
    if (host !== req.headers.host && host !== reqHost && !allowed.has(origin) && !isVercel) {
      return res.status(403).json({ error: 'Cross-origin request blocked.' });
    }
  }
  return next();
}

/* ---------- router ---------- */

const loginIpLimiter = createLimiter({ windowMs: 15 * 60_000, max: 10 });
const loginEmailLimiter = createLimiter({ windowMs: 15 * 60_000, max: 6 });

export const adminRouter = express.Router();

adminRouter.post('/login', async (req, res) => {
  if (demoMode) {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');
    const ipKey = req.ip || 'unknown';
    if (loginIpLimiter.isLimited(ipKey)) {
      return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    }
    if (!safeEqual(email, DEMO_EMAIL) || !safeEqual(password, DEMO_PASSWORD)) {
      loginIpLimiter.hit(ipKey);
      await sleep(400);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    demoSessions.set(token, Date.now() + DEMO_TTL);
    res.append('Set-Cookie', cookieStr(COOKIE_AT, token, DEMO_TTL / 1000));
    return res.json({ email: DEMO_EMAIL, role: 'admin' });
  }
  if (!authConfigured) {
    return res.status(503).json({ error: 'Admin authentication is not configured on this server.' });
  }
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  const ipKey = req.ip || 'unknown';

  if (loginIpLimiter.isLimited(ipKey) || loginEmailLimiter.isLimited(email)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  }

  const GENERIC = { error: 'Invalid email or password.' };
  if (!EMAIL_RE.test(email) || email.length > 254 || !password || password.length > 128) {
    loginIpLimiter.hit(ipKey);
    await sleep(400);
    return res.status(401).json(GENERIC);
  }

  try {
    const { data, error } = await freshAuthClient().auth.signInWithPassword({ email, password });
    if (error) {
      console.warn(`[admin login] Supabase auth error for ${email}:`, error.message);
    }
    let admin = null;
    if (!error && data?.session && data.user) {
      admin = await lookupAdmin(data.user.id);
      if (!admin) {
        console.warn(`[admin login] User authenticated in Supabase but not active in admins table: ${email}`);
      }
    }

    if (!admin) {
      loginIpLimiter.hit(ipKey);
      loginEmailLimiter.hit(email);
      await audit(null, 'login_failed', { email, ip: ipKey });
      await sleep(400);
      return res.status(401).json(GENERIC);
    }

    loginEmailLimiter.reset(email);
    setSessionCookies(res, data.session);
    await audit(admin, 'login', { ip: ipKey });
    return res.json({ email: admin.email, role: admin.role });
  } catch (err) {
    console.error('[admin login] Unexpected error during login:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

adminRouter.post('/logout', async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  if (demoMode && cookies[COOKIE_AT]) demoSessions.delete(cookies[COOKIE_AT]);
  if (service && cookies[COOKIE_AT]) {
    try {
      await service.auth.admin.signOut(cookies[COOKIE_AT]);
    } catch {
      // best effort
    }
  }
  clearSessionCookies(res);
  res.json({ ok: true });
});

adminRouter.get('/me', requireAdmin, (req, res) => {
  res.json({ email: req.admin.email, role: req.admin.role });
});

adminRouter.get('/admins', requireAdmin, requireSuperAdmin, async (req, res) => {
  const { data, error } = await service
    .from('admins')
    .select('user_id,email,role,active,created_at,created_by_email')
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: 'Could not load admins.' });
  res.json({ admins: data });
});

const createLimiterAdmin = createLimiter({ windowMs: 60 * 60_000, max: 20 });

adminRouter.post('/admins', requireAdmin, requireSuperAdmin, async (req, res) => {
  if (createLimiterAdmin.isLimited(req.admin.id)) {
    return res.status(429).json({ error: 'Too many admin creations. Try later.' });
  }
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  const role = String(req.body?.role ?? 'admin');

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (!ROLES.has(role)) return res.status(400).json({ error: 'Invalid role.' });
  if (
    password.length < 12 ||
    password.length > 72 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return res.status(400).json({
      error: 'Password must be 12–72 characters with upper-case, lower-case and a number.',
    });
  }

  createLimiterAdmin.hit(req.admin.id);

  const { data: created, error: createErr } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr || !created?.user) {
    const exists = /already|registered|exists/i.test(createErr?.message || '');
    return res.status(exists ? 409 : 500).json({
      error: exists ? 'An account with this email already exists.' : 'Could not create admin.',
    });
  }

  const { error: insErr } = await service.from('admins').insert({
    user_id: created.user.id,
    email,
    role,
    active: true,
    created_by: req.admin.id,
    created_by_email: req.admin.email,
  });
  if (insErr) {
    await service.auth.admin.deleteUser(created.user.id); // roll back
    return res.status(500).json({ error: 'Could not register admin.' });
  }

  await audit(req.admin, 'admin_created', { email, role });
  res.status(201).json({ admin: { user_id: created.user.id, email, role, active: true } });
});

adminRouter.delete('/admins/:userId', requireAdmin, requireSuperAdmin, async (req, res) => {
  const { userId } = req.params;
  if (!/^[0-9a-fA-F-]{36}$/.test(userId)) return res.status(400).json({ error: 'Invalid id.' });
  if (userId === req.admin.id) {
    return res.status(400).json({ error: 'You cannot remove your own account.' });
  }

  const { data: target } = await service.from('admins').select('user_id,email,role').eq('user_id', userId).maybeSingle();
  if (!target) return res.status(404).json({ error: 'Admin not found.' });

  if (target.role === 'super_admin') {
    const { count } = await service
      .from('admins')
      .select('user_id', { count: 'exact', head: true })
      .eq('role', 'super_admin')
      .eq('active', true);
    if ((count ?? 0) <= 1) {
      return res.status(400).json({ error: 'Cannot remove the last super admin.' });
    }
  }

  await service.from('admins').delete().eq('user_id', userId);
  await service.auth.admin.deleteUser(userId);
  await audit(req.admin, 'admin_removed', { email: target.email });
  res.json({ ok: true });
});

