import { ThemeMode } from '../types';

interface TopBarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNewRun: () => void;
}

const NAV_ITEMS = [
  { label: 'Scenarios', href: '#scenarios' },
  { label: 'Runs', href: '#runs' },
  { label: 'Compare', href: '#compare' },
  { label: 'About', href: '#about' },
];

export function TopBar({ theme, onToggleTheme, onNewRun }: TopBarProps): JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--line)/0.7)] bg-[rgb(var(--surface)/0.86)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          className="text-base font-semibold tracking-tight text-[rgb(var(--text-strong))] transition-colors duration-200 ease-out hover:text-[rgb(var(--accent))]"
          href="#top"
        >
          CodexLab
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              className="text-sm font-medium tracking-[0.01em] text-[rgb(var(--text-muted))] transition-colors duration-200 ease-out hover:text-[rgb(var(--text-strong))] focus-ring"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle light and dark theme"
            aria-pressed={theme === 'dark'}
            className="button-quiet"
            onClick={onToggleTheme}
            type="button"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button className="button-primary" onClick={onNewRun} type="button">
            New Run
          </button>
        </div>
      </div>
    </header>
  );
}
