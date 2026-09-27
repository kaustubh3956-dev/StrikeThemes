import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-fg text-surface-base hover:bg-accent hover:text-surface-base border-transparent",
  ghost:
    "bg-merged text-fg border-hairline-strong hover:bg-merged-strong hover:border-[var(--accent-hairline)]",
  outline:
    "bg-transparent text-fg border-hairline-strong hover:border-[var(--accent-hairline)] hover:text-accent",
};

const shared =
  "inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-pill)] border px-7 py-3 text-step--1 font-medium leading-none transition-[background-color,border-color,color,transform] duration-[var(--dur)] ease-[var(--ease-out)] active:translate-y-px";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: { href: string; variant?: Variant; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href" | "children"
>) {
  return (
    <Link href={href} className={clsx(shared, styles[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: { variant?: Variant } & ComponentProps<"button">) {
  return (
    <button className={clsx(shared, styles[variant], className)} {...rest}>
      {children}
    </button>
  );
}
