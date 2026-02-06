interface HeroProps {
  onCreateRun: () => void;
  onViewHistory: () => void;
}

export function Hero({ onCreateRun, onViewHistory }: HeroProps): JSX.Element {
  return (
    <section className="pt-14 sm:pt-20">
      <div className="panel relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgb(var(--accent)/0.16),_transparent_60%)]"
        />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--text-muted))]">Codex Tooling</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[rgb(var(--text-strong))] sm:text-5xl">
            Tool Test Bench
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[rgb(var(--text-muted))] sm:text-lg">
            Design prompts. Run scenarios. Compare outputs.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="button-primary" onClick={onCreateRun} type="button">
              Create Run
            </button>
            <button className="button-quiet" onClick={onViewHistory} type="button">
              View History
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
