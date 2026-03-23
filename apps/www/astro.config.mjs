import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import snippetRegistryIntegration from "./src/integrations/demo-snippet-registry";
import uxPreviewRegistryIntegration from "./src/integrations/demo-ux-preview-registry";

import alpinejs from "@astrojs/alpinejs";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://veloi.me",
	integrations: [
		mdx(),
		sitemap(),
		alpinejs(),
		react(),
		snippetRegistryIntegration(),
		uxPreviewRegistryIntegration(),
	],
	prefetch: true,
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			theme: "github-light",
		},
	},
});
