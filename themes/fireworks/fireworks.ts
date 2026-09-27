const COLORS = [
  "var(--accent)",
  "var(--accent-bright)",
  "var(--accent-gold)",
  "var(--accent-warm)",
  "var(--accent-electric)",
  "var(--fg)",
];

/** Fixed mortar positions along the foot of the stage, as percentages. */
export const TUBE_LANES = [7, 21, 35, 49, 63, 77, 91];

export type BurstKind = "ring" | "willow" | "crackle";

export interface Spark {
  dx: number;
  dy: number;
  size: number;
  /** Core sparks stay near the centre and burn white. */
  core: boolean;
}

export interface Launch {
  tube: number;
  /** Horizontal burst position, percent of stage width. */
  x: number;
  /** Burst height as a percentage from the top: smaller is higher. */
  apex: number;
  at: number;
  rise: number;
  kind: BurstKind;
  color: string;
  sparks: Spark[];
}

interface RoundSpec {
  count: number;
  start: number;
  gap: number;
  apex: [number, number];
}

/** Three waves, each denser and higher than the last. */
const ROUNDS: RoundSpec[] = [
  { count: 4, start: 0.35, gap: 0.34, apex: [34, 52] },
  { count: 6, start: 2.2, gap: 0.26, apex: [18, 40] },
  { count: 8, start: 4.4, gap: 0.19, apex: [8, 34] },
];

const KINDS: BurstKind[] = ["ring", "willow", "crackle"];

const SHAPE: Record<BurstKind, { count: number; reach: number; fall: number }> = {
  ring: { count: 20, reach: 104, fall: 26 },
  willow: { count: 16, reach: 72, fall: 96 },
  crackle: { count: 24, reach: 58, fall: 14 },
};

/**
 * Seeded so the display is identical on every run: a designed sequence rather
 * than noise, and pure enough to build during render.
 */
function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeFireworks(scale = 1): Launch[] {
  const random = rng(20260927);
  const launches: Launch[] = [];

  ROUNDS.forEach((round, r) => {
    const count = Math.max(2, Math.round(round.count * scale));

    for (let i = 0; i < count; i++) {
      const tube = Math.floor(random() * TUBE_LANES.length);
      const kind = KINDS[(r + i) % KINDS.length];
      const shape = SHAPE[kind];
      const sparkCount = Math.max(8, Math.round(shape.count * scale));
      const reach = shape.reach * (0.8 + random() * 0.45);

      launches.push({
        tube,
        x: TUBE_LANES[tube] + (random() - 0.5) * 6,
        apex: round.apex[0] + random() * (round.apex[1] - round.apex[0]),
        at: round.start + i * round.gap,
        rise: 0.8 + random() * 0.35,
        kind,
        color: COLORS[(r * 2 + i) % COLORS.length],
        sparks: Array.from({ length: sparkCount }, (_, j) => {
          // A third of each burst forms a tight white core inside the colour.
          const core = j % 3 === 0;
          const angle = (j / sparkCount) * Math.PI * 2 + random() * 0.35;
          const spread = reach * (core ? 0.3 + random() * 0.2 : 0.68 + random() * 0.5);
          return {
            dx: Math.cos(angle) * spread,
            dy: Math.sin(angle) * spread + shape.fall * (core ? 0.4 : 1),
            size: (core ? 1.6 : 2.2) + random() * 2.6,
            core,
          };
        }),
      });
    }
  });

  return launches;
}
