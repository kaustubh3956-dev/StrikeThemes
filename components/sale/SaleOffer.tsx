"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { getSale } from "@/lib/content/getContent";
import { Countdown } from "@/features/countdown/Countdown";
import { initGsap } from "@/lib/gsap/gsap.client";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";
import { ArrowIcon, CheckIcon, MinimiseIcon } from "@/components/ui/icons";

const sale = getSale();

const shell =
  "rounded-[var(--radius-2xl)] border border-hairline bg-[color-mix(in_oklab,var(--surface-raised)_72%,transparent)] backdrop-blur-xl transition-[border-color] duration-[var(--dur)]";

interface SaleOfferProps {
  expanded: boolean;
  variant?: "card" | "banner";
  onOpen: () => void;
  onCollapseSoon: () => void;
  onCollapseNow: () => void;
}

/**
 * Presentational only: OfferSlot owns when this is open and where it sits.
 * Every visual comes from tokens, so themes restyle it without forking it.
 */
export function SaleOffer({
  expanded,
  variant = "card",
  onOpen,
  onCollapseSoon,
  onCollapseNow,
}: SaleOfferProps) {
  const [copied, setCopied] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Skipped on mount so it does not fight the reveal animation in OfferSlot.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!body.current || prefersReducedMotion()) return;

    const gsap = initGsap();
    const tween = gsap.fromTo(
      body.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    return () => {
      tween.kill();
    };
  }, [expanded]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sale.coupon);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked by permissions; the code stays readable regardless.
    }
  };

  const coupon = (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy coupon ${sale.coupon}`}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-dashed border-hairline-strong px-3 py-2.5 font-mono text-[0.68rem] leading-none tracking-[0.1em] text-fg-muted transition-colors duration-[var(--dur)] hover:border-[var(--accent-hairline)] hover:text-fg"
    >
      {copied ? <CheckIcon className="size-3 text-accent" /> : null}
      {copied ? sale.labels.copied : sale.coupon}
    </button>
  );

  const claim = (
    <Link
      href={sale.cta.href}
      className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-fg px-4 py-2.5 text-[0.72rem] font-medium leading-none text-surface-base transition-colors duration-[var(--dur)] ease-[var(--ease-out)] hover:bg-accent"
    >
      {sale.cta.label}
      <ArrowIcon className="size-3.5" />
    </Link>
  );

  const handlers = {
    onPointerEnter: onOpen,
    onPointerLeave: onCollapseSoon,
    onFocusCapture: onOpen,
    onBlurCapture: onCollapseSoon,
  };

  if (expanded && variant === "banner") {
    const dot = (
      <span aria-hidden className="text-fg-muted opacity-35">
        /
      </span>
    );

    return (
      <div ref={body} {...handlers} className="pointer-events-auto">
        <aside
          aria-label={`${sale.kicker} offer`}
          className="backdrop-blur-md"
          style={{
            // A soft wash instead of a bar, so it sits on the page rather than over it.
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--surface-base) 82%, transparent) 0%, color-mix(in oklab, var(--surface-base) 40%, transparent) 100%)",
          }}
        >
          <div className="shell flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-accent">
              {sale.kicker}
            </span>
            {dot}
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-fg-muted">
              {sale.badge}
            </span>
            {dot}

            <span className="font-display text-step-1 leading-none text-fg">
              {sale.discountLabel}
            </span>
            <span className="text-[0.74rem] text-fg-muted">{sale.appliesTo}</span>

            <span className="flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-fg-muted lg:ml-auto">
              {sale.countdownLabel}
              <Countdown endsAt={sale.endsAt} expiredLabel={sale.labels.expired} />
            </span>
            {dot}
            {coupon}
            {claim}

            <button
              type="button"
              onClick={onCollapseNow}
              aria-label={sale.labels.minimise}
              className="shrink-0 text-fg-muted transition-colors duration-[var(--dur-fast)] hover:text-fg"
            >
              <MinimiseIcon className="size-4" />
            </button>
          </div>

          {/* Hairline that fades at both ends rather than cutting the page in half. */}
          <div
            aria-hidden
            className="h-px w-full"
            style={{
              background: "var(--hairline-strong)",
              maskImage:
                "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            }}
          />
        </aside>
      </div>
    );
  }

  return (
    <div ref={body} {...handlers} className="pointer-events-auto">
      {expanded ? (
        <aside
          aria-label={`${sale.kicker} offer`}
          className={clsx(shell, "w-[min(84vw,17rem)] p-4")}
        >
          <p className="m-0 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-accent">
            {sale.kicker}
            <span className="ml-auto shrink-0 rounded-[var(--radius-pill)] border border-hairline px-2 py-0.5 text-[0.5rem] tracking-[0.12em] text-fg-muted">
              {sale.badge}
            </span>
            <button
              type="button"
              onClick={onCollapseNow}
              aria-label={sale.labels.minimise}
              className="-mr-1 shrink-0 text-fg-muted transition-colors duration-[var(--dur-fast)] hover:text-fg"
            >
              <MinimiseIcon className="size-4" />
            </button>
          </p>

          <p className="m-0 mt-3 font-display text-step-2 leading-none text-fg">
            {sale.discountLabel}
          </p>
          <p className="m-0 mt-1.5 text-[0.74rem] text-fg-muted">
            {sale.appliesTo}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {claim}
            {coupon}
          </div>

          <p className="m-0 mt-4 flex items-center gap-2 border-t border-hairline pt-3 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-fg-muted">
            {sale.countdownLabel}
            <span className="ml-auto">
              <Countdown endsAt={sale.endsAt} expiredLabel={sale.labels.expired} />
            </span>
          </p>
        </aside>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          aria-expanded={false}
          aria-label={sale.labels.showDetails}
          className={clsx(
            shell,
            "flex items-center gap-2.5 px-4 py-2.5 hover:border-[var(--accent-hairline)]"
          )}
        >
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="font-display text-[0.9rem] leading-none text-fg">
            {sale.discountLabel}
          </span>
          <span aria-hidden className="text-fg-muted opacity-40">
            |
          </span>
          <Countdown endsAt={sale.endsAt} expiredLabel={sale.labels.expired} />
        </button>
      )}
    </div>
  );
}
