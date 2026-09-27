import { TUBE_LANES } from "./fireworks";

const tube = "color-mix(in oklab, var(--accent) 24%, #06121a)";
const tubeLip = "color-mix(in oklab, var(--accent) 60%, #06121a)";
const crate = "color-mix(in oklab, var(--accent-gold) 16%, #0a0f14)";

/** The launch rig along the foot of the stage: mortars, crates and ground haze. */
export function GroundRig() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28">
      <div
        className="absolute inset-x-0 bottom-0 h-full"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--surface-base) 94%, transparent) 12%, transparent 100%)",
        }}
      />

      {TUBE_LANES.map((x, i) => (
        <div
          key={i}
          className="absolute bottom-4"
          style={{ left: `${x}%`, transform: "translateX(-50%)" }}
        >
          <div
            className={`fw-flash fw-flash-${i} absolute -top-3 left-1/2 size-12 -translate-x-1/2 rounded-full opacity-0`}
            style={{
              background:
                "radial-gradient(circle, var(--accent-bright) 0%, transparent 70%)",
            }}
          />

          <div
            className={`fw-smoke fw-smoke-${i} absolute -top-2 left-1/2 size-8 -translate-x-1/2 rounded-full opacity-0`}
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--fg) 22%, transparent) 0%, transparent 72%)",
              filter: "blur(3px)",
            }}
          />

          {/* Alternating heights so the rig reads as equipment, not a fence. */}
          <div
            className="rounded-t-[3px]"
            style={{
              width: i % 3 === 0 ? 16 : 13,
              height: i % 2 === 0 ? 30 : 23,
              background: tube,
              borderTop: `2px solid ${tubeLip}`,
            }}
          />

          {i % 2 === 0 ? (
            <div
              className="absolute -bottom-1 left-1/2 h-4 w-9 -translate-x-1/2 rounded-[2px]"
              style={{ background: crate }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
