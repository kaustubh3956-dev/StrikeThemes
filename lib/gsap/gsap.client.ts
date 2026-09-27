import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/** Registers GSAP plugins and project eases exactly once, client-side only. */
export function initGsap() {
  if (registered || typeof window === "undefined") return gsap;
  registered = true;

  gsap.registerPlugin(ScrollTrigger, CustomEase);

  CustomEase.create("strike-entrance", "M0,0 C0.16,1 0.3,1 1,1");

  gsap.defaults({ ease: "strike-entrance", duration: 0.62 });
  gsap.ticker.lagSmoothing(200, 24);

  return gsap;
}
