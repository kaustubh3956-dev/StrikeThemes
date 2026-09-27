"use client";

import { useMemo, useRef } from "react";
import { useGsapContext } from "@/lib/gsap/useGsapContext";
import { highlight, tokenColor } from "@/lib/code/highlight";
import { getContent } from "@/lib/content/getContent";
import { PlayIcon } from "@/components/ui/icons";

const { codePanel } = getContent();

export function CodeEditorPanel() {
  const root = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => highlight(codePanel.code), []);

  useGsapContext(
    ({ gsap }) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      tl.from(root.current, { y: 40, opacity: 0, duration: 0.8 })
        .from(
          ".code-line",
          {
            clipPath: "inset(0 100% 0 0)",
            duration: 0.34,
            ease: "none",
            stagger: 0.055,
          },
          "-=0.35"
        )
        .from(".code-out", { opacity: 0, y: 6, duration: 0.3, stagger: 0.12 });

      gsap.to(".code-caret", {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });
    },
    { scope: root }
  );

  return (
    <div className="shell pt-[clamp(1rem,4vw,3.5rem)]">
      <div
        ref={root}
        data-theme-slot="code-panel"
        className="overflow-hidden rounded-[var(--radius-3xl)] border border-hairline bg-surface-sunken shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center gap-4 border-b border-hairline px-5 py-3.5">
          <div className="flex gap-2" aria-hidden>
            {["#3f3f46", "#3f3f46", "#3f3f46"].map((color, i) => (
              <span
                key={i}
                className="size-3 rounded-full"
                style={{ background: color }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 rounded-[var(--radius-lg)] border border-hairline bg-merged px-3.5 py-1.5">
            <span className="font-mono text-step--2 text-accent">&lt;/&gt;</span>
            <span className="font-mono text-step--2 text-fg-secondary">
              {codePanel.filename}
            </span>
            <span className="size-1.5 rounded-full bg-accent-gold" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="rounded-[var(--radius-sm)] border border-[var(--accent-hairline)] px-2.5 py-1 font-mono text-step--2 uppercase tracking-[0.16em] text-accent-electric">
              {codePanel.status}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-fg px-4 py-2 text-step--2 font-medium text-surface-base transition-colors duration-[var(--dur-fast)] hover:bg-accent"
            >
              <PlayIcon className="size-3" />
              {codePanel.runLabel}
            </button>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[1.55fr_1fr]">
          <pre className="m-0 overflow-x-auto p-6 font-mono text-step--1 leading-[1.75]">
            <code>
              {lines.map((tokens, i) => (
                <span key={i} className="code-line block whitespace-pre">
                  <span
                    className="mr-5 inline-block w-5 select-none text-right opacity-35"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {i + 1}
                  </span>
                  {tokens.map((token, j) => (
                    <span key={j} style={{ color: tokenColor[token.type] }}>
                      {token.value}
                    </span>
                  ))}
                </span>
              ))}
            </code>
          </pre>

          <div className="border-t border-hairline p-6 font-mono text-step--1 leading-[1.9] md:border-l md:border-t-0">
            <p className="m-0 mb-3 text-step--2 uppercase tracking-[0.2em] text-fg-muted">
              Output
            </p>
            {codePanel.output.map((line, i) => (
              <p
                key={i}
                className="code-out m-0"
                style={{
                  color: i === 0 ? "var(--fg-muted)" : "var(--accent-electric)",
                }}
              >
                {line}
              </p>
            ))}
            <span className="code-caret mt-1 inline-block h-4 w-2 align-middle bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
