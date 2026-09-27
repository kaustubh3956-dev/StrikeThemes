"use client";

import { useMemo, useRef } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";
import { revealOffer } from "@/lib/theme/reveal";
import type { ThemeLayerProps } from "@/lib/theme/types";
import { makeFireworks, type BurstKind } from "./fireworks";
import { GroundRig } from "./GroundRig";

/** Each burst type falls away differently, which is what sells the variety. */
const SPREAD: Record<BurstKind, { duration: number; ease: string; fade: number }> = {
  ring: { duration: 1.5, ease: "power3.out", fade: 0.9 },
  willow: { duration: 2.3, ease: "power1.out", fade: 1.5 },
  crackle: { duration: 0.8, ease: "power4.out", fade: 0.45 },
};

export default function Background({ previewMode }: ThemeLayerProps) {
  const root = useRef<HTMLDivElement>(null);
  const launches = useMemo(
    () => makeFireworks(previewMode ? 0.5 : 1),
    [previewMode]
  );

  useGsapContext(
    ({ gsap, scope }) => {
      // Apex is a fraction of the stage, so the climb has to be measured at runtime.
      const stageHeight = scope.clientHeight || 600;
      const groundOffset = 96;

      gsap.set(".fw-shell", { opacity: 0, y: 0, scaleY: 1, scaleX: 1 });
      gsap.set(".fw-spark", { opacity: 0, x: 0, y: 0, scale: 0.4 });
      gsap.set(".fw-flash", { opacity: 0, scale: 0.6 });
      gsap.set(".fw-pop", { opacity: 0, scale: 0.2 });
      gsap.set(".fw-smoke", { opacity: 0, scale: 0.5, y: 0 });
      gsap.set(".fw-haze", { opacity: 0 });

      const tl = gsap.timeline({
        repeat: previewMode ? -1 : 0,
        repeatDelay: previewMode ? 0.5 : 0,
      });

      tl.to(".fw-haze", { opacity: 1, duration: 1.2 }, 0);

      launches.forEach((launch, i) => {
        const shell = `.fw-shell-${i}`;
        const sparks = `.fw-burst-${i} .fw-spark`;
        const burst = launch.at + launch.rise;
        const spread = SPREAD[launch.kind];
        const climb = Math.max(
          90,
          stageHeight * (1 - launch.apex / 100) - groundOffset
        );

        tl.to(`.fw-flash-${launch.tube}`, { opacity: 1, scale: 1.35, duration: 0.1 }, launch.at)
          .to(`.fw-flash-${launch.tube}`, { opacity: 0, duration: 0.32 }, launch.at + 0.1)
          .set(`.fw-smoke-${launch.tube}`, { opacity: 0.5, scale: 0.5, y: 0 }, launch.at)
          .to(
            `.fw-smoke-${launch.tube}`,
            { opacity: 0, scale: 2.2, y: -26, duration: 1.1, ease: "power2.out" },
            launch.at + 0.05
          )

          // Rise: stretched while climbing, easing out as it loses momentum.
          .set(shell, { opacity: 1, scaleY: 3, scaleX: 0.55 }, launch.at)
          .to(shell, { y: -climb, duration: launch.rise, ease: "power2.out" }, launch.at)
          .to(
            shell,
            { scaleY: 1, scaleX: 1, duration: launch.rise * 0.55, ease: "power1.out" },
            launch.at + launch.rise * 0.45
          )
          .set(shell, { opacity: 0 }, burst)

          // A hard white flash at the moment of detonation sells the explosion.
          .set(`.fw-pop-${i}`, { opacity: 0.85, scale: 0.2 }, burst)
          .to(
            `.fw-pop-${i}`,
            { opacity: 0, scale: 2.4, duration: 0.45, ease: "power2.out" },
            burst
          )

          .set(sparks, { opacity: 1, scale: 1 }, burst)
          .to(
            sparks,
            {
              x: (j: number) => launch.sparks[j].dx,
              y: (j: number) => launch.sparks[j].dy,
              duration: spread.duration,
              ease: spread.ease,
              stagger: 0.003,
            },
            burst
          )
          .to(
            sparks,
            { opacity: 0, duration: spread.fade, ease: "power1.in" },
            burst + spread.duration * 0.35
          );
      });

      // Hand over once the opening salvo has landed.
      tl.add(() => {
        if (!previewMode) revealOffer();
      }, 2.8);

      tl.to(".fw-haze", { opacity: 0, duration: 1.2 }, "-=1.2");
    },
    { scope: root, deps: [previewMode, launches] }
  );

  return (
    <div ref={root} aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="fw-haze absolute inset-0"
        style={{
          background:
            "radial-gradient(95% 62% at 50% 100%, color-mix(in oklab, var(--accent) 13%, transparent) 0%, transparent 72%)",
        }}
      />

      {launches.map((launch, i) => (
        <div
          key={`burst-${i}`}
          className={`fw-burst-${i} absolute size-0`}
          style={{ left: `${launch.x}%`, top: `${launch.apex}%` }}
        >
          <span
            className={`fw-pop fw-pop-${i} absolute -left-10 -top-10 block size-20 rounded-full`}
            style={{
              background: `radial-gradient(circle, var(--fg) 0%, ${launch.color} 35%, transparent 70%)`,
              willChange: "transform",
            }}
          />

          {launch.sparks.map((spark, j) => (
            <span
              key={j}
              className="fw-spark absolute block rounded-full"
              style={{
                width: spark.size,
                height: spark.size,
                background: spark.core ? "var(--fg)" : launch.color,
                boxShadow: `0 0 ${spark.core ? 10 : 7}px ${
                  spark.core ? "var(--fg)" : launch.color
                }`,
                willChange: "transform",
              }}
            />
          ))}
        </div>
      ))}

      {launches.map((launch, i) => (
        <span
          key={`shell-${i}`}
          className={`fw-shell fw-shell-${i} absolute block h-2.5 w-1 rounded-full`}
          style={{
            left: `${launch.x}%`,
            bottom: "6rem",
            background: launch.color,
            boxShadow: `0 0 9px ${launch.color}`,
            willChange: "transform",
          }}
        />
      ))}

      <GroundRig />
    </div>
  );
}
