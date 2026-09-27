"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { themeLoaders } from "@/lib/theme/registry";
import type { ThemeLayers, ThemeMeta } from "@/lib/theme/types";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

/**
 * Runs the theme's own background continuously so every option can be compared
 * at a glance. Tokens are scoped to this container, so a preview can never
 * affect the live page. Layer code is fetched only once the card nears the
 * viewport, and its loops are paused off-screen by useGsapContext.
 */
export function ThemePreview({ meta }: { meta: ThemeMeta }) {
  const [layers, setLayers] = useState<ThemeLayers | null>(null);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const element = host.current;
    const loader = themeLoaders[meta.id];
    if (!element || !loader) return;

    let cancelled = false;
    const load = () => {
      loader().then((mod) => {
        if (!cancelled) setLayers(mod.layers);
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      load();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [meta.id]);

  const Background = layers?.Background;

  return (
    <div
      ref={host}
      aria-hidden
      className="relative h-36 overflow-hidden rounded-[var(--radius-lg)] border border-hairline"
      style={
        {
          ...(meta.tokens as CSSProperties),
          background: `linear-gradient(140deg, ${meta.swatches[0]}, ${meta.swatches[1]})`,
          contain: "strict",
        } as CSSProperties
      }
    >
      {Background ? <Background previewMode /> : null}
    </div>
  );
}
