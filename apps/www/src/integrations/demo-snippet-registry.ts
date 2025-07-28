import fs from "node:fs";
import resolvePkg from "resolve-package-path";
import fg from "fast-glob";
import path from "node:path";

export default function snippetRegistryIntegration() {
	return {
		name: "snippet-registry",
		hooks: {
			"astro:config:setup": generateSnippetWrappers,
			"astro:build:start": generateSnippetWrappers,
			"astro:server:start": generateSnippetWrappers,
		},
	};
}

async function generateSnippetWrappers() {
	const snippetNames = await discoverSnippets();

	// Create directories if they don't exist
	const generatedDir = "generated";
	const wrappersDir = path.join(generatedDir, "wrappers");

	if (!fs.existsSync(generatedDir)) {
		fs.mkdirSync(generatedDir, { recursive: true });
		console.log("📁 Created generated directory");
	}

	if (!fs.existsSync(wrappersDir)) {
		fs.mkdirSync(wrappersDir, { recursive: true });
		console.log("📁 Created wrappers directory");
	}

	// Create a wrapper component for each snippet
	for (const name of snippetNames) {
		const componentName = sanitizeName(name);
		const wrapperContent = `---
import Component from '@veloi.me/snippets/${name}';
export interface Props {
  [key: string]: any;
}
const props = Astro.props;
---

<Component {...props} client:visible />
`;

		const wrapperPath = path.join(wrappersDir, `${componentName}.astro`);
		fs.writeFileSync(wrapperPath, wrapperContent);
	}

	// Generate an index that maps names to wrapper components with static imports
	const imports = snippetNames
		.map((name) => {
			const componentName = sanitizeName(name);
			return `import ${componentName} from './wrappers/${componentName}.astro';`;
		})
		.join("\n");

	const mappings = snippetNames
		.map((name) => {
			const componentName = sanitizeName(name);
			return `  '${name}': ${componentName},`;
		})
		.join("\n");

	const registryContent = `${imports}

const snippetMap = {
${mappings}
} as const;

export function getSnippetWrapper(name: string) {
  return snippetMap[name as keyof typeof snippetMap];
}

export type SnippetName = keyof typeof snippetMap;
`;

	const registryPath = path.join(generatedDir, "snippet-wrappers.ts");
	fs.writeFileSync(registryPath, registryContent);

	console.log(`✅ Generated ${snippetNames.length} snippet wrappers`);
}

function sanitizeName(name: string) {
	return name.replace(/[^a-zA-Z0-9]/g, "_").replace(/^[0-9]/, "_$&");
}

const MATCH = "/react/**/*.example.{tsx,ts}";

async function discoverSnippets() {
	const snippetsDirectory = resolvePkg("@veloi.me/snippets", ".");
	if (!snippetsDirectory) {
		throw new Error("Package @veloi.me/snippets not installed");
	}

	const dir = path.join(path.parse(snippetsDirectory).dir, "src");
	const matches = await fg.async(dir + MATCH);
	const components = matches.map((match) => path.relative(dir, match));
	return components;
}
