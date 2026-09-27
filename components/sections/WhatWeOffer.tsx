import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowIcon } from "@/components/ui/icons";
import { getContent } from "@/lib/content/getContent";

const { offer } = getContent();

export function WhatWeOffer() {
  return (
    <Section id="offer">
      <SectionHeader title={offer.title} blurb={offer.blurb} align="start" />

      {/* Cell outlines come from each card, so a partly filled last row leaves no phantom block. */}
      <ul className="mt-12 grid list-none grid-cols-1 overflow-hidden rounded-[var(--radius-2xl)] border border-hairline p-0 md:grid-cols-2 lg:grid-cols-3">
        {offer.courses.map((course) => (
          <li
            key={course.href}
            className="bg-surface-base shadow-[0_0_0_1px_var(--hairline)]"
          >
            <Link
              href={course.href}
              className="group flex h-full flex-col gap-3 p-7 transition-colors duration-[var(--dur)] hover:bg-merged"
            >
              <span className="font-mono text-step--2 uppercase tracking-[0.2em] text-accent">
                {course.tag}
              </span>
              <span className="text-step-1 font-semibold text-fg">
                {course.title}
              </span>
              <span className="text-step--1 text-fg-muted">{course.blurb}</span>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-step--1 text-fg-tertiary">
                View course
                <ArrowIcon className="size-4 text-accent transition-transform duration-[var(--dur)] ease-[var(--ease-out)] group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
