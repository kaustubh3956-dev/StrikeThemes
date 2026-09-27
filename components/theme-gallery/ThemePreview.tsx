"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { themeLoaders } from "@/lib/theme/registry";
import type { ThemeLayers, ThemeMeta } from "@/lib/theme/types";
import { prefersReducedMotion } from "@/lib/motion/useReducedMotion";

const HOVER_INTENT_MS = 120;

/**
 * Renders a theme's own background inside a card. Tokens are scoped to this
 * container rather than :root, so the preview never affects the live page.
 */
export function ThemePreview({
  meta,
  active,
}: {
  meta: ThemeMeta;
  active: boolean;
}) {
  const [layers, setLayers] = useState<ThemeLayers | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      setLayers(null);
      return;
    }

    const loader = themeLoaders[meta.id];
    if (!loader) return;

    let cancelled = false;
    timer.current = setTimeout(() => {
      loader().then((mod) => {
        if (!cancelled) setLayers(mod.layers);
      });
    }, HOVER_INTENT_MS);

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
      setLayers(null);
    };
  }, [active, meta.id]);

  const Background = layers?.Background;

  return (
    <div
      aria-hidden
      className="relative h-28 overflow-hidden rounded-[var(--radius-lg)] border border-hairline"
      style={
        {
          ...(meta.tokens as CSSProperties),
          background: "var(--surface-base)",
          contain: "strict",
        } as CSSProperties
      }
    >
      {Background ? (
        <Background previewMode />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${meta.swatches[0]}, ${meta.swatches[1]})`,
          }}
        />
      )}
    </div>
  );
}
