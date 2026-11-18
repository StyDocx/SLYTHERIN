-- ==========================================================================
-- SLYTHERIN HOUSE EVENT / FESTIVAL DATABASE SCHEMA FOR SUPABASE
-- Run this entire script in Supabase Dashboard → SQL Editor → "New query" → Run
-- ==========================================================================

-- 1. ADMIN AUTHORIZATION TABLES
create table if not exists public.admins (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  email            text not null unique,
  role             text not null default 'admin' check (role in ('admin', 'super_admin')),
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  created_by       uuid references auth.users(id) on delete set null,
  created_by_email text
);

create table if not exists public.admin_audit_log (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  actor_id    uuid,
  actor_email text,
  action      text not null,
  detail      jsonb not null default '{}'::jsonb
);

-- Strict Row-Level Security: Only the server-side service role can read/write.
-- The public anon/authenticated keys are revoked, keeping admin rosters invisible.
alter table public.admins          enable row level security;
alter table public.admin_audit_log enable row level security;

revoke all on public.admins          from anon, authenticated;
revoke all on public.admin_audit_log from anon, authenticated;

-- 2. REGISTRATIONS SEQUENCE & TABLE
create sequence if not exists public.registration_pass_seq start 1001;

create table if not exists public.registrations (
  id                    bigint generated always as identity primary key,
  pass_id               text not null unique
                          default ('SLY-' || nextval('public.registration_pass_seq')),
  registration_key      text not null,                 -- UPPER(registration_no), set by server
  registration_no       text not null,
  student_name          text not null,
  batch                 text not null default '',
  gender                text not null default 'Male' check (gender in ('Male','Female')),
  food_preference       text not null default 'Veg' check (food_preference in ('Veg','Non-Veg')),
  phone                 text not null default '',
  email                 text not null default '',
  track                 text not null check (track in ('Cultural Event','Olympia Event')),
  selected_events       jsonb not null default '[]'::jsonb,
  signature             text not null default '',
  reg_date              text not null default '',
  qr_payload            text generated always as ('SLY|' || pass_id || '|' || registration_key) stored,
  created_at            timestamptz not null default now(),
  attendance_scanned    boolean not null default false,
  attendance_scanned_at timestamptz,
  attendance_scanned_by text,
  food_scanned          boolean not null default false,
  food_scanned_at       timestamptz,
  food_scanned_by       text,
  paid                  boolean not null default false,
  paid_at               timestamptz,
  paid_by               text,
  unique (registration_key, track)
);

-- Migration safety: ensure food_preference and paid columns exist if table was created in an earlier session
alter table public.registrations
  add column if not exists food_preference text not null default 'Veg' check (food_preference in ('Veg','Non-Veg')),
  add column if not exists paid boolean not null default false,
  add column if not exists paid_at timestamptz,
  add column if not exists paid_by text;

-- High-performance lookup indexes for fast QR scanning and sorting
create index if not exists registrations_created_idx     on public.registrations (created_at desc);
create index if not exists registrations_pass_id_idx     on public.registrations (pass_id);
create index if not exists registrations_reg_key_idx     on public.registrations (registration_key);
create index if not exists registrations_track_idx       on public.registrations (track);
create index if not exists registrations_attendance_idx  on public.registrations (attendance_scanned);
create index if not exists registrations_food_idx        on public.registrations (food_scanned);
create index if not exists registrations_paid_idx        on public.registrations (paid);

-- 3. APP SETTINGS TABLE (Google Sheets webhook URL & dynamic config)
create table if not exists public.app_settings (
  key   text primary key,
  value text not null default ''
);

-- Strict RLS: Revoke all anon/authenticated access so registrations are safe
alter table public.registrations enable row level security;
alter table public.app_settings  enable row level security;
revoke all on public.registrations from anon, authenticated;
revoke all on public.app_settings  from anon, authenticated;

-- Helper to safely bump the pass sequence during bulk data imports
create or replace function public.set_pass_seq(n bigint) returns void
language sql security definer as $$ select setval('public.registration_pass_seq', n) $$;
revoke all on function public.set_pass_seq(bigint) from public, anon, authenticated;
grant execute on function public.set_pass_seq(bigint) to service_role;

-- ==========================================================================
-- HOW TO CREATE YOUR FIRST SUPER ADMIN IN SUPABASE:
-- Option A: Run locally in terminal:
--   npm run create-super-admin -- your-admin@college.edu 'YourStrongPassword123!'
--
-- Option B: In Supabase Dashboard:
--   1. Go to "Authentication" → "Users" → Click "Add user" → "Create user"
--      Enter email and password, check "Auto Confirm User".
--   2. Run this query in SQL Editor (replace with your admin email):
--
--      insert into public.admins (user_id, email, role, active)
--      select id, email, 'super_admin', true
--      from auth.users
--      where email = 'your-admin@college.edu'
--      on conflict (user_id) do update set role = 'super_admin', active = true;
-- ==========================================================================
