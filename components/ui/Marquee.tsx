"use client";

import { useRef, type ReactNode } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";

/**
 * Seamless loop: the track is rendered twice and shifted by exactly -50%,
 * so the wrap point lands on identical content and never snaps.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGsapContext(
    ({ gsap }) => {
      const tween = gsap.to(".marquee-track", {
        xPercent: reverse ? 50 : -50,
        duration: speed,
        ease: "none",
        repeat: -1,
      });

      if (reverse) gsap.set(".marquee-track", { xPercent: -50 });

      const el = root.current;
      if (!el) return;

      const onEnter = () => gsap.to(tween, { timeScale: 0.25, duration: 0.4 });
      const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root, deps: [speed, reverse] }
  );

  return (
    <div
      ref={root}
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max">
        {children}
        <span aria-hidden className="contents">
          {children}
        </span>
      </div>
    </div>
  );
}
