import type { ThemeMeta, ThemeModule } from "./types";
import baseMeta from "@/themes/base/meta";
import lightningMeta from "@/themes/lightning/meta";
import giftBoxMeta from "@/themes/gift-box/meta";
import fireworksMeta from "@/themes/fireworks/meta";

/**
 * Adding a theme = drop a folder in themes/ and add one entry to each map below.
 * Metadata is eager (tiny); layer code is lazy so only the active theme ships JS.
 */
export const themeMetas: ThemeMeta[] = [
  baseMeta,
  lightningMeta,
  giftBoxMeta,
  fireworksMeta,
];

export const themeLoaders: Record<string, () => Promise<ThemeModule>> = {
  base: () => import("@/themes/base"),
  lightning: () => import("@/themes/lightning"),
  "gift-box": () => import("@/themes/gift-box"),
  fireworks: () => import("@/themes/fireworks"),
};

export const DEFAULT_THEME_ID = "base";

export function getThemeMeta(id: string): ThemeMeta {
  return themeMetas.find((meta) => meta.id === id) ?? baseMeta;
}
