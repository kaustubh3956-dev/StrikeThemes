"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { ThemePreview } from "./ThemePreview";
import { CloseIcon, PaletteIcon } from "@/components/ui/icons";

const tierLabel: Record<string, string> = {
  light: "Light",
  medium: "Medium",
  heavy: "Heavy",
};

export function ThemeGallery() {
  const { metas, activeId, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Nothing to pick between until a second theme is registered.
  if (metas.length < 2) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="theme-gallery"
        className="fixed bottom-6 right-6 z-[60] inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-hairline-strong bg-[color-mix(in_oklab,var(--surface-base)_82%,transparent)] px-5 py-3 text-step--1 text-fg backdrop-blur-xl transition-colors duration-[var(--dur)] hover:border-[var(--accent-hairline)]"
      >
        {open ? (
          <CloseIcon className="size-4 text-accent" />
        ) : (
          <PaletteIcon className="size-4 text-accent" />
        )}
        Themes
      </button>

      <aside
        id="theme-gallery"
        aria-label="Theme gallery"
        className={clsx(
          "fixed bottom-24 right-6 z-[60] w-[min(92vw,22rem)] origin-bottom-right rounded-[var(--radius-2xl)] border border-hairline-strong bg-[color-mix(in_oklab,var(--surface-base)_92%,transparent)] p-4 backdrop-blur-2xl transition-[opacity,transform] duration-[var(--dur)] ease-[var(--ease-out)]",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <p className="m-0 mb-3 px-1 font-mono text-step--2 uppercase tracking-[0.2em] text-fg-muted">
          Sale themes
        </p>

        <ul
          className="m-0 flex max-h-[60vh] list-none flex-col gap-3 overflow-y-auto p-0"
          onPointerLeave={() => setHovered(null)}
        >
          {metas.map((meta) => {
            const isActive = meta.id === activeId;
            return (
              <li key={meta.id}>
                <button
                  type="button"
                  onClick={() => setTheme(meta.id)}
                  onPointerEnter={() => setHovered(meta.id)}
                  onFocus={() => setHovered(meta.id)}
                  aria-pressed={isActive}
                  className={clsx(
                    "w-full rounded-[var(--radius-xl)] border p-3 text-left transition-colors duration-[var(--dur)]",
                    isActive
                      ? "border-[var(--accent-hairline)] bg-merged"
                      : "border-hairline hover:bg-merged"
                  )}
                >
                  <ThemePreview meta={meta} active={hovered === meta.id} />

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-step--1 text-fg">{meta.name}</span>
                    <span className="rounded-[var(--radius-sm)] border border-hairline px-1.5 py-0.5 font-mono text-step--2 text-fg-muted">
                      {tierLabel[meta.tier]}
                    </span>
                    {isActive ? (
                      <span className="ml-auto font-mono text-step--2 text-accent">
                        Active
                      </span>
                    ) : null}
                  </div>
                  <p className="m-0 mt-1.5 text-step--2 text-fg-muted">
                    {meta.description}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
