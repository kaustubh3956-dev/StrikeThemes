# Strike Sale Themes

A recreation of the [strikes.in](https://strikes.in) home page, plus a sale experience built as a
**gallery of swappable animated themes** rather than a banner.

Each theme takes over the page with its own animation — lightning striking the hero, a gift box
being unwrapped, fireworks going up — and each one hands off to the same offer at the end. The
offer is not decoration bolted on top; it is the payoff of an animation the user chose to play.

---

## Setup

Requires Node 20.9+ (developed on 24.21).

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build; `prebuild` regenerates the theme zips first |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next lint` no longer exists in Next 16) |
| `npm run themes:zip` | Rebuild `public/downloads/*.zip` on demand |
| `npx tsc --noEmit` | Type-check |

---

## The idea

A sale banner is ignored because it is something done *to* the user. So the sale is framed as a
feature of the site instead: an **Offer Themes** section, styled like every other section, where
each card is a live animated preview. It reads as a site skin picker. Curiosity comes from wanting
to see what the animation does, not from being told there is a discount.

Clicking a theme scrolls back to the hero and plays a full-page animation. The offer appears only
when the animation decides it should — the theme calls `revealOffer()` at its dramatic beat. The
lightning bolt strikes and the offer is what it leaves behind. The gift box lid blows off and the
offer is inside it. That is the whole trick: **the discount is the punchline of the animation**,
so the user arrives at the coupon having opted in twice.

## User flow

1. User browses the home page normally.
2. Reaches the **Offer Themes** section — three cards, each already animating in miniature.
3. Clicks one. The page scrolls to the hero and the full-screen effect plays.
4. At the animation's peak the offer appears in the position that theme chose.
5. It stays open ~7s, then minimises to a small pill that keeps the countdown visible. Hover or
   focus reopens it.
6. Coupon copies in one click; the CTA goes to the plan page.
7. Any theme can be cleared, or a theme's source can be downloaded as a zip.

---

## Feature checklist

**Homepage** — navbar, hero, code editor panel, membership plans, what we offer, why choose us,
company logos, mentors, testimonials, FAQ, footer. Tokens, type scale and spacing extracted from
the original.

**Offer**

- [x] Discount stated clearly (`15% OFF`)
- [x] Applicable plans named (`Strike Plus & Strike Ultra`)
- [x] Coupon code with one-click copy and a "Copied" confirmation
- [x] Live countdown in every state, including the minimised pill
- [x] Refresh does not reset the countdown — it counts to a fixed `endsAt`, so there is nothing to reset
- [x] Minimise control, with auto-minimise after 7s
- [x] Responsive: card and banner layouts, fluid clamps, wrapping banner row
- [x] `prefers-reduced-motion` honoured — effects skip, offer reveals immediately
- [x] Sale can be switched off or scheduled from one file

**Themes**

- [x] Three animated themes plus an unthemed base
- [x] Always-live previews in the gallery
- [x] Per-theme colour tokens, effect duration and offer position
- [x] Each theme downloadable as a self-contained zip

---

## Technical approach

### Layout must never move

The hard rule: **a theme may change colour, never layout.** `ThemeMeta.tokens` can only set CSS
custom properties, and they are applied to a `<ThemeStage>` element, not to `<body>`. No theme can
introduce a class that shifts a box. Switching themes repaints the site and shifts nothing.

### The theme contract

```
themes/<id>/
  meta.ts    colours, tier, effect duration, where the offer appears
  index.ts   lazy-exported Background / Overlay layers
  *.tsx|ts   the animation itself
```

Registration is two lines in [lib/theme/registry.ts](lib/theme/registry.ts). Metadata is eager
because it is tiny; layer code is dynamically imported so only the active theme ships JavaScript.

### Effects unmount

`ThemeEffectLayer` holds a theme's layers for `effectHoldMs` (default 5s), fades them over 1.6s,
then **removes them from the tree**. A finished animation costs nothing — no idle RAF loop, no
detached canvas. Only the colour tokens persist.

### Themes know nothing about the sale

A theme declares a position and calls `revealOffer()`. It never imports `SaleOffer`, `Countdown`
or the sale content. `OfferSlot` owns everything shared — reveal, placement, the 7s collapse timer,
and the FLIP travel to its docked position — so all three themes get identical offer behaviour for
free, and a fourth theme gets it without writing any offer code.

### Content is data

Everything about the sale lives in [content/sale.content.ts](content/sale.content.ts): copy,
coupon, CTA, dates, even UI labels. Nothing is hardcoded in a component. `enabled: false` pulls the
offer sitewide; `startsAt` / `endsAt` schedule the window.

### Countdown is headless

`useCountdown` recomputes from `Date.now()` each tick rather than decrementing, so a throttled
background tab cannot accumulate drift, and it stops ticking entirely while the tab is hidden,
resyncing on return. `Countdown` renders only `<span>`s so it can be dropped inline anywhere.

### Animation discipline

Every GSAP call goes through `useGsapContext`, which reverts tweens on unmount and pauses
**infinitely repeating** animations when the tab is hidden or the scope scrolls off-screen. One-shot
tweens are deliberately excluded — pausing a `from()` mid-flight strands its target at `opacity: 0`.
Anything random is seeded (mulberry32) so render stays pure and results are reproducible.

### Downloadable themes

[scripts/build-theme-zips.mjs](scripts/build-theme-zips.mjs) packages each theme with the runtime
helpers it needs and a generated README into `public/downloads/<id>.zip`. It runs on `prebuild`, so
a download is never stale relative to the source.

### Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind v4 (`@theme inline`
tokens) · GSAP 3.15 · jszip (build-time only).

---

## Themes

| Theme | Tier | Effect | Offer |
| --- | --- | --- | --- |
| Strike Base | light | none | — |
| Lightning | medium | Bolt strikes the hero from the bottom-left | Card, bottom-left |
| Gift Box | medium | Box peeps in, lid blows off, confetti (14.5s) | Card, top-left |
| Fireworks | heavy | Ground rig, 3 rounds / 18 launches (11.5s) | Banner, top |

---

## Known limitations

- **The offer is opt-in.** The default theme carries no offer, so a visitor who never reaches the
  Offer Themes section never sees the sale. Deliberate — the offer is a reward for engaging — but it
  does mean the sale is not visible on a cold load.
- **No dismiss, only minimise.** The offer collapses to a pill; it cannot be removed for the session.
- **Expiry is cosmetic.** At zero the countdown reads "Offer ended", but the coupon and CTA stay
  interactive, and `saleIsLive` is evaluated once at module load so a mid-session expiry is not
  caught.
- **Nothing persists.** No `localStorage`; a refresh returns to the base theme. The countdown is
  unaffected because it targets a fixed date.
- **Clipboard failures are silent.** If the Clipboard API is blocked there is no fallback UI, though
  the code itself stays readable on screen.
- **Course artwork is a CSS stand-in.** The original course card images were not publicly
  retrievable, so `CourseArt` draws a placeholder. Plan and mentor images are real.
- **Content is static.** No CMS or API; everything is typed TypeScript in `content/`.
