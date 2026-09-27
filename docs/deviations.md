# Deviations from live strikes.in

Every elevation over the current live site is logged here so Strike can approve or reject
each one individually. Fidelity target: brand-faithful, selectively refined.

| # | Area | Live site | Here | Rationale |
|---|------|-----------|------|-----------|
| 1 | Code face | Cascadia / Consolas (inherited from embedded Monaco) | JetBrains Mono | Monaco's editor font stack leaked into page chrome. A deliberate mono keeps the developer identity without pulling an editor dependency. |
| 2 | Type scale | Fixed `rem` sizes per breakpoint | Fluid `clamp()` modular scale, 10 steps | Removes breakpoint-boundary jumps and gives the hero genuine display scale on large screens. |
| 3 | Colour derivation | Hand-written rgba/hex variants per state | `oklch(from var(--accent) ...)` relative colour | A theme swaps one accent token and every hover, ring and glow follows coherently. Required for the theming architecture. |
| 4 | Heading tracking | Default tracking | `-0.03em` + `text-wrap: balance` | Optical correction; large type needs negative tracking. |
| 5 | Dark surfaces | Flat fills | Optional `grain` utility (2.8% overlay) | Breaks up large flat blacks. Opt-in per section. |
| 6 | Focus states | Browser default / suppressed | Explicit `:focus-visible` ring on `--accent` | Accessibility baseline; the live site is inconsistent here. |
| 7 | Numerals | Proportional | `tabular-nums` via `[data-numeric]` | Prices and the countdown must not reflow as digits change. |
| 8 | Decorative font | `Cinzel Decorative` loaded | Not loaded | No usage found on the home page; it costs a render-blocking font request. Will add back if a section needs it. |
| 9 | Mascot / offer character | Present, bottom-right | Removed | Explicitly excluded per project brief. |

## Preserved exactly

Surface ramp (`#000` / `#0b0a12` / `#1a1a1a` / `#232323`), merged-fill alphas, foreground ramp
(`#fff` / `#f8fafc` / `#e2e8f0` / `#94a3b8`), hairline `#232323`, the full accent set
(cyan `#00b7d7`, warm `#ff7b00`, gold `#edb200`, blue `#3080ff`, electric `#31cc87`), status colours,
the 6-step radius scale, the light-mode token set, and Audiowide as the wordmark face.
