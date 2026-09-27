"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/icons";
import { getContent } from "@/lib/content/getContent";
import type { Plan } from "@/content/types";

const { membership } = getContent();

const inr = new Intl.NumberFormat("en-IN");

const bannerSrc: Record<Plan["banner"], string> = {
  silver: "/plans/strike-plus.png",
  gold: "/plans/strike-ultra.png",
};

function PlanBanner({ plan }: { plan: Plan }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden">
      <Image
        src={bannerSrc[plan.banner]}
        alt={plan.name}
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover"
      />
      {/* Fades the artwork into the card so it does not read as a pasted-in image. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, var(--surface-base) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const defaultIndex = Math.max(
    plan.durations.findIndex((d) => d.popular),
    0
  );
  const [index, setIndex] = useState(defaultIndex);
  const duration = plan.durations[index];
  const gold = plan.banner === "gold";

  return (
    <article
      className={clsx(
        "flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border",
        gold ? "border-[color-mix(in_oklab,var(--accent-gold)_38%,transparent)]" : "border-hairline"
      )}
      style={
        gold
          ? {
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--accent-gold) 7%, transparent), transparent 42%)",
            }
          : undefined
      }
    >
      <PlanBanner plan={plan} />

      <div className="flex flex-1 flex-col p-6">
        <p
          className={clsx(
            "m-0 font-mono text-[0.58rem] uppercase tracking-[0.2em]",
            gold ? "text-accent-gold" : "text-fg-muted"
          )}
        >
          {plan.kicker}
        </p>
        <h3 className="mt-2.5 mb-0 font-display text-step-2 text-fg">{plan.name}</h3>
        <p className="mt-2.5 mb-0 text-step--1 text-fg-muted">{plan.description}</p>

        <p className="mt-6 mb-2 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-fg-muted">
          Select duration
        </p>
        <div
          role="group"
          className="inline-flex self-start rounded-[var(--radius-lg)] border border-hairline p-1"
        >
          {plan.durations.map((option, i) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={clsx(
                "flex items-center gap-1.5 rounded-[var(--radius-md)] px-3.5 py-1.5 text-[0.72rem] transition-colors duration-[var(--dur-fast)]",
                i === index
                  ? gold
                    ? "bg-accent-gold text-surface-base"
                    : "bg-fg text-surface-base"
                  : "text-fg-muted hover:text-fg"
              )}
            >
              {option.label}
              {option.popular ? (
                <span
                  className={clsx(
                    "rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[0.55rem]",
                    i === index
                      ? "bg-[rgba(0,0,0,0.18)] text-surface-base"
                      : "bg-merged text-fg-muted"
                  )}
                >
                  Popular
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span
            className={clsx("text-step-0", gold ? "text-accent-gold" : "text-fg-muted")}
          >
            ₹
          </span>
          <span
            data-numeric
            className={clsx(
              "font-display text-step-4 leading-none",
              gold ? "text-accent-gold" : "text-fg"
            )}
          >
            {inr.format(duration.price)}
          </span>
          <span data-numeric className="text-step--1 text-fg-muted line-through">
            ₹{inr.format(duration.strikePrice)}
          </span>
          <span
            data-numeric
            className="rounded-[var(--radius-sm)] bg-merged-strong px-2 py-1 text-[0.62rem] font-semibold text-fg"
          >
            {duration.discount}% OFF
          </span>
        </div>
        <p className="mt-2 mb-0 text-[0.7rem] text-fg-muted">
          {duration.label} · one-time · no renewals
        </p>

        <ul className="my-7 flex list-none flex-col gap-3 border-t border-hairline p-0 pt-6">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-step--1 text-fg-tertiary"
            >
              <span
                className={clsx(
                  "grid size-[1.15rem] shrink-0 place-items-center rounded-full border",
                  gold
                    ? "border-[color-mix(in_oklab,var(--accent-gold)_45%,transparent)] text-accent-gold"
                    : "border-hairline-strong text-fg-muted"
                )}
              >
                <CheckIcon className="size-3" />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={`/membership/${plan.id}`}
          className={clsx(
            "mt-auto flex items-center justify-center gap-2 rounded-[var(--radius-lg)] px-5 py-3.5 text-step--1 font-medium transition-colors duration-[var(--dur)] ease-[var(--ease-out)]",
            gold
              ? "bg-accent-gold text-surface-base hover:bg-[color-mix(in_oklab,var(--accent-gold)_80%,#fff)]"
              : "border border-hairline-strong bg-merged text-fg hover:bg-merged-strong"
          )}
        >
          {plan.cta}
          <span aria-hidden>&rarr;</span>
        </a>
      </div>
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
