import type { ThemeMeta } from "@/lib/theme/types";

export const meta: ThemeMeta = {
  id: "fireworks",
  name: "Fireworks",
  description:
    "Three waves of mortars light the sky at varying heights, then the offer banners across the top.",
  tier: "heavy",
  tokens: {},
  effectHoldMs: 11500,
  offer: {
    position: "top-left",
    layout: "banner",
  },
  swatches: ["#000000", "#232323", "#edb200"],
};

export default meta;
