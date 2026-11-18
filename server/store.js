import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authConfigured, service } from './adminAuth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'registrations.json');
const settingsFile = path.join(dataDir, 'settings.json');

/* ---------- code parsing (QR payload / pass id / reg no) ---------- */

/** Returns candidate lookups in priority order. */
function codeCandidates(rawCode) {
  const cleaned = String(rawCode ?? '').trim().slice(0, 500);
  if (!cleaned) return [];
  const out = [];
  if (cleaned.startsWith('SLY|')) {
    const [, passId = '', regNo = ''] = cleaned.split('|');
    if (passId.trim()) out.push({ field: 'passId', value: passId.trim().toUpperCase() });
    if (regNo.trim()) out.push({ field: 'registrationNo', value: regNo.trim().toUpperCase() });
  } else if (cleaned.startsWith('{')) {
    try {
      const obj = JSON.parse(cleaned);
      if (obj.passId) out.push({ field: 'passId', value: String(obj.passId).toUpperCase() });
      if (obj.registrationNo) out.push({ field: 'registrationNo', value: String(obj.registrationNo).toUpperCase() });
    } catch {
      // ignore
    }
  }
  const upper = cleaned.toUpperCase();
  out.push({ field: 'passId', value: upper }, { field: 'registrationNo', value: upper });
  return out;
}

const clean = (v, n) => String(v ?? '').trim().slice(0, n);
const keyOf = (regNo) => String(regNo).trim().toUpperCase();

/* ==========================================================================
   SUPABASE STORE (production)
   ========================================================================== */

const toRecord = (r) => ({
  passId: r.pass_id,
  qrPayload: r.qr_payload,
  studentName: r.student_name,
  registrationNo: r.registration_no,
  batch: r.batch,
  gender: r.gender,
  foodPreference: r.food_preference || r.foodPreference || 'Veg',
  phone: r.phone,
  email: r.email,
  track: r.track,
  selectedEvents: r.selected_events || [],
  signature: r.signature,
  date: r.reg_date,
  createdAt: r.created_at,
  attendanceScanned: r.attendance_scanned,
  attendanceScannedAt: r.attendance_scanned_at,
  attendanceScannedBy: r.attendance_scanned_by,
  foodScanned: r.food_scanned,
  foodScannedAt: r.food_scanned_at,
  foodScannedBy: r.food_scanned_by,
  paid: Boolean(r.paid),
  paidAt: r.paid_at || r.paidAt || null,
  paidBy: r.paid_by || r.paidBy || null,
});

const COLUMN = { passId: 'pass_id', registrationNo: 'registration_key' };

const supabaseStore = {
  mode: 'supabase',

  async list() {
    const rows = [];
    const PAGE = 1000;
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await service
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from + PAGE - 1);
      if (error) throw error;
      rows.push(...data);
      if (data.length < PAGE) break;
    }

    // Load payment fallback map from app_settings (if DB column hasn't migrated yet)
    const payMap = new Map();
    try {
      const { data: paySettings } = await service
        .from('app_settings')
        .select('key,value')
        .like('key', 'paid:%');
      if (paySettings) {
        for (const item of paySettings) {
          try {
            const pass = item.key.slice(5);
            payMap.set(pass, JSON.parse(item.value));
          } catch {}
        }
      }
    } catch {}

    return rows.map((r) => {
      const rec = toRecord(r);
      if (payMap.has(rec.passId)) {
        const info = payMap.get(rec.passId);
        rec.paid = Boolean(info.paid);
        rec.paidAt = info.at || null;
        rec.paidBy = info.by || null;
      }
      return rec;
    });
  },

  async find(rawCode) {
    for (const c of codeCandidates(rawCode)) {
      const { data, error } = await service
        .from('registrations')
        .select('*')
        .eq(COLUMN[c.field], c.value)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      if (data?.length) {
        const rec = toRecord(data[0]);
        try {
          const { data: pSet } = await service
            .from('app_settings')
            .select('value')
            .eq('key', `paid:${rec.passId}`)
            .maybeSingle();
          if (pSet?.value) {
            const info = JSON.parse(pSet.value);
            rec.paid = Boolean(info.paid);
            rec.paidAt = info.at || null;
            rec.paidBy = info.by || null;
          }
        } catch {}
        return rec;
      }
    }
    return null;
  },

  async upsert(p) {
    const registration_key = keyOf(p.registrationNo);
    const fields = {
      registration_no: p.registrationNo,
      student_name: p.studentName,
      batch: p.batch,
      gender: p.gender,
      food_preference: p.foodPreference || 'Veg',
      phone: p.phone,
      email: p.email,
      signature: p.signature,
      reg_date: p.date,
    };

    const update = async () => {
      const { data: existing, error } = await service
        .from('registrations')
        .select('*')
        .eq('registration_key', registration_key)
        .eq('track', p.track)
        .maybeSingle();
      if (error) throw error;
      if (!existing) return null;
      const merged = Array.from(new Set([...(existing.selected_events || []), ...p.selectedEvents]));
      const { data, error: upErr } = await service
        .from('registrations')
        .update({ ...fields, selected_events: merged })
        .eq('id', existing.id)
        .select('*')
        .single();
      if (upErr) throw upErr;
      return { record: toRecord(data), updatedExisting: true };
    };

    const found = await update();
    if (found) return found;

    const { data, error } = await service
      .from('registrations')
      .insert({ ...fields, registration_key, track: p.track, selected_events: p.selectedEvents })
      .select('*')
      .single();
    if (error) {
      if (error.code === '23505') {
        const retry = await update();
        if (retry) return retry;
      }
      throw error;
    }
    return { record: toRecord(data), updatedExisting: false };
  },

  async setPayment(passId, paid, adminEmail) {
    const isPaid = Boolean(paid);
    const at = isPaid ? new Date().toISOString() : null;
    const by = isPaid ? adminEmail : null;

    // Try direct column update on registrations table
    try {
      const { data, error } = await service
        .from('registrations')
        .update({ paid: isPaid, paid_at: at, paid_by: by })
        .eq('pass_id', passId)
        .select('*');
      if (!error && data?.length) {
        return toRecord(data[0]);
      }
    } catch {}

    // Fallback store in app_settings table
    try {
      await service
        .from('app_settings')
        .upsert({ key: `paid:${passId}`, value: JSON.stringify({ paid: isPaid, at, by }) });
    } catch {}

    const rec = await this.find(passId);
    if (rec) {
      rec.paid = isPaid;
      rec.paidAt = at;
      rec.paidBy = by;
    }
    return rec;
  },

  /** Atomic single-scan: validates payment status & enforces one scan per badge. */
  async scan(kind, rawCode, adminEmail, confirmPaid = false) {
    const record = await this.find(rawCode);
    if (!record) return { status: 'NOT_FOUND' };

    // If student is NOT paid and scanner did not confirm payment yet:
    if (!record.paid && !confirmPaid) {
      return {
        status: 'PAYMENT_REQUIRED',
        message: `PAYMENT PENDING: ${record.studentName} (${record.registrationNo}) has not paid registration fee. Confirm payment?`,
        record,
      };
    }

    // If confirmPaid is true and record wasn't paid yet, mark paid in DB
    if (!record.paid && confirmPaid) {
      await this.setPayment(record.passId, true, adminEmail);
      record.paid = true;
      record.paidAt = new Date().toISOString();
      record.paidBy = adminEmail;
    }

    const p = kind === 'attendance'
      ? { flag: 'attendance_scanned', at: 'attendance_scanned_at', by: 'attendance_scanned_by' }
      : { flag: 'food_scanned', at: 'food_scanned_at', by: 'food_scanned_by' };

    const { data, error } = await service
      .from('registrations')
      .update({ [p.flag]: true, [p.at]: new Date().toISOString(), [p.by]: adminEmail })
      .eq('pass_id', record.passId)
      .eq(p.flag, false)
      .select('*');
    if (error) throw error;
    if (!data?.length) {
      const current = await this.find(record.passId);
      return { status: 'ALREADY_SCANNED', record: current || record };
    }
    const updated = toRecord(data[0]);
    updated.paid = record.paid;
    updated.paidAt = record.paidAt;
    updated.paidBy = record.paidBy;
    return { status: 'SUCCESS', record: updated };
  },

  async getSettings() {
    const { data } = await service.from('app_settings').select('value').eq('key', 'googleSheetWebhookUrl').maybeSingle();
    return { googleSheetWebhookUrl: data?.value || process.env.GOOGLE_SHEET_WEBHOOK_URL || '' };
  },

  async setSettings({ googleSheetWebhookUrl }) {
    const { error } = await service
      .from('app_settings')
      .upsert({ key: 'googleSheetWebhookUrl', value: googleSheetWebhookUrl || '' });
    if (error) throw error;
  },
};

/* ==========================================================================
   JSON FILE STORE (local development fallback when Supabase isn't configured)
   ========================================================================== */

const readJson = () => {
  try {
    const parsed = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const writeJson = (list) => {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dbFile, JSON.stringify(list, null, 2), 'utf-8');
};

const jsonStore = {
  mode: 'json',
  async list() {
    return readJson();
  },
  async find(rawCode) {
    const regs = readJson();
    for (const c of codeCandidates(rawCode)) {
      const hit = regs.find((r) => String(c.field === 'passId' ? r.passId : r.registrationNo).toUpperCase() === c.value);
      if (hit) return hit;
    }
    return null;
  },
  async upsert(p) {
    const regs = readJson();
    const idx = regs.findIndex((r) => keyOf(r.registrationNo) === keyOf(p.registrationNo) && r.track === p.track);
    if (idx !== -1) {
      const ex = regs[idx];
      regs[idx] = {
        ...ex,
        studentName: p.studentName,
        batch: p.batch,
        gender: p.gender,
        foodPreference: p.foodPreference || 'Veg',
        phone: p.phone,
        email: p.email,
        selectedEvents: Array.from(new Set([...ex.selectedEvents, ...p.selectedEvents])),
        signature: p.signature,
        date: p.date,
      };
      writeJson(regs);
      return { record: regs[idx], updatedExisting: true };
    }
    const passId = `SLY-${1001 + regs.length}`;
    const record = {
      passId,
      qrPayload: `SLY|${passId}|${keyOf(p.registrationNo)}`,
      ...p,
      createdAt: new Date().toISOString(),
      attendanceScanned: false,
      attendanceScannedAt: null,
      foodScanned: false,
      foodScannedAt: null,
      paid: false,
      paidAt: null,
      paidBy: null,
    };
    regs.unshift(record);
    writeJson(regs);
    return { record, updatedExisting: false };
  },
  async setPayment(passId, paid, adminEmail) {
    const regs = readJson();
    const idx = regs.findIndex((r) => r.passId === passId);
    if (idx === -1) return null;
    const isPaid = Boolean(paid);
    regs[idx].paid = isPaid;
    regs[idx].paidAt = isPaid ? new Date().toISOString() : null;
    regs[idx].paidBy = isPaid ? adminEmail : null;
    writeJson(regs);
    return regs[idx];
  },
  async scan(kind, rawCode, adminEmail, confirmPaid = false) {
    const regs = readJson();
    const found = await this.find(rawCode);
    if (!found) return { status: 'NOT_FOUND' };
    const rec = regs.find((r) => r.passId === found.passId);

    // If student is NOT paid and scanner did not confirm payment yet:
    if (!rec.paid && !confirmPaid) {
      return {
        status: 'PAYMENT_REQUIRED',
        message: `PAYMENT PENDING: ${rec.studentName} (${rec.registrationNo}) has not paid registration fee. Confirm payment now?`,
        record: rec,
      };
    }

    // If confirmPaid is true and record wasn't paid yet, mark paid
    if (!rec.paid && confirmPaid) {
      rec.paid = true;
      rec.paidAt = new Date().toISOString();
      rec.paidBy = adminEmail;
    }

    const [flag, at, by] = kind === 'attendance'
      ? ['attendanceScanned', 'attendanceScannedAt', 'attendanceScannedBy']
      : ['foodScanned', 'foodScannedAt', 'foodScannedBy'];
    if (rec[flag]) return { status: 'ALREADY_SCANNED', record: rec };
    rec[flag] = true;
    rec[at] = new Date().toISOString();
    rec[by] = adminEmail;
    writeJson(regs);
    return { status: 'SUCCESS', record: rec };
  },
  async getSettings() {
    try {
      return JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
    } catch {
      return { googleSheetWebhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || '' };
    }
  },
  async setSettings(s) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(settingsFile, JSON.stringify(s, null, 2), 'utf-8');
  },
};

export const store = authConfigured ? supabaseStore : jsonStore;
export { clean };
