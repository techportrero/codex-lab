import { createSeedData } from '../data/seed';
import { Run, Scenario, ThemeMode } from '../types';

const STORAGE_KEY = 'codexlab:store:v1';
const THEME_KEY = 'codexlab:theme';

interface StoredState {
  version: number;
  scenarios: Scenario[];
  runs: Run[];
}

function isStoredState(value: unknown): value is StoredState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.version === 'number' &&
    Array.isArray(record.scenarios) &&
    Array.isArray(record.runs)
  );
}

export function loadOrCreateStore(): { scenarios: Scenario[]; runs: Run[] } {
  if (typeof window === 'undefined') {
    return createSeedData();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = createSeedData();
    persistStore(seed.scenarios, seed.runs);
    return seed;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isStoredState(parsed)) {
      return {
        scenarios: parsed.scenarios,
        runs: parsed.runs,
      };
    }
  } catch {
    // Fall through to re-seed.
  }

  const seed = createSeedData();
  persistStore(seed.scenarios, seed.runs);
  return seed;
}

export function persistStore(scenarios: Scenario[], runs: Run[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: StoredState = {
    version: 1,
    scenarios,
    runs,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearStore(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function persistTheme(theme: ThemeMode): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_KEY, theme);
  }
}
