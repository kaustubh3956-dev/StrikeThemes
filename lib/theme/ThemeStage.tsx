"use client";

import { useEffect, useRef } from "react";

let current: HTMLElement | null = null;
const listeners = new Set<() => void>();

function publish(element: HTMLElement | null) {
  current = element;
  listeners.forEach((listener) => listener());
}

export function subscribeStage(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getStage = () => current;
export const getServerStage = () => null;

/**
 * Marks the region a theme is allowed to paint. Registers itself with the
 * provider rather than being discovered by query, so mount and unmount are exact.
 */
export function ThemeStage({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    publish(ref.current);
    return () => publish(null);
  }, []);

  return <div ref={ref} data-theme-stage className={className} />;
}
