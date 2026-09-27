import type { ThemeMeta } from "@/lib/theme/types";

/** Deliberately no token overrides: the sale layers on top of the base palette. */
export const meta: ThemeMeta = {
  id: "lightning",
  name: "Lightning",
  description:
    "A bolt strikes the corner and the offer appears. Base palette, untouched.",
  tier: "medium",
  tokens: {},
  offer: {
    position: "bottom-left",
  },
  swatches: ["#000000", "#232323", "#00b7d7"],
};

export default meta;
