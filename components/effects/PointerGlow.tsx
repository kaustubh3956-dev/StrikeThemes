"use client";

import { useEffect, useRef } from "react";
import { initGsap } from "@/lib/gsap/gsap.client";
import { prefersReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * Soft glow trailing the pointer. Drives only `transform` via quickTo, so it
 * never re-renders React and never touches layout.
 */
export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const gsap = initGsap();
    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.34,
    });

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });

    let shown = false;
    const onMove = (event: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.8 });
      }
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const onLeave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.6 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 opacity-0"
      style={{
        zIndex: 1,
        width: "clamp(22rem, 46vw, 44rem)",
        aspectRatio: "1",
        background:
          "radial-gradient(circle, var(--pointer-glow) 0%, transparent 62%)",
        filter: "blur(48px)",
        willChange: "transform",
      }}
    />
  );
}
