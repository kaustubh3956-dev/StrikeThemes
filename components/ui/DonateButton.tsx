"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, HeartIcon } from "@/components/ui/icons";

const UPI_ID = "kaustubh11559@ptyes";

/** Optional tip jar for the person who built the themes. */
export function DonateButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked by permissions; the ID stays readable regardless.
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-hairline px-5 py-2.5 text-step--1 text-fg-muted transition-colors duration-[var(--dur)] hover:border-[var(--accent-hairline)] hover:text-fg"
      >
        <HeartIcon className="size-4 text-accent" />
        Donate
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Support the developer"
          className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-[min(88vw,17rem)] rounded-[var(--radius-xl)] border border-hairline-strong bg-[color-mix(in_oklab,var(--surface-raised)_94%,transparent)] p-4 backdrop-blur-xl"
        >
          <p className="m-0 text-step--2 text-fg-muted">
            If these themes were useful, a small tip is very welcome. Entirely optional.
          </p>

          <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-lg)] border border-hairline bg-merged p-1 pl-3">
            <code className="truncate font-mono text-[0.72rem] text-fg">
              {UPI_ID}
            </code>
            <button
              type="button"
              onClick={copy}
              aria-label={`Copy UPI ID ${UPI_ID}`}
              className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-pill)] px-3 py-1.5 text-[0.66rem] font-medium text-fg-muted transition-colors duration-[var(--dur-fast)] hover:text-accent"
            >
              {copied ? <CheckIcon className="size-3 text-accent" /> : null}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
