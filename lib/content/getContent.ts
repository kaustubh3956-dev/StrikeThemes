import { siteContent } from "@/content/site.content";
import type { SiteContent } from "@/content/types";

export function getContent(): SiteContent {
  return siteContent;
}
