"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { getContent } from "@/lib/content/getContent";

const { brand, nav, navCta } = getContent();

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      aria-hidden
    >
      <path d={open ? "M6.5 6.5 17.5 17.5" : "M4 8h16"} />
      <path d={open ? "M17.5 6.5 6.5 17.5" : "M4 16h16"} />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30 pt-5">
      <div className="shell">
        <nav
          className={clsx(
            "rounded-[var(--radius-3xl)] border px-5 py-3 backdrop-blur-xl transition-[background-color,border-color] duration-[var(--dur)] ease-[var(--ease-out)]",
            scrolled || open
              ? "border-hairline-strong bg-[color-mix(in_oklab,var(--surface-base)_82%,transparent)]"
              : "border-hairline bg-[color-mix(in_oklab,var(--surface-base)_46%,transparent)]"
          )}
        >
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-display text-step-1 tracking-[0.14em] text-fg"
            >
              {brand}
            </Link>

            <ul className="m-0 hidden list-none items-center gap-1 p-0 lg:flex">
              {nav.map((item, index) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={index === 0 ? "page" : undefined}
                    className={clsx(
                      "block rounded-[var(--radius-pill)] px-4 py-2 text-step--1 transition-colors duration-[var(--dur-fast)]",
                      index === 0
                        ? "bg-merged-strong text-fg"
                        : "text-fg-muted hover:text-fg"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={navCta.href}
              className="ml-auto text-step--1 font-medium text-fg transition-colors duration-[var(--dur-fast)] hover:text-accent"
            >
              {navCta.label}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="primary-menu"
              aria-label="Toggle navigation"
              className="-mr-1 text-fg lg:hidden"
            >
              <MenuIcon open={open} />
            </button>
          </div>

          <ul
            id="primary-menu"
            hidden={!open}
            className="m-0 mt-4 grid list-none grid-cols-2 gap-1 border-t border-hairline p-0 pt-4 sm:grid-cols-3 lg:hidden"
          >
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[var(--radius-lg)] px-3 py-2.5 text-step--1 text-fg-muted transition-colors duration-[var(--dur-fast)] hover:bg-merged hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
