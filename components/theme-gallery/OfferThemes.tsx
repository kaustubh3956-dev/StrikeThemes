"use client";

import clsx from "clsx";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { DEFAULT_THEME_ID } from "@/lib/theme/registry";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import { ThemePreview } from "./ThemePreview";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/icons";

const tierLabel: Record<string, string> = {
  light: "Light",
  medium: "Medium",
  heavy: "Heavy",
};

/** The sale runs four themes; empty cells keep the row readable until they exist. */
const GRID_SLOTS = 4;

export function OfferThemes() {
  const { metas, activeId, setTheme } = useTheme();

  // The reveal animation plays in the hero, so bring it into view before applying.
  const pick = (id: string) => {
    if (window.scrollY < 4 || prefersReducedMotion()) {
      window.scrollTo({ top: 0 });
      setTheme(id);
      return;
    }

    let done = false;

    const apply = () => {
      if (done) return;
      done = true;
      clearTimeout(fallback);
      window.removeEventListener("scrollend", apply);
      setTheme(id);
    };

    // scrollend is not universal, so a timer backs it up.
    window.addEventListener("scrollend", apply);
    const fallback = setTimeout(apply, 700);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const offers = metas.filter((meta) => meta.id !== DEFAULT_THEME_ID);
  const placeholders = Math.max(0, GRID_SLOTS - offers.length);
  const isThemed = activeId !== DEFAULT_THEME_ID;

  return (
    <Section id="offer-themes" tight>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          title="Offer"
          accent="Themes"
          blurb="Click a theme to apply it."
          align="start"
        />

        {isThemed ? (
          <button
            type="button"
            onClick={() => setTheme(DEFAULT_THEME_ID)}
            className="rounded-[var(--radius-pill)] border border-hairline px-5 py-2.5 text-step--1 text-fg-muted transition-colors duration-[var(--dur)] hover:border-[var(--accent-hairline)] hover:text-fg"
          >
            Clear theme
          </button>
        ) : null}
      </div>

      <ul className="m-0 mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((meta) => {
          const isActive = meta.id === activeId;
          return (
            <li key={meta.id}>
              <button
                type="button"
                onClick={() => pick(meta.id)}
                aria-pressed={isActive}
                className={clsx(
                  "group flex w-full flex-col rounded-[var(--radius-2xl)] border p-2.5 text-left transition-colors duration-[var(--dur)]",
                  isActive
                    ? "border-[var(--accent-hairline)] bg-merged"
                    : "border-hairline hover:bg-merged"
                )}
              >
                <ThemePreview meta={meta} />

                <span className="flex items-center gap-2 px-1.5 pt-3">
                  <span className="truncate text-step--1 font-semibold text-fg">
                    {meta.name}
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-step--2 text-fg-muted">
                    {tierLabel[meta.tier]}
                  </span>
                </span>

                <span className="flex items-center gap-1.5 px-1.5 pb-1 pt-1.5 font-mono text-step--2">
                  {isActive ? (
                    <span className="flex items-center gap-1.5 text-accent">
                      <CheckIcon className="size-3.5" />
                      Applied
                    </span>
                  ) : (
                    <span className="text-fg-muted transition-colors duration-[var(--dur)] group-hover:text-accent">
                      Apply
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}

        {Array.from({ length: placeholders }).map((_, i) => (
          <li key={`slot-${i}`}>
            <div
              className="flex h-full min-h-[14rem] items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-hairline-strong"
              style={{ opacity: 0.4 }}
            >
              <span className="font-mono text-step--2 uppercase tracking-[0.18em] text-fg-muted">
                Slot {offers.length + i + 1}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
