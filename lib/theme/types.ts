import type { ComponentType } from "react";

export type ThemeTier = "light" | "medium" | "heavy";

export type OfferPosition =
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "top-left"
  | "top-right";

export interface ThemeOfferConfig {
  position: OfferPosition;
  /** Show at once instead of waiting for the theme to call revealOffer(). */
  revealImmediately?: boolean;
}

/**
 * Props every theme layer receives. `previewMode` means the layer is rendering
 * inside a small gallery card and must cut its work down hard.
 */
export interface ThemeLayerProps {
  previewMode: boolean;
}

/**
 * Static half of a theme, and the only place a theme declares how it wants the
 * shared sale offer handled. Cheap enough to import eagerly for every theme.
 */
export interface ThemeMeta {
  id: string;
  name: string;
  description: string;
  tier: ThemeTier;
  /** CSS custom properties written onto the stage. Keys include the leading `--`. */
  tokens: Record<string, string>;
  /** Three colours shown on the gallery card. */
  swatches: [string, string, string];
  /** How long the effects hold before fading out. Defaults to 5000ms. */
  effectHoldMs?: number;
  /** Omit to render no sale offer for this theme. */
  offer?: ThemeOfferConfig;
}

/**
 * Dynamic half of a theme, code-split so only the active theme ships JS.
 * Background renders behind content, Overlay above it. Both optional; the sale
 * offer is mounted by the app, never by the theme.
 */
export interface ThemeLayers {
  Background?: ComponentType<ThemeLayerProps>;
  Overlay?: ComponentType<ThemeLayerProps>;
}

export type ThemeModule = { layers: ThemeLayers };
