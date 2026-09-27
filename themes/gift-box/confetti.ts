/** Confetti burst, generated once so the timeline can read stable targets by index. */
export interface Fleck {
  dx: number;
  dy: number;
  rotation: number;
  size: number;
  round: boolean;
  color: string;
}

const COLORS = [
  "var(--accent)",
  "var(--accent-bright)",
  "var(--accent-gold)",
  "var(--fg)",
  "var(--accent-electric)",
];

export function makeConfetti(count = 18): Fleck[] {
  return Array.from({ length: count }, (_, i) => {
    // A tall, narrow fan: the burst has to carry all the way up to the offer.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.15;
    const distance = 300 + Math.random() * 380;

    return {
      dx: Math.cos(angle) * distance * 0.85,
      dy: Math.sin(angle) * distance,
      rotation: (Math.random() - 0.5) * 720,
      size: 5 + Math.random() * 6,
      round: i % 3 === 0,
      color: COLORS[i % COLORS.length],
    };
  });
}
