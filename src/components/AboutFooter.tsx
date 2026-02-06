export function AboutFooter(): JSX.Element {
  return (
    <footer className="pb-10 pt-2" id="about">
      <div className="panel">
        <h2 className="section-title">About</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[rgb(var(--text-muted))]">
          CodexLab is a local-first workspace for designing structured AI prompts, running repeatable tool scenarios,
          and presenting output comparisons as portfolio-grade artifacts.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a className="text-link" href="#" rel="noreferrer" target="_blank">
            GitHub
          </a>
          <a className="text-link" href="#" rel="noreferrer" target="_blank">
            LinkedIn
          </a>
          <a className="text-link" href="mailto:hello@example.com">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
