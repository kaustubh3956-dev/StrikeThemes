import { siteContent } from "@/content/site.content";
import { saleContent } from "@/content/sale.content";
import type { SaleOffer, SiteContent } from "@/content/types";

export function getContent(): SiteContent {
  return siteContent;
}

export function getSale(): SaleOffer {
  return saleContent;
}
