import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import snippetRegistryIntegration from "./src/integrations/demo-snippet-registry";

import alpinejs from "@astrojs/alpinejs";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
	site: "https://veloi.me",
	integrations: [
		mdx(),
		sitemap(),
		alpinejs(),
		preact({ compat: true }),
		snippetRegistryIntegration(),
	],
	prefetch: true,
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			theme: "vesper",
		},
	},
});
