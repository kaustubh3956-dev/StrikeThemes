# Authoring a theme

A theme owns **look and motion only**. Everything else is handled for you.

| A theme decides | The app handles |
| --- | --- |
| Colour token overrides | Starting every visit on the base theme |
| Background visuals and animation | Scrolling to the top before a theme is applied |
| Optional extra Overlay decoration | Replaying the theme when its card is clicked again |
| **Where** the sale offer sits | Fading the effects out after a few seconds |
| **When** the offer appears | Mounting, revealing, docking and expanding the offer |
| | Offer content, coupon copy and the countdown |

Never import the offer, the countdown or the sale content inside a theme.

## Effects are temporary

A theme's layers hold for about five seconds, fade out, then unmount. The offer
stays. Design the animation as a short **arrival moment**, not a permanent backdrop —
anything meant to persist belongs in the base site, not a theme.

Preview cards are exempt: they loop continuously so visitors can compare themes.

## The one hard rule

**A theme is additive. It must never change the base site's layout.**

Nothing a theme does may move, resize or reflow a single element of the page.
That means:

- `tokens` may only override **colours**. Never spacing, radii, font sizes or the type scale.
- Layers are absolutely or fixed positioned, so they take part in no layout flow.
- No body classes, no padding, no margins, no wrappers around page content.

Apply your theme and the hero copy must not shift by a single pixel.

```text
themes/<id>/
  meta.ts        # static: id, name, tier, tokens, swatches, offer config
  index.ts       # lazy: exports `layers` ({ Background?, Overlay? })
  Background.tsx # optional, renders behind the hero content
  Overlay.tsx    # optional, renders above it (decoration only)
```

## 1. meta.ts

```ts
import type { ThemeMeta } from "@/lib/theme/types";

export const meta: ThemeMeta = {
  id: "midnight-sale",
  name: "Midnight Sale",
  description: "One line shown on the gallery card.",
  tier: "medium",                 // light | medium | heavy
  tokens: { "--accent": "#ff7b00" },
  swatches: ["#0a0410", "#1a0c22", "#ff7b00"],
  offer: {
    position: "bottom-left",      // bottom-left | bottom-right | bottom-center | top-left | top-right
    revealImmediately: false,     // true = show at once, skip revealOffer()
  },
};

export default meta;
```

Omit `offer` entirely and no sale offer renders.

Keep `tokens` small and colour-only. Offer themes are **sales layered on the base site**,
not re-skins — overriding the whole palette breaks consistency with the rest of the page.

## 2. index.ts

```ts
import type { ThemeLayers } from "@/lib/theme/types";
import Background from "./Background";

export const layers: ThemeLayers = { Background };
```

## 3. Background

Layers receive `{ previewMode }`. When true the layer is rendering inside a small
gallery card and must cut particle counts, DPR and loop length.

```tsx
"use client";
import { useRef } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";
import { revealOffer } from "@/lib/theme/reveal";
import type { ThemeLayerProps } from "@/lib/theme/types";

export default function Background({ previewMode }: ThemeLayerProps) {
  const root = useRef<HTMLDivElement>(null);

  useGsapContext(({ gsap }) => {
    gsap.timeline()
      .to(".x", { opacity: 1, duration: 0.6 })
      .add(() => { if (!previewMode) revealOffer(); });
  }, { scope: root, deps: [previewMode] });

  return <div ref={root} aria-hidden className="absolute inset-0" />;
}
```

Rules:

- **All GSAP goes through `useGsapContext`.** It reverts tweens and ScrollTriggers on
  unmount, pauses while the tab is hidden, and skips under `prefers-reduced-motion`.
  Without it, switching themes leaks animations into the next one.
- **Never paint an opaque background fill** — it hides the site's ambient layer.
- **Fade out at the bottom** with a `mask-image`, or a hard seam appears where the
  themed band ends.
- Call `revealOffer()` once, at the moment the offer should take over. Skip it when
  `previewMode` is true.

## 4. Register

Two lines in `lib/theme/registry.ts`:

```ts
export const themeMetas = [baseMeta, lightningMeta, midnightMeta];
export const themeLoaders = {
  // ...
  "midnight-sale": () => import("@/themes/midnight-sale"),
};
```

That is the only shared file a theme touches. Delete the folder and its two lines
and the site still builds.

## Performance budget

| Tier | Allowed |
| --- | --- |
| light | CSS/transform only, no JS loop |
| medium | GSAP timelines on a bounded set of elements |
| heavy | one `<canvas>`, capped particle count, clamped DPR, paused off-screen |

Animate `transform` and `opacity` only. Never animate layout properties.

## Verify

Apply the theme, then open `/system` — it renders every token live, so any override
you missed is immediately visible.
