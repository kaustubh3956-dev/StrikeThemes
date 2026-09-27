"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { initGsap } from "@/lib/gsap/gsap.client";
import { prefersReducedMotion } from "@/lib/motion/useReducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Gsap = typeof import("gsap").gsap;
type MatchMedia = ReturnType<Gsap["matchMedia"]>;
type Pausable = { pause: () => void; resume: () => void };

export interface GsapSetupArgs {
  gsap: Gsap;
  /** Pre-created matchMedia instance; reverted automatically with the context. */
  mm: MatchMedia;
  scope: HTMLElement;
}

export interface UseGsapContextOptions {
  scope: RefObject<HTMLElement | null>;
  deps?: unknown[];
  /** Skip the animation entirely when the user asked for reduced motion. */
  respectReducedMotion?: boolean;
  /** Pause this context's tweens while the tab is hidden. */
  pauseWhenHidden?: boolean;
}

/**
 * The single sanctioned way to run GSAP in this project. Reverts every tween,
 * ScrollTrigger and inline style on unmount, so switching themes cannot leak
 * animations onto the next one.
 */
export function useGsapContext(
  setup: (args: GsapSetupArgs) => void,
  {
    scope,
    deps = [],
    respectReducedMotion = true,
    pauseWhenHidden = true,
  }: UseGsapContextOptions
) {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useIsomorphicLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;
    if (respectReducedMotion && prefersReducedMotion()) return;

    const gsap = initGsap();
    let mm: MatchMedia | undefined;

    const ctx = gsap.context(() => {
      mm = gsap.matchMedia();
      setupRef.current({ gsap, mm, scope: element });
    }, element);

    // Keeping tweens off the ticker while hidden avoids a burst of catch-up work on return.
    const animations = () =>
      (ctx.data as unknown[]).filter(
        (item) =>
          item instanceof gsap.core.Tween || item instanceof gsap.core.Timeline
      ) as Pausable[];

    const onVisibility = () => {
      const hidden = document.hidden;
      animations().forEach((anim) => (hidden ? anim.pause() : anim.resume()));
    };

    if (pauseWhenHidden) {
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      if (pauseWhenHidden) {
        document.removeEventListener("visibilitychange", onVisibility);
      }
      mm?.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
