# Dependency Migration Summary

## Changes Made to Support Vercel + Supabase PostgreSQL

### 1. Package.json Scripts
- **Removed**: Cloudflare-specific scripts (`cf-typegen`, `pre-deploy`, `zip:dist`, `autumn:*`)
- **Added**: Vercel deployment script (`deploy: vercel --prod`)
- **Updated**: Database scripts for PostgreSQL (`db:generate`, `db:push`, `db:studio`)
- **Added**: Typecheck scripts (`typecheck:app`, `typecheck:worker`)

### 2. Dependencies Added
- `@vercel/node: ^3.0.0` - Vercel serverless function support
- `@neondatabase/serverless: ^0.9.0` - PostgreSQL connection for serverless environments

### 3. Dependencies Removed
- `better-auth-cloudflare: ^0.2.7` - Cloudflare-specific Better Auth adapter
- `cloudflare: ^4.5.0` - Cloudflare Workers SDK
- `@cloudflare/vite-plugin: ^1.13.12` - Cloudflare Vite plugin (dev)
- `wrangler: ^4.42.2` - Cloudflare Workers CLI (dev)

### 4. Dependencies Kept
- `better-auth: ^1.3.27` - Core Better Auth library (will use PostgreSQL adapter)
- `drizzle-orm: ^0.36.4` - ORM (supports PostgreSQL)
- `drizzle-kit: ^0.28.1` - Migration tooling
- All UI dependencies (React, Tailwind, Radix UI, etc.)
- All AI SDK packages (@ai-sdk/*)
- Hono framework (will use @hono/node-server adapter)

### 5. TypeScript Configuration Updates
- **tsconfig.worker.json**: Updated to support Node.js modules for Vercel:
  - Changed `module` from "ESNext" to "CommonJS"
  - Changed `moduleResolution` from "bundler" to "node"
  - Added `allowSyntheticDefaultImports` and `esModuleInterop`
  - Removed worker-specific types, kept only "node"

### 6. Next Steps
After this dependency update, you'll need to:
1. Update database configuration to use PostgreSQL instead of D1
2. Configure Better Auth to use PostgreSQL adapter instead of Cloudflare
3. Update worker/server code to use Vercel serverless functions
4. Configure environment variables for Supabase connection
5. Update database schema for PostgreSQL compatibility
6. Create vercel.json configuration for deployment