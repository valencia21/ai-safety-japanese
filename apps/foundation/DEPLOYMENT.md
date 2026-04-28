# Deployment Guide

TanStack Start on GCP Cloud Run with GitHub auto-deploy.

## Architecture

```
GitHub Push → Cloud Build → Artifact Registry → Cloud Run
```

## Key Files

| File | Purpose |
|------|---------|
| `/Dockerfile` | Multi-stage Bun build |
| `/cloudbuild.yaml` | Cloud Build pipeline |
| `server.ts` | Custom Bun production server |
| `vite.config.ts` | TanStack Start build config |

## What Made This Work

### 1. Custom Production Server (`server.ts`)

TanStack Start doesn't have native Bun support. Created custom server that:
- Loads TanStack's compiled handler from `dist/server/server.js`
- Serves static assets from `dist/client/` with proper caching
- Handles NodeResponse → Response conversion for Bun compatibility

### 2. Two-Step Build Process

```bash
vite build           # Build client + TanStack server handler
esbuild server.ts    # Bundle custom server → dist/server-entry.mjs
```

### 3. Dockerfile Gotchas

- **Monorepo structure**: Must copy workspace package.json files for bun install
- **Logging package**: Build `packages/logging` before main app
- **node_modules in prod**: Keep them - react-dom/server needs them at runtime
- **dumb-init**: Required for proper signal handling in containers
- **WORKDIR**: Must be `/app/apps/foundation` for correct module resolution

### 4. Static Asset Handling

Server scans `dist/client/**/*` at startup and creates routes with:
- Immutable caching for `/assets/` (hashed filenames)
- 1-hour cache for other static files

### 5. Theme Flash Prevention

Blocking script in `<head>` runs before paint:
- Sets random color theme
- Restores dark/light mode from localStorage
- Adds `.ready` class to show content

CSS hides content until ready: `html:not(.ready) { visibility: hidden; }`

## GCP Setup (One-Time)

1. Create Artifact Registry repo
2. Create Cloud Run service
3. Connect GitHub repo to Cloud Build trigger (on push to master)
4. Map custom domain in Cloud Run

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Module not found | Check WORKDIR is correct in Dockerfile |
| Static 404s | Verify client assets copied to dist |
| Theme flash | Ensure blocking script runs before body |
| Container exits | Add dumb-init for signal handling |
