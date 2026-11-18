# SLYTHERIN — The House Event & College Fest Platform

Production-ready interactive web application for the College Cultural & Sports Fest (Slytherin House Event). Built with **Vite + React + TypeScript**, **Express + Supabase (Postgres & Auth)**, and configured for zero-config global deployment on **Vercel**.

---

## ⚡ Quick Start for Production

### Architecture Overview
- **Frontend:** Vite SPA with GSAP motion, luxury gold-and-emerald aesthetic, QR pass generation, dual-track registration (44 Cultural Events, 26 Olympia Sports, Veg/Non-Veg meal option).
- **Backend / API:** Serverless Express application running on Vercel Node runtime via `api/index.js` (or standalone Node via `server.js`).
- **Database:** Supabase PostgreSQL with atomic pass counter, single-scan verification triggers, JSONB event storage, and Row Level Security (RLS).
- **Authentication:** Supabase Auth + HttpOnly `__Host-` Strict cookies for `/admin/login`, with Super Admin privilege delegation and immutable audit logging.

---

## 🛠️ Step 1: Supabase Setup (Database & Auth)

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **"New Project"**.
3. Choose a name (e.g. `slytherin-fest`), select a strong database password, and pick a region close to your users (e.g. `Mumbai (ap-south-1)` or `Singapore`).
4. Wait ~2 minutes for the database to provision.

### 1.2 Run Database Schema & Security Policies
1. In your Supabase project dashboard, click **"SQL Editor"** on the left menu.
2. Click **"New query"**.
3. Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and paste it into the editor.
4. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`).
5. You will see `Success. No rows returned`. All tables (`admins`, `admin_audit_log`, `registrations`, `app_settings`), sequences, and RLS policies are now active.

### 1.3 Create the First Super Admin
You have two easy options to create your first super admin:

#### Option A: Directly in Supabase Dashboard (Recommended - No Terminal Required)
1. Go to **Authentication** &rarr; **Users** &rarr; click **"Add user"** &rarr; **"Create user"**.
2. Enter your email (e.g. `admin@college.edu`) and a strong password (12+ characters).
3. Ensure **"Auto Confirm User"** is checked, then click **"Create user"**.
4. Now go to **SQL Editor** &rarr; **New query**, paste this and click **Run**:
   ```sql
   insert into public.admins (user_id, email, role, active)
   select id, email, 'super_admin', true
   from auth.users
   where email = 'admin@college.edu'
   on conflict (user_id) do update set role = 'super_admin', active = true;
   ```
5. Your account is now a verified `super_admin`!

#### Option B: Via Terminal CLI Script
From your local workspace, run:
```bash
npm run create-super-admin -- admin@college.edu 'YourStrongPassword123!'
```

### 1.4 Retrieve API Credentials
1. In Supabase, go to **Project Settings** (gear icon) &rarr; **API**.
2. Copy these 3 values:
   - **Project URL** (e.g. `https://xxxxxxxx.supabase.co`)
   - **Project API Keys &rarr; `anon` `public`** (starts with `ey...`)
   - **Project API Keys &rarr; `service_role` `secret`** (starts with `ey...`)

---

## 🚀 Step 2: Vercel Deployment Setup

The repository is pre-configured with [`vercel.json`](vercel.json) and [`api/index.js`](api/index.js) so Vercel builds the React frontend and deploys the Express backend as serverless functions automatically.

### 2.1 Push to GitHub / Git Provider
```bash
git add .
git commit -m "Production release for Vercel & Supabase"
git push origin main
```

### 2.2 Import Project in Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your Git repository and click **"Import"**.
4. In the Project Configuration screen:
   - **Framework Preset:** `Vite` (automatically detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 2.3 Add Environment Variables in Vercel
Expand **"Environment Variables"** in the Vercel project configuration and add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production security & `__Host-` cookies |
| `SUPABASE_URL` | `https://YOUR_ID.supabase.co` | Your Supabase Project URL |
| `SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase Anon Public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Supabase Service Role Secret Key |
| `TRUST_PROXY` | `1` | Enables accurate IP rate-limiting behind Vercel |

*(Optional variables: `ALLOWED_ORIGINS` for custom domain CORS, `GOOGLE_SHEET_WEBHOOK_URL` for Google Sheets sync).*

### 2.4 Deploy!
Click **"Deploy"**. Vercel will build the frontend into `dist/` and configure the Serverless API in ~45 seconds. You will be given a live production domain (e.g. `https://slytherin-house-event.vercel.app`).

---

## 🔐 Step 3: Accessing Admin in Production

1. Visit: `https://your-domain.vercel.app/admin/login`
2. Sign in with the super admin credentials created in Step 1.3.
3. Once logged in:
   - **Admin Management:** As a `super_admin`, you can add secondary staff/volunteer accounts directly in the admin portal (they can be assigned `admin` for scanner operators or `super_admin`).
   - **Scanner 1 (Attendance Gate):** Enforces single-scan entry; prevents duplicate admissions.
   - **Scanner 2 (Food Counter):** Surfaces meal preference (`🍗 NON-VEG` or `🥬 PURE VEG`) and enforces single-pass food distribution.
   - **Attendee Registry:** Search, filter, and export live data to Google Sheets-compatible CSV.

---

## 🧪 Local Development

To run locally before deploying:
```bash
# Copy environment file
cp .env.example .env
# Fill in your Supabase credentials in .env

# Run development server
npm run dev

# Or test full production build locally
npm run build
npm start
```
*Note: If Supabase keys are not set locally, the server operates in safe offline demo mode with mock auth (`admin@example.com` / `Slytherin@Demo2026`) and local JSON persistence.*
# SLYTHERIN
# SLYTHERIN
