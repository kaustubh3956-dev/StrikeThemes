import type { ThemeMeta } from "@/lib/theme/types";

/** No token overrides: the box is drawn from the base palette so it stays on-brand. */
export const meta: ThemeMeta = {
  id: "gift-box",
  name: "Gift Box",
  description:
    "A curious box peeps in from the left, pops its lid, hands over the offer and scurries off.",
  tier: "medium",
  tokens: {},
  // Deliberately slow: the sequence needs about fourteen seconds to play out.
  effectHoldMs: 14500,
  offer: {
    position: "top-left",
  },
  swatches: ["#000000", "#232323", "#00b7d7"],
};

export default meta;
