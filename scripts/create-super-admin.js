// Usage: npm run create-super-admin -- you@example.com 'A-Strong-Passw0rd!'
// Creates (or promotes) the FIRST super admin. Run locally; needs .env with service-role key.
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const [email, password] = process.argv.slice(2);
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: npm run create-super-admin -- <email> '<password>'");
  process.exit(1);
}
if (password.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const lower = email.trim().toLowerCase();
let userId;
const { data, error } = await sb.auth.admin.createUser({ email: lower, password, email_confirm: true });
if (error) {
  if (!/already|registered|exists/i.test(error.message)) {
    console.error('Create user failed:', error.message);
    process.exit(1);
  }
  const { data: list } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  userId = list?.users?.find((u) => u.email?.toLowerCase() === lower)?.id;
  if (!userId) {
    console.error('User exists but could not be located.');
    process.exit(1);
  }
  await sb.auth.admin.updateUserById(userId, { password });
} else {
  userId = data.user.id;
}

const { error: upErr } = await sb
  .from('admins')
  .upsert({ user_id: userId, email: lower, role: 'super_admin', active: true }, { onConflict: 'user_id' });
if (upErr) {
  console.error('Could not write admins table (did you run supabase/schema.sql?):', upErr.message);
  process.exit(1);
}
console.log(`✓ Super admin ready: ${lower}`);

