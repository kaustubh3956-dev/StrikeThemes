"use client";

import { useState } from "react";
import clsx from "clsx";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ChevronIcon } from "@/components/ui/icons";
import { getContent } from "@/lib/content/getContent";

const { faq } = getContent();

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeader title={faq.title} blurb={faq.blurb} />

      <ul className="mx-auto mt-14 flex max-w-3xl list-none flex-col gap-3 p-0">
        {faq.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <li
              key={item.question}
              className={clsx(
                "overflow-hidden rounded-[var(--radius-xl)] border transition-colors duration-[var(--dur)]",
                isOpen
                  ? "border-[var(--accent-hairline)] bg-merged"
                  : "border-hairline"
              )}
            >
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-5 px-6 py-5 text-left text-step-0 text-fg"
                >
                  {item.question}
                  <ChevronIcon
                    className={clsx(
                      "ml-auto size-5 shrink-0 text-accent transition-transform duration-[var(--dur)] ease-[var(--ease-out)]",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
              </h3>

              <div
                id={`faq-panel-${i}`}
                hidden={!isOpen}
                className="px-6 pb-6 text-step--1 text-fg-muted"
              >
                {item.answer}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
