"use client";

import { useEffect, useState } from "react";

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function split(ms: number): Remaining {
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    isExpired: false,
  };
}

/**
 * Headless countdown. Recomputes from Date.now() every tick rather than
 * decrementing, so throttled background tabs cannot accumulate drift.
 */
export function useCountdown(endsAt: string): Remaining {
  const target = Date.parse(endsAt);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
    };

    const run = () => {
      stop();
      id = setInterval(() => setNow(Date.now()), 1000);
    };

    // No point ticking a timer nobody can see; resync on return instead.
    const onVisibility = () => {
      if (document.hidden) {
        stop();
        return;
      }
      setNow(Date.now());
      run();
    };

    run();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return split(target - now);
}
