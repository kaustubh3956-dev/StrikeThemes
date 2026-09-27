const body = "color-mix(in oklab, var(--accent) 52%, #05131a)";
const bodyDark = "color-mix(in oklab, var(--accent) 34%, #05131a)";
const lid = "color-mix(in oklab, var(--accent) 74%, #04121a)";
const ribbon = "color-mix(in oklab, var(--accent-gold) 82%, var(--fg))";
const outline = "color-mix(in oklab, var(--surface-base) 72%, var(--accent))";

/** Drawn from tokens so the box recolours with the theme instead of shipping art. */
export function GiftBoxArt() {
  return (
    <svg viewBox="0 0 120 132" className="w-full overflow-visible" fill="none">
      <ellipse
        className="gift-shadow"
        cx="60"
        cy="124"
        rx="40"
        ry="6"
        fill="#000"
        opacity="0.45"
      />

      <g className="gift-body">
        <rect
          x="14"
          y="58"
          width="92"
          height="60"
          rx="11"
          fill={body}
          stroke={outline}
          strokeWidth="3"
        />
        <rect x="16" y="88" width="88" height="28" rx="9" fill={bodyDark} opacity="0.45" />
        <rect x="53" y="58" width="14" height="60" fill={ribbon} opacity="0.92" />

        <g className="gift-eye gift-eye-left">
          <ellipse cx="42" cy="82" rx="8.5" ry="9.5" fill="var(--fg)" />
          <circle className="gift-pupil" cx="42" cy="83" r="4.2" fill="#06121a" />
          <circle cx="44" cy="80" r="1.5" fill="var(--fg)" />
        </g>

        <g className="gift-eye gift-eye-right">
          <ellipse cx="80" cy="82" rx="8.5" ry="9.5" fill="var(--fg)" />
          <circle className="gift-pupil" cx="80" cy="83" r="4.2" fill="#06121a" />
          <circle cx="82" cy="80" r="1.5" fill="var(--fg)" />
        </g>

        <path
          d="M54 97c2.6 3 8.8 3 11.4 0"
          stroke="#06121a"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        <ellipse cx="27" cy="92" rx="5" ry="3" fill="var(--accent-warm)" opacity="0.35" />
        <ellipse cx="95" cy="92" rx="5" ry="3" fill="var(--accent-warm)" opacity="0.35" />
      </g>

      <g className="gift-lid">
        <path
          d="M60 40c-6-14-22-20-27-12-4 6 6 12 27 12Z"
          fill={ribbon}
          stroke={outline}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M60 40c6-14 22-20 27-12 4 6-6 12-27 12Z"
          fill={ribbon}
          stroke={outline}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect
          x="8"
          y="38"
          width="104"
          height="23"
          rx="8"
          fill={lid}
          stroke={outline}
          strokeWidth="3"
        />
        <rect x="53" y="38" width="14" height="23" fill={ribbon} opacity="0.92" />
        <circle cx="60" cy="40" r="5" fill={ribbon} stroke={outline} strokeWidth="2.5" />
      </g>
    </svg>
  );
}
