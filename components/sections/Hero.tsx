"use client";

import { useRef } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";
import { ButtonLink } from "@/components/ui/Button";
import { getContent } from "@/lib/content/getContent";

const { hero } = getContent();

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGsapContext(
    ({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: "strike-entrance" } });

      tl.from(".hero-top", { yPercent: 40, opacity: 0, duration: 0.8 })
        .from(
          ".hero-word",
          { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.07 },
          "-=0.55"
        )
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { y: 14, opacity: 0, duration: 0.6 }, "-=0.45")
        .to(".hero-accent", { "--accent-reveal": 1, duration: 1.1 }, "-=0.8");
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      data-theme-slot="hero"
      className="relative flex min-h-[max(26rem,calc(100dvh-15rem))] flex-col items-center justify-center px-[var(--gutter)] pt-[clamp(2.5rem,5vw,5rem)] text-center"
    >
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
      <h1 className="m-0 flex flex-col items-center font-display">
        <span className="hero-top block text-step-2 text-fg-muted">
          {hero.titleTop}
        </span>
        <span className="mt-1.5 block text-step-5 leading-[1.02] text-fg">
          <span className="hero-word inline-block">{hero.titleBottom}</span>{" "}
          <span
            className="hero-word hero-accent inline-block"
            style={
              {
                "--accent-reveal": 0,
                textShadow:
                  "0 0 calc(var(--accent-reveal, 0) * 26px) oklch(from var(--accent) l c h / 0.3)",
              } as React.CSSProperties
            }
          >
            {hero.titleAccent}
          </span>
        </span>
      </h1>

      <p className="hero-sub mt-6 max-w-[42ch] text-step-0 text-fg-muted">
        {hero.subtitle}
      </p>

      <ButtonLink href={hero.cta.href} className="hero-cta mt-8">
        {hero.cta.label}
      </ButtonLink>
      </div>
    </div>
  );
}
