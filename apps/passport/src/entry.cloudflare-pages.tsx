/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Cloudflare Pages when building for production.
 *
 * Learn more about the Cloudflare Pages integration here:
 * - https://qwik.dev/docs/deployments/cloudflare-pages/
 *
 */
import {
	type PlatformCloudflarePages,
	createQwikCity,
} from "@builder.io/qwik-city/middleware/cloudflare-pages";
import { manifest } from "@qwik-client-manifest";
import qwikCityPlan from "@qwik-city-plan";

import render from "./entry.ssr";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface QwikCityPlatform extends PlatformCloudflarePages {}
}

const fetch = createQwikCity({ manifest, qwikCityPlan, render });

export { fetch };