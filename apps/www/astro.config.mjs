// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import wranglerTypes from 'astro-plugin-wrangler-types';

export default defineConfig({
  adapter: cloudflare({
    imageService: { build: 'compile', runtime: 'cloudflare-binding' },
  }),
  output: 'static',
  vite: {
    plugins: [wranglerTypes()]
  },
});
