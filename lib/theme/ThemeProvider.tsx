"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_ID,
  getThemeMeta,
  themeLoaders,
  themeMetas,
} from "./registry";
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

const STORAGE_KEY = "strike-theme";

function applyTokens(tokens: Record<string, string>, previous: string[]) {
  const root = document.documentElement;
  previous.forEach((key) => root.style.removeProperty(key));
  Object.entries(tokens).forEach(([key, value]) =>
    root.style.setProperty(key, value)
  );
  return Object.keys(tokens);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState(DEFAULT_THEME_ID);
  const [layers, setLayers] = useState<ThemeLayers>({});

  const activeMeta = useMemo(() => getThemeMeta(activeId), [activeId]);

  // URL wins over storage so a shared ?theme= link always renders as sent.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("theme");
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const candidate = fromUrl ?? stored;
    if (candidate && themeLoaders[candidate]) setActiveId(candidate);
  }, []);

  useEffect(() => {
    let appliedKeys: string[] = [];
    appliedKeys = applyTokens(activeMeta.tokens, []);

    const { bodyClass } = activeMeta;
    if (bodyClass) document.body.classList.add(bodyClass);

    return () => {
      applyTokens({}, appliedKeys);
      if (bodyClass) document.body.classList.remove(bodyClass);
    };
  }, [activeMeta]);

  useEffect(() => {
    let cancelled = false;
    const loader = themeLoaders[activeId];
    if (!loader) return;

    setLayers({});
    loader().then((mod) => {
      if (!cancelled) setLayers(mod.layers);
    });

    return () => {
      cancelled = true;
    };
  }, [activeId]);

  const setTheme = useCallback((id: string) => {
    if (!themeLoaders[id]) return;
    setActiveId(id);
    window.localStorage.setItem(STORAGE_KEY, id);

    const url = new URL(window.location.href);
    if (id === DEFAULT_THEME_ID) url.searchParams.delete("theme");
    else url.searchParams.set("theme", id);
    window.history.replaceState({}, "", url);
  }, []);

  const value = useMemo(
    () => ({ activeId, activeMeta, metas: themeMetas, setTheme }),
    [activeId, activeMeta, setTheme]
  );

  const { Background, Overlay } = layers;

  return (
    <ThemeContext.Provider value={value}>
      {Background ? (
        <div
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: "var(--z-theme-bg)" }}
        >
          <Background previewMode={false} />
        </div>
      ) : null}

      <div
        className="relative flex min-h-full flex-1 flex-col"
        style={{ zIndex: "var(--z-content)" }}
      >
        {children}
      </div>

      {Overlay ? (
        <div
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: "var(--z-theme-overlay)" }}
        >
          <Overlay previewMode={false} />
        </div>
      ) : null}
    </ThemeContext.Provider>
  );
}
