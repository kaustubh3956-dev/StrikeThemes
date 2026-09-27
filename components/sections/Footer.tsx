import Link from "next/link";
import { getContent } from "@/lib/content/getContent";

const { brand, footer } = getContent();

export function Footer() {
  return (
    <footer
      data-section="footer"
      className="hairline-t mt-auto"
      style={{ paddingBlock: "var(--section-y-tight)" }}
    >
      <div className="shell grid gap-12 lg:grid-cols-[1.6fr_2fr]">
        <div>
          <p className="m-0 font-display text-step-2 tracking-[0.14em] text-fg">
            {brand}
          </p>
          <p className="mt-4 mb-0 max-w-[46ch] text-step--1 text-fg-muted">
            {footer.blurb}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="m-0 mb-4 font-mono text-step--2 uppercase tracking-[0.2em] text-fg-muted">
                {column.title}
              </h3>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-step--1 text-fg-tertiary transition-colors duration-[var(--dur-fast)] hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="shell mt-12">
        <p className="hairline-t m-0 pt-6 text-step--2 text-fg-muted">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
