import type { SaleOffer } from "./types";

/**
 * The whole sale lives here: no offer copy, coupon or date appears anywhere else.
 * Set `enabled: false` to pull the offer without touching a theme, and use
 * `startsAt` / `endsAt` (ISO 8601 with an offset) to schedule the window.
 */
export const saleContent: SaleOffer = {
  id: "end-of-monsoon",
  enabled: true,

  kicker: "End of Monsoon",
  badge: "Limited Drop",
  discountLabel: "15% OFF",
  appliesTo: "Strike Plus & Strike Ultra",
  coupon: "STRIKE15",
  cta: { label: "Claim 15% OFF", href: "/membership/ultra" },

  countdownLabel: "Ends in",
  endsAt: "2026-12-31T23:59:59+05:30",

  labels: {
    copy: "Copy",
    copied: "Copied",
    minimise: "Minimise offer",
    showDetails: "Show offer details",
    expired: "Offer ended",
  },
};
