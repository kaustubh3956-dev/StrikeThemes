import clsx from "clsx";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "m-0 font-mono text-step--2 uppercase tracking-[0.24em] text-accent",
        className
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeader({
  title,
  accent,
  blurb,
  eyebrow,
  align = "center",
}: {
  title: string;
  accent?: string;
  blurb?: string;
  eyebrow?: string;
  align?: "center" | "start";
}) {
  return (
    <header
      className={clsx(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start"
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="m-0 font-display text-step-4 text-fg">
        {title}
        {accent ? <span className="text-accent"> {accent}</span> : null}
      </h2>
      {blurb ? (
        <p className="m-0 max-w-[58ch] text-fg-muted">{blurb}</p>
      ) : null}
    </header>
  );
}

export function Section({
  id,
  children,
  className,
  tight,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      data-section={id}
      className={clsx("relative", className)}
      style={{
        paddingBlock: tight ? "var(--section-y-tight)" : "var(--section-y)",
      }}
    >
      <div className="shell">{children}</div>
    </section>
  );
}
