import fs from "node:fs";
import resolvePkg from "resolve-package-path";
import fg from "fast-glob";
import path from "node:path";

export default function uxPreviewRegistryIntegration() {
	return {
		name: "ux-preview-registry",
		hooks: {
			"astro:config:setup": generateUxPreviewWrappers,
			"astro:build:start": generateUxPreviewWrappers,
			"astro:server:start": generateUxPreviewWrappers,
		},
	};
}

async function generateUxPreviewWrappers() {
	const componentNames = await discoverComponents();

	const generatedDir = "generated";
	const wrappersDir = path.join(generatedDir, "ux-wrappers");

	if (!fs.existsSync(generatedDir)) {
		fs.mkdirSync(generatedDir, { recursive: true });
	}

	if (!fs.existsSync(wrappersDir)) {
		fs.mkdirSync(wrappersDir, { recursive: true });
	}

	for (const name of componentNames) {
		const componentName = sanitizeName(name);
		const wrapperContent = `---
import Component from '@veloi.me/ux-preview/${name}';
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

	const imports = componentNames
		.map((name) => {
			const componentName = sanitizeName(name);
			return `import ${componentName} from './ux-wrappers/${componentName}.astro';`;
		})
		.join("\n");

	const mappings = componentNames
		.map((name) => {
			const componentName = sanitizeName(name);
			return `  '${name}': ${componentName},`;
		})
		.join("\n");

	const registryContent = `${imports}

const uxPreviewMap = {
${mappings}
} as const;

export function getUxPreviewWrapper(name: string) {
  return uxPreviewMap[name as keyof typeof uxPreviewMap];
}

export type UxPreviewName = keyof typeof uxPreviewMap;
`;

	const registryPath = path.join(generatedDir, "ux-preview-wrappers.ts");
	fs.writeFileSync(registryPath, registryContent);

	console.log(`✅ Generated ${componentNames.length} ux-preview wrappers`);
}

function sanitizeName(name: string) {
	return name.replace(/[^a-zA-Z0-9]/g, "_").replace(/^[0-9]/, "_$&");
}

const MATCH = "/**/*.example.{tsx,ts}";

async function discoverComponents() {
	const uxPreviewDirectory = resolvePkg("@veloi.me/ux-preview", ".");
	if (!uxPreviewDirectory) {
		throw new Error("Package @veloi.me/ux-preview not installed");
	}

	const dir = path.join(path.parse(uxPreviewDirectory).dir, "src");
	const matches = await fg.async(dir + MATCH);
	const components = matches.map((match) => path.relative(dir, match));
	return components;
}
