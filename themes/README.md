# Authoring a theme

A theme is one folder. It never imports page components, and the page never imports it.

```text
themes/<id>/
  meta.ts        # static: id, name, tier, token overrides, swatches
  index.ts       # lazy: exports `layers` ({ Background?, Overlay? })
  Background.tsx # optional, renders behind content
  Overlay.tsx    # optional, renders above content
```

## 1. meta.ts

```ts
import type { ThemeMeta } from "@/lib/theme/types";

export const meta: ThemeMeta = {
  id: "midnight-sale",
  name: "Midnight Sale",
  description: "One line shown on the gallery card.",
  tier: "medium",            // light | medium | heavy
  tokens: {                  // any variable from app/globals.css
    "--surface-base": "#0a0410",
    "--accent": "#ff7b00",
  },
  swatches: ["#0a0410", "#1a0c22", "#ff7b00"],
};

export default meta;
```

Overriding `--accent` alone re-colours every hover, ring, glow and syntax colour, because
those are derived from it with `oklch(from ...)`.

## 2. index.ts

```ts
import type { ThemeLayers } from "@/lib/theme/types";
import Background from "./Background";

export const layers: ThemeLayers = { Background };
```

## 3. Layers

Layers receive `{ previewMode }`. When `previewMode` is true the layer is rendering inside a
small gallery card and must cut particle counts, DPR and loop length.

```tsx
"use client";
import { useRef } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";
import type { ThemeLayerProps } from "@/lib/theme/types";

export default function Background({ previewMode }: ThemeLayerProps) {
  const root = useRef<HTMLDivElement>(null);

  useGsapContext(({ gsap }) => {
    gsap.to(".x", { yPercent: 100, repeat: -1, ease: "none",
                    duration: previewMode ? 5 : 9 });
  }, { scope: root, deps: [previewMode] });

  return <div ref={root} aria-hidden className="absolute inset-0" />;
}
```

**All GSAP must go through `useGsapContext`.** It reverts every tween and ScrollTrigger on
unmount, pauses while the tab is hidden, and skips entirely under `prefers-reduced-motion`.
Without it, switching themes leaks animations onto the next theme.

## 4. Register

Two lines in `lib/theme/registry.ts`:

```ts
export const themeMetas = [baseMeta, signalMeta, midnightMeta];
export const themeLoaders = {
  // ...
  "midnight-sale": () => import("@/themes/midnight-sale"),
};
```

That is the only shared file a theme touches. Delete the folder and its two lines and the
site still builds.

## Performance budget

| Tier | Allowed |
| --- | --- |
| light | CSS/transform only, no JS loop |
| medium | GSAP timelines on a bounded set of elements |
| heavy | one `<canvas>`, capped particle count, clamped DPR, paused off-screen |

Animate `transform` and `opacity` only. Never animate layout properties.

## Verify

Apply the theme, then open `/system` — it renders every token live, so any override you
missed is immediately visible.
