"use client";

import { useMemo, useRef } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";
import { revealOffer } from "@/lib/theme/reveal";
import type { ThemeLayerProps } from "@/lib/theme/types";
import { BOLT_H, BOLT_W, makeBolt } from "./bolt";

// Strike lands just inside the bottom-left corner so the glow reads as hitting it.
const TARGET_X = 60;
const TARGET_Y = BOLT_H - 40;

export default function Background({ previewMode }: ThemeLayerProps) {
  const root = useRef<HTMLDivElement>(null);

  const bolts = useMemo(
    () => [
      makeBolt(1020, TARGET_X + 120, TARGET_Y - 90, 240),
      makeBolt(560, TARGET_X + 60, TARGET_Y - 40, 200),
      makeBolt(770, TARGET_X, TARGET_Y, 170),
    ],
    []
  );

  useGsapContext(
    ({ gsap, scope }) => {
      const strands = gsap.utils.toArray<SVGPathElement>(".bolt-path", scope);
      strands.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
      });

      const groups = [".bolt-0", ".bolt-1", ".bolt-2"];
      const tl = gsap.timeline({
        repeat: previewMode ? -1 : 0,
        repeatDelay: previewMode ? 1.1 : 0,
      });

      tl.to(".storm", { opacity: 1, duration: 0.9, ease: "power2.out" }, 0);

      groups.forEach((selector, i) => {
        const isFinal = i === groups.length - 1;
        const at = 0.45 + i * 0.55;

        tl.to(
          `${selector} .bolt-path`,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: isFinal ? 0.2 : 0.14,
            ease: "none",
            stagger: 0.015,
          },
          at
        )
          .to(
            ".flash",
            {
              opacity: isFinal ? 0.5 : 0.14,
              duration: 0.06,
              ease: "none",
              yoyo: true,
              repeat: 1,
            },
            at + (isFinal ? 0.16 : 0.08)
          )
          .to(
            `${selector} .bolt-path`,
            { opacity: 0, duration: isFinal ? 0.5 : 0.26, ease: "power2.in" },
            at + (isFinal ? 0.3 : 0.18)
          );

        if (isFinal) {
          tl.to(".impact", { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, at + 0.16)
            .to(".impact", { opacity: 0.35, duration: 0.9, ease: "power2.out" }, at + 0.5)
            .add(() => {
              if (!previewMode) revealOffer();
            }, at + 0.18);
        }
      });

      if (!previewMode) {
        // Distant storm flicker keeps the scene alive without redrawing bolts.
        gsap.to(".storm", {
          opacity: 0.72,
          duration: 0.14,
          repeat: -1,
          repeatDelay: 5.5,
          yoyo: true,
          ease: "none",
          delay: 4,
        });
      }
    },
    { scope: root, deps: [previewMode] }
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{
        // Dissolve at the stage edge so the themed band has no hard seam.
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 76%, transparent 100%)",
      }}
    >
      <div
        className="storm absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(120% 90% at 22% 0%, color-mix(in oklab, var(--accent) 11%, transparent) 0%, transparent 58%), radial-gradient(70% 55% at 4% 98%, color-mix(in oklab, var(--accent) 9%, transparent) 0%, transparent 64%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${BOLT_W} ${BOLT_H}`}
        preserveAspectRatio="xMinYMax slice"
        fill="none"
      >
        <defs>
          <filter id="lightning-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {bolts.map((bolt, i) => (
          <g key={i} className={`bolt-${i}`} filter="url(#lightning-glow)">
            <path
              className="bolt-path"
              d={bolt.main}
              stroke="var(--accent-bright)"
              strokeWidth={i === 2 ? 3.4 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {bolt.forks.map((fork, j) => (
              <path
                key={j}
                className="bolt-path"
                d={fork}
                stroke="var(--accent)"
                strokeWidth={i === 2 ? 1.6 : 1.1}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
              />
            ))}
          </g>
        ))}

        <circle
          className="impact opacity-0"
          cx={TARGET_X}
          cy={TARGET_Y}
          r="120"
          fill="url(#lightning-impact)"
        />
        <defs>
          <radialGradient id="lightning-impact">
            <stop offset="0%" stopColor="var(--accent-bright)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div
        className="flash absolute inset-0 opacity-0"
        style={{ background: "var(--accent-bright)" }}
      />
    </div>
  );
}