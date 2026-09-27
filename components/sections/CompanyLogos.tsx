import { Marquee } from "@/components/ui/Marquee";
import { getContent } from "@/lib/content/getContent";

const { companies } = getContent();

export function CompanyLogos() {
  return (
    <section
      id="companies"
      data-section="companies"
      className="hairline-t hairline-b"
      style={{ paddingBlock: "var(--section-y-tight)" }}
    >
      <div className="shell">
        <h2 className="m-0 mb-10 text-center font-display text-step-2 text-fg">
          {companies.title}
        </h2>
      </div>

      <Marquee speed={46}>
        {companies.names.map((name) => (
          <span
            key={name}
            className="px-10 font-display text-step-2 text-fg-muted opacity-60 transition-opacity duration-[var(--dur)] hover:opacity-100"
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
