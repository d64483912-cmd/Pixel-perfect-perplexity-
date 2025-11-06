# Nelson-GPT — Vercel Deployment Guide

This guide sets up a clean, reliable Vercel deployment for the Nelson-GPT application. It covers prerequisites, project linking, environment variables, database setup (Supabase), optional API hosting choices, migrations, verification, and troubleshooting.

Note on comments: `vercel.json` must be valid JSON and cannot include comments. Explanations for each section are documented here instead.

---

## Prerequisites

- Vercel account and access to the target team/project
- Vercel CLI installed: `npm i -g vercel` (or use the Vercel dashboard)
- Bun v1.2+ installed locally (project uses Bun for install/build)
- GitHub repository connected (recommended)
- Supabase account and project (for database)
- Autumn account (for billing and usage tracking keys)
- AI Gateway account/endpoint and key (Runable or compatible)
- Production domain (optional but recommended)

---

## Architecture Overview

- Frontend: Vite + React SPA built to static assets and deployed on Vercel.
- API: The app expects `/api/*` routes. You can:
  - Host API on Vercel Functions/Edge (future work), or
  - Host API on Cloudflare Workers (current repo ships Worker code), and proxy `/api/*` from Vercel to your Worker domain.

The provided `vercel.json` sets up SPA rewrites for client-side routing and basic CORS headers for `/api/*`. If your API is not served by Vercel, see “Proxying to an external API” below.

---

## Environment Variables (Vercel Project Settings)

Add the following variables in Vercel → Project → Settings → Environment Variables. Provide values for Production, Preview, and Development as needed.

- DATABASE_URL — Supabase connection string
- DIRECT_URL — Supabase direct connection string (for migrations)
- BETTER_AUTH_SECRET — Strong random string
- BETTER_AUTH_URL — Production URL of your app, e.g., `https://your-domain.com`
- VITE_BETTER_AUTH_URL — Same as `BETTER_AUTH_URL`
- AUTUMN_SECRET_KEY — From Autumn dashboard
- RUNABLE_GATEWAY_URL — AI gateway endpoint
- RUNABLE_SECRET — AI gateway key
- ADMIN_EMAIL — Admin user email to seed/guard admin flows
- VITE_SITE_URL — Production URL of your app, e.g., `https://your-domain.com`

Tips:
- Generate `BETTER_AUTH_SECRET`:
  - macOS/Linux: `openssl rand -base64 32`
  - Node/Bun: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- For local development you may also create `.env.local` (already ignored by `.vercelignore`).

---

## Step-by-Step Deployment (Vercel)

1) Login and link

- CLI: `vercel login` → `vercel link` and choose or create the project
- Or via dashboard: Import the GitHub repository

2) Configure environment variables

- Dashboard: Project → Settings → Environment Variables
- Or CLI (interactive): `vercel env add NAME`

3) Set build settings (already configured by `vercel.json`)

- Install: `bun install`
- Build: `bun run build`
- Output: `dist/client` (as specified in `vercel.json`)
- Dev: `bun run dev`

Note: Vite’s default output is `dist/`. If your build generates `dist/` (not `dist/client`), either:
- Update your Vite config to emit to `dist/client`, or
- Change `vercel.json` → `outputDirectory` to `dist` (do this only if/when you intentionally change the config; current file is kept as requested).

4) Deploy

- First deployment: `vercel` (Preview)
- Promote to Production: `vercel --prod` or use the dashboard’s Promote button

---

## Supabase Setup

1) Create a Supabase project
- Note the `DATABASE_URL` (Project → Settings → Database → Connection Info)
- If available, copy a `DIRECT_URL` (sometimes called “Direct connection” or use a separate pooled/non-pooled connection string for migrations)

2) Configure RLS and extensions
- Enable RLS as needed and create policies for your tables
- Enable required extensions (e.g., `pgcrypto`, `uuid-ossp`) if your schema uses them

3) Add Vercel environment variables
- Set `DATABASE_URL` and `DIRECT_URL` in Vercel project settings

---

## Database Migrations

Pick the path that matches your backend target.

A) Using Supabase (Postgres)
- Ensure your ORM/migration tool is configured for Postgres
- Typical Drizzle (Postgres) flow:
  - `bun x drizzle-kit generate` (creates SQL migrations from schema)
  - Apply migrations to Supabase (via Studio SQL editor or CLI)
- If the repo currently targets Cloudflare D1 (SQLite), migrating to Postgres requires updating the Drizzle dialect and code paths. Plan this as a separate task.

B) Using Cloudflare D1 (current repo default)
- The repository ships Drizzle config using `d1-http` driver and Worker code
- Deploy and migrate via Wrangler/Cloudflare (outside of Vercel). See `wrangler.jsonc`, `drizzle.config.ts`, and `drizzle/` folder

---

## Proxying to an External API (Cloudflare Workers)

If your API runs on Cloudflare Workers, update `vercel.json` to proxy `/api/*` to your Worker domain so the SPA and API share the same origin path in the browser:

Example (do this later when your Worker URL is ready):

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://<your-worker-subdomain>.workers.dev/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Additionally, restrict CORS to your production domain by replacing `*` with your site URL in the headers section.

---

## Post-Deployment Verification Checklist

- SPA loads on your production URL without console errors
- Client-side routing works on deep links and page refresh (no 404s)
- `/api/ai/models` returns successfully when authenticated (if API wired)
- Auth flows: Sign up/in/out work; session persists; admin routes enforce role
- Billing: Pricing table loads; attaching a plan opens Autumn checkout; current plan and usage render correctly
- Chat: Messages stream and usage tracking increments (if configured)

---

## Troubleshooting

- Build succeeds locally but fails on Vercel
  - Ensure Bun is used (`installCommand: bun install`, `buildCommand: bun run build`)
  - Clear caches or re-deploy

- 404s on deep links
  - Confirm the SPA rewrite `/(.*) → /index.html` is present (it is)

- API 404 on Vercel
  - If you haven’t deployed API functions on Vercel, proxy `/api/*` to your external API (Cloudflare Worker) as shown above

- CORS errors on API calls
  - Narrow `Access-Control-Allow-Origin` from `*` to your domain in `vercel.json`
  - Confirm your external API also sends matching CORS headers

- Auth type errors at build time
  - Use the Better Auth client from `src/lib/auth.ts` on the frontend
  - Do not call `apiClient.auth.*` (not exposed)

- Database connectivity
  - Verify `DATABASE_URL`/`DIRECT_URL` in Vercel settings
  - Apply migrations before running the app in production

---

## What Each `vercel.json` Section Does

- buildCommand/installCommand/devCommand — tell Vercel how to build/run locally
- outputDirectory — where the static assets are emitted (served by Vercel)
- rewrites — ensure client-side routing and `/api/*` path handling
- headers — attach CORS headers for `/api/*` responses served by Vercel

If your API is external, update the `/api/*` rewrite to point at your external URL.

---

## Useful Commands

- Local dev: `bun run dev`
- Local build: `bun run build`
- Typechecks (recommended before deploying):
  - Frontend: `bun x tsc --noEmit -p ./tsconfig.app.json`
  - Worker: `bun x tsc --noEmit -p ./tsconfig.worker.json`
  - Node: `bun x tsc --noEmit -p ./tsconfig.node.json`
- Vercel env (CLI): `vercel env add <NAME>`

---

## Environment Variables Reference (copy/paste)

Set these in Vercel → Project → Settings → Environment Variables:

- DATABASE_URL
- DIRECT_URL
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- VITE_BETTER_AUTH_URL
- AUTUMN_SECRET_KEY
- RUNABLE_GATEWAY_URL
- RUNABLE_SECRET
- ADMIN_EMAIL
- VITE_SITE_URL

That’s it. Once your variables are configured and your API is reachable (either on Vercel or proxied to Workers), ship a Production deploy and verify the checklist above.