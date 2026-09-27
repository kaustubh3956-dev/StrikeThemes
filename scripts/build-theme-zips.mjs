import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import JSZip from "jszip";

const root = process.cwd();
const themesDir = join(root, "themes");
const outDir = join(root, "public", "downloads");

/** Runtime helpers a theme depends on, bundled so the zip drops in cleanly. */
const SHARED = [
  "lib/theme/types.ts",
  "lib/theme/reveal.ts",
  "lib/gsap/gsap.client.ts",
  "lib/gsap/useGsapContext.ts",
  "lib/motion/reducedMotion.ts",
];

const SKIP = new Set(["base"]);

async function addDir(zip, dir, prefix) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await addDir(zip, full, `${prefix}/${entry.name}`);
    } else {
      zip.file(`${prefix}/${entry.name}`, await readFile(full));
    }
  }
}

function readme(id) {
  return `# ${id}

A drop-in sale theme extracted from the Strike theme system.

## Install

1. Copy \`themes/${id}/\` into your project's \`themes/\` folder.
2. Copy anything from \`lib/\` you do not already have.
3. Install the one runtime dependency:

   npm install gsap

## Register

\`\`\`ts
import ${id.replace(/-./g, (m) => m[1].toUpperCase())}Meta from "@/themes/${id}/meta";

export const themeMetas = [/* ... */, ${id.replace(/-./g, (m) => m[1].toUpperCase())}Meta];

export const themeLoaders = {
  // ...
  "${id}": () => import("@/themes/${id}"),
};
\`\`\`

## How it works

- \`meta.ts\` declares colour tokens, the effect duration and where the sale offer sits.
- \`index.ts\` lazily exports the animated layers.
- The theme calls \`revealOffer()\` when its animation should hand over to your offer.

Rules worth keeping:

- All GSAP must go through \`useGsapContext\`. It reverts tweens on unmount, pauses
  loops while hidden or off-screen, and skips under \`prefers-reduced-motion\`.
- A theme is additive: it may override colours but must never move page layout.
- Never paint an opaque background fill, and fade out at the bottom edge with a mask.

## Licence

Ships as-is. Check with the original author before commercial use.
`;
}

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const entries = await readdir(themesDir, { withFileTypes: true });
  const built = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP.has(entry.name)) continue;

    const zip = new JSZip();
    await addDir(zip, join(themesDir, entry.name), `themes/${entry.name}`);

    for (const shared of SHARED) {
      const path = join(root, shared);
      try {
        await stat(path);
        zip.file(shared, await readFile(path));
      } catch {
        console.warn(`  skipped missing ${relative(root, path)}`);
      }
    }

    zip.file("README.md", readme(entry.name));

    const buffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
    await writeFile(join(outDir, `${entry.name}.zip`), buffer);
    built.push(`${entry.name}.zip (${(buffer.length / 1024).toFixed(1)} kB)`);
  }

  console.log(`Theme archives written to public/downloads:\n  ${built.join("\n  ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
