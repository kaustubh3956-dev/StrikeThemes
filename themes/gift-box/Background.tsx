"use client";

import { useMemo, useRef } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";
import { revealOffer } from "@/lib/theme/reveal";
import type { ThemeLayerProps } from "@/lib/theme/types";
import { GiftBoxArt } from "./GiftBoxArt";
import { makeConfetti } from "./confetti";

/** Fraction of the box left showing while it peeps around the edge. */
const PEEP_VISIBLE = 0.54;

const GREETINGS = ["Hello!", "Hi!"];

function Bubble({ className, text }: { className: string; text: string }) {
  return (
    <div
      className={`gift-bubble ${className} absolute whitespace-nowrap rounded-[var(--radius-pill)] border border-hairline bg-[color-mix(in_oklab,var(--surface-raised)_90%,transparent)] px-3 py-1.5 font-display text-[0.68rem] leading-none text-fg backdrop-blur-sm`}
    >
      {text}
      <span
        aria-hidden
        className="absolute -bottom-1 left-3 size-2 rotate-45 border-b border-r border-hairline bg-[color-mix(in_oklab,var(--surface-raised)_90%,transparent)]"
      />
    </div>
  );
}

export default function Background({ previewMode }: ThemeLayerProps) {
  const root = useRef<HTMLDivElement>(null);
  const flecks = useMemo(() => makeConfetti(previewMode ? 12 : 22), [previewMode]);

  useGsapContext(
    ({ gsap, scope }) => {
      const box = scope.querySelector<HTMLElement>(".gift-box");
      if (!box) return;

      // Both greetings are rendered; the choice happens here so render stays pure.
      const greet = Math.random() < 0.5 ? ".gift-hello" : ".gift-hi";

      // Measured, so the offsets hold at any box size or left inset.
      const width = box.offsetWidth;
      const inset = box.offsetLeft;
      const restX = 0;
      const peepX = -(inset + width * (1 - PEEP_VISIBLE));
      const hiddenX = -(inset + width + 24);

      gsap.set(".gift-box", {
        x: hiddenX,
        y: 0,
        rotation: 0,
        opacity: 1,
        transformOrigin: "50% 100%",
      });
      gsap.set(".gift-lid", { y: 0, rotation: 0, transformOrigin: "18% 100%" });
      gsap.set(".gift-eye", { transformOrigin: "50% 50%" });
      gsap.set(".gift-fleck", { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0 });
      gsap.set(".gift-glow", { opacity: 0 });
      gsap.set(".gift-bubble", {
        opacity: 0,
        scale: 0.6,
        transformOrigin: "12% 100%",
      });

      const tl = gsap.timeline({
        repeat: previewMode ? -1 : 0,
        repeatDelay: previewMode ? 1.2 : 0,
      });

      tl.to(".gift-glow", { opacity: 1, duration: 1.1, ease: "power2.out" }, 0)

        // Lean out around the edge, tilted, and have a look around. Rotating about
        // the bottom-right swings the eyes into the visible sliver.
        .to(
          ".gift-box",
          {
            x: peepX,
            rotation: 15,
            transformOrigin: "100% 100%",
            duration: 1.15,
            ease: "power2.out",
          },
          0.5
        )
        .to(".gift-pupil", { x: 3.4, duration: 0.5, ease: "power1.inOut" }, 1.8)
        // Counter-rotated so the bubble stays upright while the box leans.
        .to(
          greet,
          {
            opacity: 1,
            scale: 1,
            rotation: -15,
            duration: 0.45,
            ease: "back.out(2.2)",
          },
          1.9
        )
        .to(".gift-pupil", { x: -3.4, duration: 0.7, ease: "power1.inOut" }, 2.5)
        .to(".gift-eye", { scaleY: 0.12, duration: 0.12, yoyo: true, repeat: 1 }, 3.2)
        .to(".gift-pupil", { x: 0, duration: 0.5, ease: "power1.inOut" }, 3.4)
        .to(greet, { opacity: 0, scale: 0.7, duration: 0.3 }, 3.6)

        // Think better of it and duck back out of sight.
        .to(
          ".gift-box",
          { x: hiddenX, rotation: 0, duration: 0.9, ease: "power2.in" },
          4.1
        )

        // Then commit, and walk all the way out.
        .to(
          ".gift-box",
          {
            x: restX,
            transformOrigin: "50% 100%",
            duration: 1.5,
            ease: "back.out(1.3)",
          },
          5.6
        )
        .to(
          ".gift-box",
          { rotation: -5, duration: 0.22, yoyo: true, repeat: 3 },
          6.8
        )
        .to(".gift-eye", { scaleY: 0.12, duration: 0.12, yoyo: true, repeat: 1 }, 7.6)

        // Lid swings open and stays open while the offer is handed over.
        // y is in SVG user units, so this is a partial lift, not a launch.
        .to(
          ".gift-lid",
          { y: -24, rotation: -13, duration: 0.9, ease: "back.out(1.8)" },
          8.1
        )
        .set(".gift-fleck", { opacity: 1, scale: 1 }, 8.6)
        .to(
          ".gift-fleck",
          {
            x: (i: number) => flecks[i].dx,
            y: (i: number) => flecks[i].dy,
            rotation: (i: number) => flecks[i].rotation,
            duration: 2.4,
            ease: "power2.out",
            stagger: 0.035,
          },
          8.6
        )
        .add(() => {
          if (!previewMode) revealOffer();
        }, 9.2)
        .to(".gift-fleck", { opacity: 0, duration: 0.9 }, 10.4)

        // Lid back on, one last glance, then scurry off to the left.
        .to(".gift-lid", { y: 0, rotation: 0, duration: 0.8, ease: "power2.inOut" }, 11.4)
        .to(".gift-pupil", { x: -3.6, duration: 0.45 }, 12.1)
        .to(
          ".gift-bye",
          { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" },
          12.15
        )
        .to(".gift-bye", { opacity: 0, scale: 0.7, duration: 0.35 }, 13.5)
        .to(
          ".gift-box",
          { x: hiddenX - 140, y: 26, duration: 1.4, ease: "power2.in" },
          12.6
        )
        .to(".gift-box", { rotation: 8, duration: 0.18, yoyo: true, repeat: 7 }, 12.6)
        .to(".gift-glow", { opacity: 0, duration: 0.9 }, 13.2);
    },
    { scope: root, deps: [previewMode, flecks] }
  );

  return (
    <div ref={root} aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="gift-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 60% at 12% 96%, color-mix(in oklab, var(--accent) 15%, transparent) 0%, transparent 70%)",
        }}
      />

      <div
        className="gift-box absolute bottom-[clamp(0.75rem,3vw,2rem)] left-[clamp(1rem,5vw,4rem)] w-[clamp(96px,10vw,148px)]"
        style={{ willChange: "transform" }}
      >
        <GiftBoxArt />

        <Bubble className="gift-hello -top-7 left-[58%]" text={GREETINGS[0]} />
        <Bubble className="gift-hi -top-7 left-[58%]" text={GREETINGS[1]} />
        <Bubble className="gift-bye -top-7 left-[58%]" text="Bye!" />

        <div className="absolute left-1/2 top-[20%] size-0">
          {flecks.map((fleck, i) => (
            <span
              key={i}
              className="gift-fleck absolute block"
              style={{
                width: fleck.size,
                height: fleck.round ? fleck.size : fleck.size * 0.45,
                borderRadius: fleck.round ? "9999px" : "1px",
                background: fleck.color,
                willChange: "transform",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
