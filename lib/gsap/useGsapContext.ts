"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { initGsap } from "@/lib/gsap/gsap.client";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Gsap = typeof import("gsap").gsap;
type MatchMedia = ReturnType<Gsap["matchMedia"]>;
type Pausable = {
  pause: () => void;
  resume: () => void;
  repeat?: () => number;
};

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
  /** Pause while the scope element is scrolled out of view. */
  pauseWhenOffscreen?: boolean;
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
    pauseWhenOffscreen = true,
  }: UseGsapContextOptions
) {
  const setupRef = useRef(setup);

  useIsomorphicLayoutEffect(() => {
    setupRef.current = setup;
  });

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

    // Keeping tweens off the ticker while hidden or out of view avoids burning
    // frames on work nobody can see, and a catch-up burst when they return.
    const animations = () =>
      (ctx.data as unknown[]).filter(
        (item) =>
          item instanceof gsap.core.Tween || item instanceof gsap.core.Timeline
      ) as Pausable[];

    // Only looping animations are worth gating. One-shot entrances must always be
    // allowed to finish: pausing a `from()` tween strands its target at opacity 0,
    // which leaves the page looking blank if it loaded hidden or out of view.
    const loops = () =>
      animations().filter(
        (anim) => typeof anim.repeat === "function" && anim.repeat() === -1
      );

    let hidden = document.hidden;
    let offscreen = false;

    const sync = () => {
      const shouldPause = hidden || offscreen;
      loops().forEach((anim) => (shouldPause ? anim.pause() : anim.resume()));
    };

    const onVisibility = () => {
      hidden = document.hidden;
      sync();
    };

    if (pauseWhenHidden) {
      document.addEventListener("visibilitychange", onVisibility);
    }

    let observer: IntersectionObserver | undefined;
    if (pauseWhenOffscreen && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          offscreen = !entries[0].isIntersecting;
          sync();
        },
        { rootMargin: "120px" }
      );
      observer.observe(element);
    }

    return () => {
      if (pauseWhenHidden) {
        document.removeEventListener("visibilitychange", onVisibility);
      }
      observer?.disconnect();
      mm?.revert();
      ctx.revert();
    };
  }, deps);
}
