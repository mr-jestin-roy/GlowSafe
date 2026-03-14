# GlowSafe

UV awareness and skin safety app: postcode-based UV index, Fitzpatrick skin type, sunscreen guidance, and prevention tips.

---

## Installation

### Prerequisites

- **Node.js** 18+ (22.x recommended)
- **npm** (or pnpm)
- **PostgreSQL** (for local dev and for production database)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/mr-jestin-roy/GlowSafe.git
   cd GlowSafe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Copy the example env file and fill in values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   - `DATABASE_URL` – PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/glowsafe`)
   - `VITE_GEMINI_API_KEY` – (optional) for AI skin analysis feature

4. **Database setup (local)**

   Create the database and run the seed script (see [Database setup order](src/Database/README.md) for manual SQL order):

   ```bash
   createdb glowsafe   # if not exists
   npm run db:seed
   ```

5. **Run locally**

   - **Frontend (dev):** `npm run dev` — Vite dev server with API proxy to `localhost:3001`
   - **Backend (dev):** `npm run dev:server` — Express API on port 3001

   Or run production build + server:

   ```bash
   npm run build
   npm run start
   ```

---

## Start command (production)

When running the app in production (e.g. on Render), use:

```bash
npm run db:seed && npm run start
```

- `db:seed` runs the SQL scripts so the database has tables and reference data.
- `start` runs `NODE_ENV=production tsx server/index.ts` and serves the built frontend + API.

Do **not** run `db:seed` in the **build** step; the database is not available during build.

---

## CI/CD deployment

The app is split so you can deploy:

- **Frontend** on **Vercel** (static + serverless-friendly).
- **Backend + database** on **Render** and **PostgreSQL** (e.g. Render Postgres).

CI/CD is handled by each platform: connect the same Git repo and they build/deploy on push (e.g. `main`).

---

### Vercel (frontend)

Vercel builds and deploys the **static frontend** on every push. The frontend must call your **Render backend** for API and database-backed features.

1. **Connect repo**
   - Vercel Dashboard → Add New Project → Import the GlowSafe repo.
   - Framework: Vite. Build command and output directory are usually auto-detected.

2. **Build settings**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Environment variables** (Vercel project → Settings → Environment Variables)
   - `VITE_API_URL` = `https://glowsafe.onrender.com` (your Render backend URL; no trailing slash)
   - `VITE_GEMINI_API_KEY` = (optional) your Gemini API key for skin analysis

4. **Deploy**
   - Push to the connected branch (e.g. `main`). Vercel runs the build and deploys. Each push triggers a new deployment (CI/CD).

Result: the Vercel URL serves the app; all `/api` requests go to `https://glowsafe.onrender.com` so skin types, tips, and other DB data load correctly.

---

### Render (backend / full-stack)

Render runs the **Node server** that serves the API and the built frontend. It needs a **PostgreSQL** database (e.g. Render Postgres).

1. **Create services**
   - **PostgreSQL:** Render Dashboard → New → PostgreSQL. Note the **Internal Database URL** (use this as `DATABASE_URL` for the web service).
   - **Web Service:** New → Web Service → Connect the GlowSafe repo.

2. **Build & start**
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run db:seed && npm run start`
   - Do **not** put `db:seed` in the build command; the DB is not available during build.

3. **Environment variables** (Web Service → Environment)
   - `DATABASE_URL` = (from Render Postgres: Internal Database URL)
   - `NODE_ENV` = `production` (optional; Render often sets this)

4. **CI/CD**
   - Render deploys on every push to the linked branch (e.g. `main`). Build runs in an isolated environment; after deploy, the start command runs in an environment that can reach PostgreSQL.

Health checks:

- `https://glowsafe.onrender.com/api/health` — API up
- `https://glowsafe.onrender.com/api/health/db` — Database connection check

---

### PostgreSQL (database)

The app expects a **PostgreSQL** database with schema and seed data provided by the scripts in `src/Database/`.

- **Local:** Use a local Postgres instance; `DATABASE_URL` in `.env`; run `npm run db:seed` once (or after schema changes).
- **Render:** Use **Render Postgres**. Create a PostgreSQL instance, copy the **Internal Database URL** into the Web Service's `DATABASE_URL`. The **Start Command** `npm run db:seed && npm run start` runs migrations/seed when the service starts, so the app and DB stay in sync across deploys.
- **External Postgres:** If you use another provider (e.g. Supabase, Neon), set `DATABASE_URL` in Render (and optionally in Vercel if you run API there). Ensure the instance allows connections from Render/Vercel and use SSL if required (e.g. `?sslmode=require` in the URL).

Seed order and manual steps are documented in [src/Database/README.md](src/Database/README.md).

---

## Summary

| Platform    | Role              | Build command              | Start / deploy notes                          |
|------------|-------------------|----------------------------|-----------------------------------------------|
| **Vercel** | Frontend (static) | `npm run build`            | Set `VITE_API_URL` to Render backend URL      |
| **Render** | Backend + API     | `npm install && npm run build` | Start: `npm run db:seed && npm run start` |
| **PostgreSQL** | Database     | —                          | Set `DATABASE_URL`; seed via start command on Render |

CI/CD: push to the connected branch on each platform to trigger builds and deployments.
