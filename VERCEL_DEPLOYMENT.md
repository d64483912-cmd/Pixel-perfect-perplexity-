# Vercel Deployment Guide (with Supabase)

This guide walks you through deploying this app to Vercel and connecting it to your existing Supabase database. It also covers all required environment variables and common troubleshooting tips.

Note: This repository ships with a Cloudflare Workers backend. Deploying the frontend to Vercel is fully supported. If you run your API/backend elsewhere (e.g., Cloudflare Workers), keep it reachable from your Vercel domain and ensure CORS is configured. No existing code or UI files are modified by this guide.

---

## Prerequisites

- Vercel account and the Vercel CLI
- Supabase project with a Postgres database
- Bun or Node.js installed locally
- OpenSSL (for generating secure secrets)

Optional (depending on features you enable):
- Autumn account/secret key (billing)
- Runable AI Gateway URL and secret

---

## Environment Variables Setup

Add the following variables to your Vercel Project Settings → Environment Variables. For local development you can mirror these in a `.env.local` file.

Required (for auth and site):
- BETTER_AUTH_SECRET: Generate a strong secret: `openssl rand -base64 32`
- BETTER_AUTH_URL: Your production URL on Vercel, e.g. `https://your-app.vercel.app`
- VITE_BETTER_AUTH_URL: Same as BETTER_AUTH_URL, exposed to the client: `https://your-app.vercel.app`
- VITE_SITE_URL: Your production URL used for SEO/meta: `https://your-app.vercel.app`
- ADMIN_EMAIL: Email address that should be treated as admin

Supabase (database):
- DATABASE_URL: From Supabase Dashboard → Settings → Database → Connection string (URI). Example:
  `postgresql://postgres:<PASSWORD>@<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require`

Runable AI Gateway (optional):
- RUNABLE_GATEWAY_URL: Your AI gateway URL (e.g., `https://api.runable.com/gateway/v1`)
- RUNABLE_SECRET: Secret key for the gateway

Autumn (billing) (optional):
- AUTUMN_SECRET_KEY: Your Autumn secret key

Reference: The repo’s `.env.example` includes (local-friendly defaults):
```
VITE_BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=your-secret-key-here
AUTUMN_SECRET_KEY=your-autumn-secret-key-here
RUNABLE_GATEWAY_URL=http://localhost:8080/gateway/v1
RUNABLE_SECRET=your-gateway-secret-here
VITE_SITE_URL=http://localhost:5173
ADMIN_EMAIL=you@example.com
```

Example `.env.local` for local dev:
```
VITE_BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET=replace-with-openssl-generated-secret
VITE_SITE_URL=http://localhost:5173
ADMIN_EMAIL=you@example.com

# Supabase
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require

# Optional
RUNABLE_GATEWAY_URL=https://api.runable.com/gateway/v1
RUNABLE_SECRET=replace-with-your-gateway-secret
AUTUMN_SECRET_KEY=replace-with-your-autumn-secret
```

---

## Vercel CLI Installation

You can install the Vercel CLI globally:
```
npm i -g vercel
```
Or use it via npx:
```
npx vercel --help
```

---

## Project Setup (Vercel)

1) Login:
```
vercel login
```

2) Link the project (run in the repo root):
```
vercel link
```
Follow the prompts to create or link to an existing Vercel project.

3) Configure environment variables in the Vercel Dashboard:
- Open your project in Vercel → Settings → Environment Variables
- Add the variables listed above for Production (and Preview/Development as needed)

Tip: You can also sync envs locally:
```
vercel env pull .env.local
```

---

## Deploy to Vercel

The included `vercel.json` config sets up a pure SPA deployment with proper rewrites and CORS headers for `/api/*` requests.

- Build command: `bun run build`
- Output directory: `dist/client`
- Dev command: `bun run dev`

Deploy a preview build:
```
vercel
```
Promote to production:
```
vercel --prod
```

After a successful deploy, your app will be available at a Vercel-provided domain and/or your custom domain.

---

## Post-deployment Verification

- Visit your production URL (e.g., `https://your-app.vercel.app`) and confirm the homepage loads.
- Open browser dev tools → Console/Network for errors.
- Confirm meta/SEO features (if set) reflect your `VITE_SITE_URL`.
- If using Better Auth, test sign-in/sign-up flows.
- If using Autumn billing, open the billing page and confirm plan rendering and attach flows.
- If your backend/API is hosted separately (e.g., Cloudflare Workers), try an authenticated API action and verify CORS is allowed from your Vercel origin.
- If using Supabase in your backend, confirm the application can connect and queries succeed.

---

## Troubleshooting

- 404s on page refresh
  - Ensure the SPA rewrite is in place. The included `vercel.json` rewrites all non-API routes to `/index.html`.

- CORS errors when calling `/api/*`
  - The `vercel.json` adds permissive CORS headers for `/api/*`. If your API is on a different origin (Cloudflare Workers, Supabase Edge Functions, etc.), configure CORS there to allow your Vercel domain and credentials if needed.

- Environment variables not available on the client
  - Client-exposed vars must be prefixed with `VITE_` (e.g., `VITE_BETTER_AUTH_URL`, `VITE_SITE_URL`). Server-only secrets must NOT have `VITE_`.

- Supabase connection issues
  - Use the “URI” connection string from Supabase → Settings → Database.
  - Include `sslmode=require` in the connection string.
  - Consider using the Supabase connection pooler (pgbouncer) if you hit connection limits. Pooler port is typically `6543`.

- Auth callback/URL mismatches
  - Set `BETTER_AUTH_URL` and `VITE_BETTER_AUTH_URL` to your production URL. If you add a custom domain, update both variables and re-deploy.

- Missing secrets
  - Generate secrets with:
    - `BETTER_AUTH_SECRET`: `openssl rand -base64 32`

- Using a separate backend
  - This repo includes a Cloudflare Workers backend. If you deploy the backend elsewhere, keep endpoints consistent (e.g., reverse proxy `/api/*` to your backend) or update your API client base URL (if you choose to change code later). Ensure CORS allows your Vercel origin.

---

## What the provided configuration does

- `vercel.json`
  - Runs `bun run build` and serves the built SPA from `dist/client`
  - Rewrites `/api/:path*` to `/api/:path*` (no-op passthrough so you can layer your own routing/proxy later)
  - Redirects all non-API routes to `/index.html` to support client-side routing
  - Adds CORS headers on `/api/*`

- `.vercelignore`
  - Skips uploading large/unnecessary artifacts like `node_modules`, build outputs, Worker config, and drizzle files

That’s it. When you’re ready, run `vercel --prod` and celebrate your launch.
