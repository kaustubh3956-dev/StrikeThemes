import type { ComponentType } from "react";

export type ThemeTier = "light" | "medium" | "heavy";

/**
 * Props every theme layer receives. `previewMode` means the layer is rendering
 * inside a small gallery card and must cut its work down hard.
 */
export interface ThemeLayerProps {
  previewMode: boolean;
}

/**
 * Static half of a theme. Cheap enough to import eagerly for every theme, so the
 * gallery can render cards and swap colours instantly without loading any layer code.
 */
export interface ThemeMeta {
  id: string;
  name: string;
  description: string;
  tier: ThemeTier;
  /** CSS custom properties written onto :root. Keys must include the leading `--`. */
  tokens: Record<string, string>;
  /** Three colours shown on the gallery card. */
  swatches: [string, string, string];
  /** Optional class applied to <body> for effects that need a root hook. */
  bodyClass?: string;
}

/**
 * Dynamic half of a theme, code-split so only the active theme ships JS.
 * Background renders behind content, Overlay renders above it.
 */
export interface ThemeLayers {
  Background?: ComponentType<ThemeLayerProps>;
  Overlay?: ComponentType<ThemeLayerProps>;
}

export type ThemeModule = { layers: ThemeLayers };
