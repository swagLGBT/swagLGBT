# TODOs

Things deliberately deferred from the initial monorepo setup.

## Cloudflare Workers: add `main` for SSR

`apps/www/wrangler.jsonc` has no `main` field because the app uses `output: 'static'` and no pages opt into SSR yet. When the first page adds `export const prerender = false`:

1. Add `"main": "./dist/_worker.js/index.js"` to `wrangler.jsonc`
2. The `assets` block already has `"binding": "ASSETS"` which is required for the SSR + static hybrid setup
