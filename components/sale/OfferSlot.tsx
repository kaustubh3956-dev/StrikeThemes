"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { initGsap } from "@/lib/gsap/gsap.client";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import { onRevealOffer } from "@/lib/theme/reveal";
import type { ThemeOfferConfig, OfferPosition } from "@/lib/theme/types";
import { SaleOffer } from "./SaleOffer";

const COLLAPSE_AFTER_MS = 7000;

const positions: Record<OfferPosition, string> = {
  "bottom-left": "bottom-[clamp(1rem,3vw,2rem)] left-[clamp(1rem,3vw,2rem)]",
  "bottom-right": "bottom-[clamp(1rem,3vw,2rem)] right-[clamp(1rem,3vw,2rem)]",
  "bottom-center": "bottom-[clamp(1rem,3vw,2rem)] inset-x-0 flex justify-center",
  "top-left": "top-[clamp(5.25rem,8vw,6.5rem)] left-[clamp(1rem,3vw,2rem)]",
  "top-right": "top-[clamp(5.25rem,8vw,6.5rem)] right-[clamp(1rem,3vw,2rem)]",
};

/** Resting place once the offer has minimised: under the navbar, top left. */
const DOCK = "top-[clamp(5.25rem,8vw,6.5rem)] left-[var(--gutter)]";

/** Banner spans the top until it docks, clearing the navbar rather than covering it. */
const BANNER = "top-[clamp(5.25rem,8vw,6.5rem)] inset-x-0";

/**
 * Owns everything shared about the offer: when it appears, where it sits, when
 * it minimises and how it travels to its docked position. Themes only declare a
 * starting position and call revealOffer().
 */
export function OfferSlot({ offer }: { offer: ThemeOfferConfig }) {
  const [revealed, setRevealed] = useState(
    () => Boolean(offer.revealImmediately) || prefersReducedMotion()
  );
  const [expanded, setExpanded] = useState(true);
  const [docked, setDocked] = useState(false);

  const card = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipFrom = useRef<DOMRect | null>(null);
  const travelling = useRef(false);
  const hovering = useRef(false);

  useEffect(() => {
    if (revealed) return;
    return onRevealOffer(() => setRevealed(true));
  }, [revealed]);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const collapse = useCallback(() => {
    clearTimer();
    setDocked((wasDocked) => {
      // Only the first minimise travels, so only then is a FLIP needed.
      if (!wasDocked && card.current && !prefersReducedMotion()) {
        flipFrom.current = card.current.getBoundingClientRect();
      }
      return true;
    });
    setExpanded(false);
  }, []);

  const scheduleCollapse = useCallback(() => {
    clearTimer();
    timer.current = setTimeout(collapse, COLLAPSE_AFTER_MS);
  }, [collapse]);

  const open = useCallback(() => {
    hovering.current = true;
    clearTimer();
    // Stay minimised for the whole journey to the dock.
    if (travelling.current) return;
    setExpanded(true);
  }, []);

  const collapseSoon = useCallback(() => {
    hovering.current = false;
    scheduleCollapse();
  }, [scheduleCollapse]);

  useEffect(() => {
    if (!revealed) return;
    scheduleCollapse();
    return clearTimer;
  }, [revealed, scheduleCollapse]);

  // Entrance.
  useEffect(() => {
    if (!revealed || !card.current || prefersReducedMotion()) return;

    const gsap = initGsap();
    const tween = gsap.fromTo(
      card.current,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "strike-entrance" }
    );

    return () => {
      tween.kill();
    };
  }, [revealed]);

  // Travel from the old position to the dock, so it never appears to teleport.
  // Keyed on `docked` alone: re-running mid-flight would kill the tween and
  // strand the card on a half-applied transform.
  useLayoutEffect(() => {
    const element = card.current;
    const from = flipFrom.current;
    flipFrom.current = null;
    if (!element || !from) return;

    const to = element.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (!dx && !dy) return;

    const gsap = initGsap();
    travelling.current = true;

    const tween = gsap.fromTo(
      element,
      { x: dx, y: dy },
      {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "strike-entrance",
        onComplete: () => {
          travelling.current = false;
          if (hovering.current) setExpanded(true);
        },
      }
    );

    return () => {
      travelling.current = false;
      tween.kill();
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [docked]);

  if (!revealed) return null;

  // A banner collapses into the standard docked card, so the layout only
  // applies while it is still in its opening position.
  const asBanner = offer.layout === "banner" && !docked;
  const placement = docked ? DOCK : asBanner ? BANNER : positions[offer.position];

  return (
    <div
      className={`pointer-events-none fixed ${placement}`}
      style={{ zIndex: 40 }}
    >
      <div ref={card}>
        <SaleOffer
          variant={asBanner ? "banner" : "card"}
          expanded={expanded}
          onOpen={open}
          onCollapseSoon={collapseSoon}
          onCollapseNow={collapse}
        />
      </div>
    </div>
  );
}
