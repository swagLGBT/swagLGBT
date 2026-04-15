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

## Turborepo: add generate-types as dev and pre-build task

`apps/www/package.json` has a `generate-types` script that runs `wrangler types`, generating `worker-configuration.d.ts` for Cloudflare binding type safety. This should be wired into Turborepo so it:

1. Runs before `build` (so types are fresh at build time)
2. Runs as part of `dev` setup (so editors get binding types during development)

When ready, add to `turbo.json`:
```json
"generate-types": {
  "cache": false
}
```

And add `"dependsOn": ["generate-types"]` to the `build` task, and `"dependsOn": ["generate-types"]` to the `dev` task.
