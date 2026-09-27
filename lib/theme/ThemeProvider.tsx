"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  DEFAULT_THEME_ID,
  getThemeMeta,
  themeLoaders,
  themeMetas,
} from "./registry";
import { getServerStage, getStage, subscribeStage } from "./ThemeStage";
import { ThemeEffectLayer } from "./ThemeEffectLayer";
import { OfferSlot } from "@/components/sale/OfferSlot";
import type { ThemeLayers, ThemeMeta } from "./types";

interface ThemeContextValue {
  activeId: string;
  activeMeta: ThemeMeta;
  metas: ThemeMeta[];
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

function applyTokens(
  target: HTMLElement,
  tokens: Record<string, string>,
  previous: string[]
) {
  previous.forEach((key) => target.style.removeProperty(key));
  Object.entries(tokens).forEach(([key, value]) =>
    target.style.setProperty(key, value)
  );
  return Object.keys(tokens);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState(DEFAULT_THEME_ID);
  // Bumped on every pick so re-selecting the active theme replays it.
  const [runId, setRunId] = useState(0);
  const [layers, setLayers] = useState<ThemeLayers>({});
  const stage = useSyncExternalStore(subscribeStage, getStage, getServerStage);

  const activeMeta = useMemo(() => getThemeMeta(activeId), [activeId]);
  const offer = activeMeta.offer;

  // Themes are additive only: tokens paint, they never move base layout.
  useEffect(() => {
    const target = stage ?? document.documentElement;
    const appliedKeys = applyTokens(target, activeMeta.tokens, []);

    return () => {
      applyTokens(target, {}, appliedKeys);
    };
  }, [activeMeta, stage]);

  useEffect(() => {
    let cancelled = false;
    const loader = themeLoaders[activeId];
    if (!loader) return;

    loader().then((mod) => {
      if (!cancelled) setLayers(mod.layers);
    });

    // Clearing on teardown stops the outgoing theme painting over the incoming one.
    return () => {
      cancelled = true;
      setLayers({});
    };
  }, [activeId]);

  // Deliberately not persisted: every visit starts on the base site until a theme is picked.
  const setTheme = useCallback((id: string) => {
    if (!themeLoaders[id]) return;
    setActiveId(id);
    setRunId((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ activeId, activeMeta, metas: themeMetas, setTheme }),
    [activeId, activeMeta, setTheme]
  );

  const { Background, Overlay } = layers;

  // Staged layers share the page's stacking context: background below the hero
  // content (z-10), overlay above it but still under the navbar (z-30).
  const renderLayer = (
    Layer: NonNullable<ThemeLayers["Background"]>,
    fullPageZ: string,
    stageZ: number
  ) => {
    const node = (
      <ThemeEffectLayer
        key={`${activeId}-${runId}`}
        Layer={Layer}
        holdMs={activeMeta.effectHoldMs}
        className={
          stage
            ? "pointer-events-none absolute inset-0"
            : "pointer-events-none fixed inset-0"
        }
        zIndex={stage ? stageZ : fullPageZ}
      />
    );
    return stage ? createPortal(node, stage) : node;
  };

  return (
    <ThemeContext.Provider value={value}>
      {Background ? renderLayer(Background, "var(--z-theme-bg)", 0) : null}

      <div
        className="relative flex min-h-full flex-1 flex-col"
        style={{ zIndex: "var(--z-content)" }}
      >
        {children}
      </div>

      {Overlay ? renderLayer(Overlay, "var(--z-theme-overlay)", 20) : null}

      {offer ? <OfferSlot key={`${activeId}-${runId}`} offer={offer} /> : null}
    </ThemeContext.Provider>
  );
}
