import { Section, SectionHeader } from "@/components/ui/Section";
import { featureIcons } from "@/components/ui/icons";
import { getContent } from "@/lib/content/getContent";

const { why } = getContent();

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const progress = [38, 62, 45, 88, 54, 72, 96];

export function WhyChooseUs() {
  return (
    <Section id="why">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <SectionHeader title={why.title} blurb={why.blurb} align="start" />

          <ul className="mt-10 grid list-none grid-cols-1 gap-x-8 gap-y-7 p-0 sm:grid-cols-2">
            {why.features.map((feature) => {
              const Icon = featureIcons[feature.icon];
              return (
                <li key={feature.title} className="flex flex-col gap-2.5">
                  <span className="inline-flex size-10 items-center justify-center rounded-[var(--radius-lg)] border border-hairline bg-merged text-accent">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-step-0 font-semibold text-fg">
                    {feature.title}
                  </span>
                  <span className="text-step--1 text-fg-muted">
                    {feature.blurb}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <figure className="m-0 rounded-[var(--radius-3xl)] border border-hairline bg-merged p-8">
          <figcaption className="mb-8 flex items-baseline justify-between">
            <span className="text-step-1 font-semibold text-fg">
              Grow With Strike
            </span>
            <span className="font-mono text-step--2 uppercase tracking-[0.18em] text-accent">
              Live tracking
            </span>
          </figcaption>

          <div className="flex h-52 items-end gap-3">
            {progress.map((value, i) => (
              <div key={days[i]} className="flex flex-1 flex-col items-center gap-3">
                <span data-numeric className="text-step--2 text-fg-muted">
                  {value}%
                </span>
                <div
                  className="w-full rounded-[var(--radius-sm)]"
                  style={{
                    height: `${value}%`,
                    background:
                      i === progress.length - 1
                        ? "var(--accent)"
                        : "var(--surface-merged-strong)",
                  }}
                />
                <span className="text-step--2 text-fg-muted">{days[i]}</span>
              </div>
            ))}
          </div>
        </figure>
      </div>
    </Section>
  );
}
