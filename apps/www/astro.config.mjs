import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
    site: "https://veloi.me",
    integrations: [mdx(), sitemap(), alpinejs()],
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
