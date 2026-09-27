"use client";

import { useCountdown } from "./useCountdown";

const pad = (value: number) => String(value).padStart(2, "0");

/** Unstyled apart from theme tokens, so any theme can skin it. */
export function Countdown({
  endsAt,
  expiredLabel,
}: {
  endsAt: string;
  expiredLabel: string;
}) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(endsAt);

  if (isExpired) {
    return (
      <span className="font-mono text-step--2 uppercase tracking-[0.18em] text-fg-muted">
        {expiredLabel}
      </span>
    );
  }

  // Seconds are always shown, otherwise a distant deadline looks frozen.
  const units: Array<[string, number]> = days
    ? [
        ["days", days],
        ["hours", hours],
        ["mins", minutes],
        ["secs", seconds],
      ]
    : [
        ["hours", hours],
        ["mins", minutes],
        ["secs", seconds],
      ];

  // Spans throughout so the countdown can sit inside any inline context.
  return (
    <span className="inline-flex items-center gap-1">
      {units.map(([label, value], i) => (
        <span key={label} className="inline-flex items-center gap-1">
          {i > 0 ? (
            <span aria-hidden className="font-mono text-step--2 text-fg-muted">
              :
            </span>
          ) : null}
          <span
            data-numeric
            data-unit={label}
            title={label}
            className="font-mono text-step--1 leading-none text-fg"
          >
            {pad(value)}
          </span>
        </span>
      ))}
    </span>
  );
}
