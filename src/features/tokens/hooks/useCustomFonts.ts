import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'design-tokens:custom-fonts';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
  } catch {
    return [];
  }
}

function writeStorage(values: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // Ignora falha de storage (modo privado, cota etc.)
  }
}

export function useCustomFonts() {
  const [fonts, setFonts] = useState<string[]>(() => readStorage());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFonts(readStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addFont = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setFonts((prev) => {
      if (prev.includes(trimmed)) return prev;
      const next = [...prev, trimmed].sort((a, b) => a.localeCompare(b));
      writeStorage(next);
      return next;
    });
  }, []);

  const removeFont = useCallback((name: string) => {
    setFonts((prev) => {
      const next = prev.filter((f) => f !== name);
      writeStorage(next);
      return next;
    });
  }, []);

  return { fonts, addFont, removeFont };
}
