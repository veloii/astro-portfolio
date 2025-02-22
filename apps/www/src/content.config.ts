import { defineCollection, reference, z } from "astro:content";
import fg from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import resolvePkg from "resolve-package-path";

const snippetsDirectory = resolvePkg("@veloi.me/snippets", ".");

if (!snippetsDirectory) throw new Error("No snippets directory");

const snippets = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		usage: reference("snippetImplementations").optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).optional(),
		dependencies: z.array(reference("snippetImplementations")).optional(),
		implementation: reference("snippetImplementations"),
	}),
});

const MATCH = "/**/*.{tsx,ts}";

const snippetImplementations = defineCollection({
	loader: async () => {
		const dir = path.join(path.parse(snippetsDirectory).dir, "src");
		const stream = fg.stream(dir + MATCH);
		const result: { code: string; id: string }[] = [];
		for await (const entry of stream) {
			const buffer = await fs.readFile(entry);
			const code = buffer.toString("utf8");
			const filePath = entry.toString("utf8");
			const id = path.relative(dir, filePath);
			result.push({ code, id });
		}
		return result;
	},
	schema: z.object({
		code: z.string(),
	}),
});

export const collections = { snippets, snippetImplementations };
