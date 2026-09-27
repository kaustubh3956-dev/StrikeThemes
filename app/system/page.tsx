import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design system · Strike",
  description: "Token reference extracted from strikes.in.",
};

const surfaces = [
  ["--surface-base", "Page base"],
  ["--surface-sunken", "Sunken / hero"],
  ["--surface", "Surface"],
  ["--surface-raised", "Raised card"],
  ["--surface-merged", "Merged fill"],
  ["--surface-merged-strong", "Merged strong"],
];

const accents = [
  ["--accent", "Accent"],
  ["--accent-bright", "Accent bright"],
  ["--accent-warm", "Warm"],
  ["--accent-gold", "Gold"],
  ["--accent-blue", "Blue"],
  ["--accent-electric", "Electric"],
  ["--success", "Success"],
  ["--warning", "Warning"],
  ["--danger", "Danger"],
];

const foregrounds = [
  ["--fg", "Primary"],
  ["--fg-secondary", "Secondary"],
  ["--fg-tertiary", "Tertiary"],
  ["--fg-muted", "Muted"],
];

const radii = [
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  "--radius-2xl",
  "--radius-3xl",
];

const steps = [
  ["--step-7", "Display"],
  ["--step-6", "Hero"],
  ["--step-5", "H1"],
  ["--step-4", "H2"],
  ["--step-3", "H3"],
  ["--step-2", "H4"],
  ["--step-1", "Lead"],
  ["--step-0", "Body"],
  ["--step--1", "Small"],
  ["--step--2", "Micro"],
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="hairline-t py-[var(--section-y-tight)]">
      <h2 className="mb-8 font-mono text-step--2 uppercase tracking-[0.22em] text-fg-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <figure className="m-0">
      <div
        className="h-20 w-full rounded-[var(--radius-lg)] border border-hairline-strong"
        style={{ background: `var(${token})` }}
      />
      <figcaption className="mt-2 text-step--2 text-fg-muted">
        <span className="block text-fg-tertiary">{label}</span>
        <code className="font-mono">{token}</code>
      </figcaption>
    </figure>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="grain min-h-dvh bg-surface-base">
      <div className="shell py-[var(--section-y)]">
        <header className="mb-4">
          <p className="font-mono text-step--2 uppercase tracking-[0.22em] text-accent">
            Token reference
          </p>
          <h1 className="mt-4 font-display text-step-5 text-fg">Design system</h1>
          <p className="mt-4 max-w-[var(--measure)] text-fg-muted">
            Every value below is read live from the token layer. Apply a theme and this
            page reflects it — the fastest way to verify a theme&apos;s overrides are complete.
          </p>
        </header>

        <Block title="Surfaces">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {surfaces.map(([token, label]) => (
              <Swatch key={token} token={token} label={label} />
            ))}
          </div>
        </Block>

        <Block title="Accents">
          <div className="grid grid-cols-3 gap-5 md:grid-cols-5 lg:grid-cols-9">
            {accents.map(([token, label]) => (
              <Swatch key={token} token={token} label={label} />
            ))}
          </div>
        </Block>

        <Block title="Foreground">
          <div className="flex flex-col gap-3">
            {foregrounds.map(([token, label]) => (
              <p key={token} className="m-0 text-step-1" style={{ color: `var(${token})` }}>
                {label} — Take control of your future.{" "}
                <code className="font-mono text-step--2 opacity-60">{token}</code>
              </p>
            ))}
          </div>
        </Block>

        <Block title="Type scale">
          <div className="flex flex-col gap-4">
            {steps.map(([token, label]) => (
              <div key={token} className="flex items-baseline gap-6">
                <code className="w-28 shrink-0 font-mono text-step--2 text-fg-muted">
                  {token}
                </code>
                <span
                  className="truncate font-display text-fg"
                  style={{ fontSize: `var(${token})` }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Radius">
          <div className="grid grid-cols-3 gap-5 md:grid-cols-6">
            {radii.map((token) => (
              <figure key={token} className="m-0">
                <div
                  className="h-20 w-full border border-hairline-strong bg-surface-raised"
                  style={{ borderRadius: `var(${token})` }}
                />
                <figcaption className="mt-2 font-mono text-step--2 text-fg-muted">
                  {token}
                </figcaption>
              </figure>
            ))}
          </div>
        </Block>

        <Block title="Elevation & numerals">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[var(--radius-2xl)] bg-surface-raised p-6 shadow-[var(--glow-accent)]">
              <p className="m-0 font-mono text-step--2 uppercase tracking-[0.18em] text-accent">
                Glow accent
              </p>
              <p className="mt-3 mb-0 text-fg-muted">Derived from --accent via oklch().</p>
            </div>
            <div className="rounded-[var(--radius-2xl)] border border-hairline bg-merged p-6">
              <p className="m-0 font-mono text-step--2 uppercase tracking-[0.18em] text-fg-muted">
                Tabular numerals
              </p>
              <p data-numeric className="mt-3 mb-0 font-display text-step-3 text-fg">
                ₹14,374
              </p>
            </div>
            <div className="rounded-[var(--radius-2xl)] border border-hairline bg-merged p-6">
              <p className="m-0 font-mono text-step--2 uppercase tracking-[0.18em] text-fg-muted">
                Mono
              </p>
              <p className="mt-3 mb-0 font-mono text-step-0 text-accent-electric">
                strike.js — READY
              </p>
            </div>
          </div>
        </Block>
      </div>
    </main>
  );
}
