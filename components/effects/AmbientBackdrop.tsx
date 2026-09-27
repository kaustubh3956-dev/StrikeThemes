/** Static grey-green patches so the page never reads as flat black. */
export function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 0,
        backgroundImage: [
          "radial-gradient(60rem 42rem at 18% 8%, var(--ambient-green), transparent 62%)",
          "radial-gradient(48rem 38rem at 88% 22%, var(--ambient-grey), transparent 60%)",
          "radial-gradient(54rem 40rem at 72% 68%, var(--ambient-green-soft), transparent 64%)",
          "radial-gradient(40rem 34rem at 8% 78%, var(--ambient-grey), transparent 62%)",
          "radial-gradient(46rem 36rem at 45% 42%, var(--ambient-green-soft), transparent 66%)",
        ].join(","),
      }}
    />
  );
}
