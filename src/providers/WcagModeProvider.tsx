/**
 * Global WCAG export mode. Persisted in localStorage so the user's choice
 * survives reloads. A single selector (rendered in the app header) edits this
 * value, and every downstream export surface (project card, token export tab)
 * reads from the same source of truth.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { WcagTarget } from '@/lib/contrast';

export type WcagMode = 'none' | WcagTarget;

interface WcagModeContextValue {
  mode: WcagMode;
  setMode: (mode: WcagMode) => void;
  fileSuffix: string;
}

const STORAGE_KEY = 'design-tokens:wcag-mode';
const VALID_MODES: WcagMode[] = ['none', 'AA', 'AAA'];

const WcagModeContext = createContext<WcagModeContextValue | null>(null);

function readInitialMode(): WcagMode {
  if (typeof window === 'undefined') return 'none';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return VALID_MODES.includes(stored as WcagMode) ? (stored as WcagMode) : 'none';
}

export function WcagModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<WcagMode>(readInitialMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable (private mode, quota); ignore — selection is
      // still kept in memory for the session.
    }
  }, [mode]);

  const setMode = useCallback((next: WcagMode) => {
    setModeState(VALID_MODES.includes(next) ? next : 'none');
  }, []);

  const value = useMemo<WcagModeContextValue>(
    () => ({
      mode,
      setMode,
      fileSuffix: mode === 'none' ? '' : `-wcag-${mode.toLowerCase()}`,
    }),
    [mode, setMode],
  );

  return <WcagModeContext.Provider value={value}>{children}</WcagModeContext.Provider>;
}

export function useWcagMode(): WcagModeContextValue {
  const ctx = useContext(WcagModeContext);
  if (!ctx) {
    throw new Error('useWcagMode must be used inside <WcagModeProvider>');
  }
  return ctx;
}
