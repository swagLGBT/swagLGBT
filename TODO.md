# TODOs

Things deliberately deferred from the initial monorepo setup.

## Turborepo: add `^build` dependency

`turbo.json` currently has no `dependsOn` on the `build` task. When a shared package in `packages/` (e.g. `packages/ui`) exists and apps import from it, add:

```json
"build": {
  "dependsOn": ["^build"],
  "outputs": ["dist/**"]
}
```

This ensures packages are built before the apps that depend on them.

## Cloudflare Workers: add `main` for SSR

`apps/www/wrangler.jsonc` has no `main` field because the app uses `output: 'static'` and no pages opt into SSR yet. When the first page adds `export const prerender = false`:

1. Add `"main": "./dist/_worker.js/index.js"` to `wrangler.jsonc`
2. The `assets` block already has `"binding": "ASSETS"` which is required for the SSR + static hybrid setup
