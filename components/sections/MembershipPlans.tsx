"use client";

import { useState } from "react";
import clsx from "clsx";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { getContent } from "@/lib/content/getContent";
import type { Plan } from "@/content/types";

const { membership } = getContent();

const inr = new Intl.NumberFormat("en-IN");

function PlanCard({ plan }: { plan: Plan }) {
  const defaultIndex = Math.max(
    plan.durations.findIndex((d) => d.popular),
    0
  );
  const [index, setIndex] = useState(defaultIndex);
  const duration = plan.durations[index];

  return (
    <article
      className={clsx(
        "relative flex flex-col rounded-[var(--radius-3xl)] border p-8",
        plan.bestValue
          ? "border-[var(--accent-hairline)] bg-surface-raised"
          : "border-hairline bg-merged"
      )}
      style={plan.bestValue ? { boxShadow: "var(--glow-accent)" } : undefined}
    >
      {plan.bestValue ? (
        <span className="absolute -top-3 right-8 rounded-[var(--radius-pill)] bg-accent px-3 py-1 font-mono text-step--2 uppercase tracking-[0.16em] text-surface-base">
          Best Value
        </span>
      ) : null}

      <p className="m-0 font-mono text-step--2 uppercase tracking-[0.2em] text-fg-muted">
        {plan.kicker}
      </p>
      <h3 className="mt-3 mb-0 font-display text-step-3 text-fg">{plan.name}</h3>
      <p className="mt-3 mb-0 text-step--1 text-fg-muted">{plan.description}</p>

      <div className="mt-7">
        <p className="m-0 mb-2.5 font-mono text-step--2 uppercase tracking-[0.2em] text-fg-muted">
          Select duration
        </p>
        <div
          role="group"
          className="inline-flex rounded-[var(--radius-pill)] border border-hairline p-1"
        >
          {plan.durations.map((option, i) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={clsx(
                "rounded-[var(--radius-pill)] px-4 py-2 text-step--2 transition-colors duration-[var(--dur-fast)]",
                i === index
                  ? "bg-fg text-surface-base"
                  : "text-fg-muted hover:text-fg"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <span data-numeric className="font-display text-step-4 text-fg">
          ₹{inr.format(duration.price)}
        </span>
        <span
          data-numeric
          className="pb-2 text-step--1 text-fg-muted line-through"
        >
          ₹{inr.format(duration.strikePrice)}
        </span>
        <span
          data-numeric
          className="mb-2 rounded-[var(--radius-sm)] bg-accent-soft px-2 py-1 font-mono text-step--2 text-accent"
        >
          {duration.discount}% OFF
        </span>
      </div>
      <p className="mt-1.5 mb-0 text-step--2 text-fg-muted">
        {duration.label} · one-time · no renewals
      </p>

      <ul className="my-8 flex list-none flex-col gap-3 p-0">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-step--1 text-fg-tertiary"
          >
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      <ButtonLink
        href={`/membership/${plan.id}`}
        variant={plan.bestValue ? "primary" : "ghost"}
        className="mt-auto w-full"
      >
        {plan.cta}
      </ButtonLink>
    </article>
  );
}

export function MembershipPlans() {
  return (
    <Section id="membership">
      <SectionHeader
        eyebrow={membership.kicker}
        title={membership.title}
        accent={membership.titleAccent}
        blurb={membership.blurb}
      />
      <div className="mt-14 grid items-start gap-6 lg:grid-cols-2">
        {membership.plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="mt-8 text-center text-step--2 text-fg-muted">
        {membership.note}
      </p>
    </Section>
  );
}
