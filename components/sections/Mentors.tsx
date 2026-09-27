import { Section, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { getContent } from "@/lib/content/getContent";

const { mentors } = getContent();

export function Mentors() {
  return (
    <Section id="mentors">
      <SectionHeader title={mentors.title} />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {mentors.people.map((mentor) => (
          <article
            key={mentor.name}
            className="flex flex-col gap-6 rounded-[var(--radius-3xl)] border border-hairline bg-merged p-8 sm:flex-row"
          >
            <div
              aria-hidden
              className="grid size-24 shrink-0 place-items-center rounded-[var(--radius-2xl)] border border-[var(--accent-hairline)] font-display text-step-3 text-accent"
              style={{ background: "var(--accent-soft)" }}
            >
              {mentor.initials}
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="m-0 text-step-1 font-semibold text-fg">
                {mentor.name}
              </h3>
              <p className="m-0 font-mono text-step--2 uppercase tracking-[0.18em] text-accent">
                {mentor.role}
              </p>
              <p className="m-0 text-step--1 text-fg-muted">{mentor.bio}</p>

              <ul className="m-0 mt-1 flex list-none flex-wrap gap-2 p-0">
                {mentor.badges.map((badge) => (
                  <li
                    key={badge}
                    className="rounded-[var(--radius-pill)] border border-hairline px-3 py-1 text-step--2 text-fg-tertiary"
                  >
                    {badge}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href={mentor.href}
                variant="outline"
                className="mt-4 self-start"
              >
                Know more
              </ButtonLink>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
