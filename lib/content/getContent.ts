import { siteContent } from "@/content/site.content";
import { saleContent } from "@/content/sale.content";
import type { SaleOffer, SiteContent } from "@/content/types";

export function getContent(): SiteContent {
  return siteContent;
}

export function getSale(): SaleOffer {
  return saleContent;
}

export function isSaleLive(sale: SaleOffer, now: number): boolean {
  if (!sale.enabled) return false;

  const ends = Date.parse(sale.endsAt);
  if (Number.isNaN(ends)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[sale] endsAt is not a valid date: ${sale.endsAt}`);
    }
    return false;
  }

  const starts = sale.startsAt
    ? Date.parse(sale.startsAt)
    : Number.NEGATIVE_INFINITY;

  return now >= starts && now < ends;
}

/**
 * Evaluated once on module load rather than during render, so reading the clock
 * cannot make a component impure. A sale window does not change mid-visit.
 */
export const saleIsLive = isSaleLive(saleContent, Date.now());
