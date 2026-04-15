# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root unless noted.

| Command | What it does |
| - | - |
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start dev server for all apps (`astro dev` → `localhost:4321`) |
| `pnpm build` | Build all apps via Turborepo |
| `pnpm run deploy` | Build then deploy all apps via `wrangler deploy` |
| `pnpm preview` | Build then preview locally |

Commands also work from inside `apps/www` directly (bypasses Turborepo caching).

> Note: `pnpm deploy` (without `run`) is a pnpm built-in — always use `pnpm run deploy` or `turbo deploy`.

## Architecture

**pnpm + Turborepo monorepo** with workspaces at `apps/*` and `packages/*`.

- `apps/www` — the only current app; an Astro 6 static site deployed to Cloudflare Workers at `swag.lgbt`
- `packages/` — empty, tracked with `.gitkeep`; reserved for future shared libraries (e.g. `packages/ui`)
- `turbo.json` — pipeline: `build` outputs `dist/**`; `deploy` and `preview` depend on `build`

### `apps/www` — Astro + Cloudflare

- **Adapter:** `@astrojs/cloudflare` with `output: 'static'` — all pages prerender by default
- **SSR opt-in:** individual pages add `export const prerender = false` to become SSR routes
- **Image service:** `build: 'compile'` for static pages, `runtime: 'cloudflare-binding'` for SSR pages
- **Deployment:** `wrangler.jsonc` — Worker named `www`, serves `./dist` as static assets, custom domain `swag.lgbt`
- `public/.assetsignore` — prevents `_worker.js` and `_routes.json` from being uploaded as static assets

### Pending wiring (see `TODO.md`)

1. **When the first SSR page is added** (`export const prerender = false`): add `"main": "./dist/_worker.js/index.js"` to `wrangler.jsonc`
