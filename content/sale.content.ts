import type { SaleOffer } from "./types";

/**
 * Sale copy lives apart from any theme so every theme renders the same offer.
 * Change `endsAt` to move the countdown target.
 */
export const saleContent: SaleOffer = {
  id: "end-of-monsoon",
  kicker: "End of Monsoon",
  badge: "Limited Drop",
  discountLabel: "15% OFF",
  appliesTo: "Strike Plus & Strike Ultra",
  coupon: "STRIKE15",
  cta: { label: "Claim 15% OFF", href: "/membership/ultra" },
  countdownLabel: "Ends in",
  endsAt: "2026-12-31T23:59:59+05:30",
};
