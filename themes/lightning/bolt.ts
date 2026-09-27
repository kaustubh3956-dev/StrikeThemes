/**
 * Bolts are generated in a fixed 1200x700 space. The SVG uses
 * preserveAspectRatio="xMaxYMax slice", which pins (1200,700) to the container's
 * bottom-right corner, so a bolt aimed there lands on the corner at any size.
 */
export const BOLT_W = 1200;
export const BOLT_H = 700;

function jagged(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  segments: number,
  spread: number
) {
  const points: Array<[number, number]> = [[x0, y0]];

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const nx = x0 + (x1 - x0) * t;
    const ny = y0 + (y1 - y0) * t;
    // Taper the wobble toward the end so the strike point stays precise.
    const falloff = 1 - t * 0.85;
    points.push([
      nx + (Math.random() - 0.5) * spread * falloff,
      ny + (Math.random() - 0.5) * spread * 0.35 * falloff,
    ]);
  }

  points.push([x1, y1]);
  return points;
}

const toPath = (points: Array<[number, number]>) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

export interface BoltPaths {
  main: string;
  forks: string[];
}

/** Main channel plus a few forks that peel off and die out early. */
export function makeBolt(
  startX: number,
  targetX: number,
  targetY: number,
  spread = 190
): BoltPaths {
  const points = jagged(startX, -30, targetX, targetY, 16, spread);
  const forks: string[] = [];

  for (let i = 0; i < 3; i++) {
    const at = 3 + Math.floor(Math.random() * (points.length - 7));
    const [fx, fy] = points[at];
    forks.push(
      toPath(
        jagged(
          fx,
          fy,
          fx + (Math.random() - 0.5) * 420,
          fy + 120 + Math.random() * 220,
          6,
          110
        )
      )
    );
  }

  return { main: toPath(points), forks };
}
