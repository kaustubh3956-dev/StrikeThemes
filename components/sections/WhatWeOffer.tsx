import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getContent } from "@/lib/content/getContent";
import type { Course } from "@/content/types";

const { offer } = getContent();

const art: Record<Course["accent"], { wash: string; glow: string }> = {
  gold: {
    wash: "linear-gradient(135deg, #1a1206 0%, #0a0805 55%, #000 100%)",
    glow: "radial-gradient(70% 90% at 78% 15%, color-mix(in oklab, var(--accent-gold) 42%, transparent), transparent 70%)",
  },
  cyan: {
    wash: "linear-gradient(135deg, #04161b 0%, #050a0c 55%, #000 100%)",
    glow: "radial-gradient(70% 90% at 78% 15%, color-mix(in oklab, var(--accent) 38%, transparent), transparent 70%)",
  },
  violet: {
    wash: "linear-gradient(135deg, #120d1e 0%, #08060d 55%, #000 100%)",
    glow: "radial-gradient(70% 90% at 78% 15%, color-mix(in oklab, var(--accent-blue) 34%, transparent), transparent 70%)",
  },
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-hairline bg-merged px-2.5 py-1 text-[0.66rem] text-fg-tertiary">
      {children}
    </span>
  );
}

/** Stands in for the course key art: tinted wash, code texture and the title. */
function CourseArt({ course }: { course: Course }) {
  const tint = art[course.accent];

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden"
      style={{ background: tint.wash }}
    >
      <div className="absolute inset-0" style={{ background: tint.glow }} />

      <div
        aria-hidden
        className="absolute inset-0 font-mono text-[0.5rem] leading-[1.35] text-fg opacity-[0.07]"
        style={{ padding: "0.5rem 0.6rem", wordBreak: "break-all" }}
      >
        {"const strike = () => { while(true) { learn(); build(); ship(); } } ".repeat(
          14
        )}
      </div>

      <div className="absolute inset-0 flex items-center px-5">
        <span className="font-display text-step-1 leading-tight text-fg drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {course.title}
        </span>
      </div>

      {course.live ? (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-danger px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-fg">
          <span className="size-1.5 rounded-full bg-fg" />
          Live
        </span>
      ) : null}
    </div>
  );
}

export function WhatWeOffer() {
  return (
    <Section id="offer">
      <SectionHeader title={offer.title} blurb={offer.blurb} />

      <ul className="mt-14 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
        {offer.courses.map((course) => (
          <li key={course.href}>
            <Link
              href={course.href}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-hairline transition-colors duration-[var(--dur)] hover:border-[var(--accent-hairline)]"
            >
              <CourseArt course={course} />

              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="m-0 text-center text-step--1 text-fg-tertiary">
                  {course.stack}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {course.popular ? (
                    <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-accent-gold px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-surface-base">
                      Popular
                    </span>
                  ) : null}
                  {course.hours ? <Chip>{course.hours}</Chip> : null}
                  {course.duration ? <Chip>{course.duration}</Chip> : null}
                </div>

                <span className="mt-auto pt-3 text-center text-step--2 text-fg-muted transition-colors duration-[var(--dur)] group-hover:text-accent">
                  Explore Course &rarr;
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
