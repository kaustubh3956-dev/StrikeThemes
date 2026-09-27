const EVENT = "strike-theme:reveal-offer";

/**
 * Called by a theme at the moment its animation should hand over to the offer.
 * Themes never mount or position the offer themselves.
 */
export function revealOffer() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onRevealOffer(listener: () => void) {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
