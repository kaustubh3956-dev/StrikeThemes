"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { initGsap } from "@/lib/gsap/gsap.client";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import type { ThemeLayerProps } from "./types";

/** How long a theme's effects hold before dissolving back to the base site. */
const HOLD_MS = 5000;
const FADE_SECONDS = 1.6;

/**
 * Wraps a live theme layer and fades it out after a few seconds, then unmounts
 * it so nothing keeps animating off-screen. Preview cards bypass this and keep
 * running. Remounted by key whenever a theme is re-applied.
 */
export function ThemeEffectLayer({
  Layer,
  className,
  zIndex,
}: {
  Layer: ComponentType<ThemeLayerProps>;
  className: string;
  zIndex: string | number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [retired, setRetired] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      const id = setTimeout(() => setRetired(true), HOLD_MS);
      return () => clearTimeout(id);
    }

    const gsap = initGsap();
    const tween = gsap.to(element, {
      opacity: 0,
      duration: FADE_SECONDS,
      delay: HOLD_MS / 1000,
      ease: "power2.inOut",
      onComplete: () => setRetired(true),
    });

    return () => {
      tween.kill();
    };
  }, []);

  if (retired) return null;

  return (
    <div ref={host} className={className} style={{ zIndex }}>
      <Layer previewMode={false} />
    </div>
  );
}
