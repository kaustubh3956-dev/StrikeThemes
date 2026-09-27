import { Marquee } from "@/components/ui/Marquee";
import { SectionHeader } from "@/components/ui/Section";
import { getContent } from "@/lib/content/getContent";
import type { Testimonial } from "@/content/types";

const { testimonials } = getContent();

const half = Math.ceil(testimonials.items.length / 2);
const rowOne = testimonials.items.slice(0, half);
const rowTwo = testimonials.items.slice(half);

function Card({ item }: { item: Testimonial }) {
  return (
    <figure className="mx-3 flex w-[min(80vw,26rem)] shrink-0 flex-col gap-4 rounded-[var(--radius-2xl)] border border-hairline bg-merged p-7">
      <blockquote className="m-0 text-step--1 text-fg-tertiary">
        “{item.quote}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-full border border-hairline font-mono text-step--2 text-accent"
          style={{ background: "var(--accent-soft)" }}
        >
          {item.name.charAt(0)}
        </span>
        <span className="text-step--1 text-fg">{item.name}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      data-section="testimonials"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div className="shell">
        <SectionHeader
          title={testimonials.title}
          blurb={testimonials.blurb}
        />
      </div>

      <div className="mt-14 flex flex-col gap-5">
        <Marquee speed={62}>
          {rowOne.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </Marquee>
        <Marquee speed={68} reverse>
          {rowTwo.map((item) => (
            <Card key={item.name} item={item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
