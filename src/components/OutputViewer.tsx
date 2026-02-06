import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-typescript';
// Prism is intentionally the only non-core UI dependency to keep code highlighting lightweight.
import { formatDateTime, formatDuration } from '../lib/format';
import { OutputFormat, Run } from '../types';

type OutputTab = 'output' | 'logs' | 'notes';

interface OutputViewerProps {
  run: Run | null;
  activeTab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  onCopy: () => void;
  onDownload: () => void;
  onToggleBest: () => void;
  onUpdateNotes: (notes: string) => void;
}

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function languageForFormat(format: OutputFormat): string {
  switch (format) {
    case 'Code':
      return 'typescript';
    case 'JSON':
      return 'json';
    case 'Markdown':
      return 'markdown';
    case 'Plain text':
      return 'text';
    default:
      return 'text';
  }
}

function HighlightedOutput({ text, format }: { text: string; format: OutputFormat }): JSX.Element {
  const language = languageForFormat(format);

  if (language === 'text') {
    return (
      <pre className="output-pre whitespace-pre-wrap text-[rgb(var(--text-strong))]" aria-label="Run output">
        {text}
      </pre>
    );
  }

  const grammar = Prism.languages[language] ?? Prism.languages.markup;
  const html = Prism.highlight(text, grammar, language);

  return (
    <pre className="output-pre" aria-label="Run output">
      <code dangerouslySetInnerHTML={{ __html: html }} className={`language-${language}`} />
    </pre>
  );
}

const TABS: Array<{ id: OutputTab; label: string }> = [
  { id: 'output', label: 'Output' },
  { id: 'logs', label: 'Logs' },
  { id: 'notes', label: 'Notes' },
];

export function OutputViewer({
  run,
  activeTab,
  onTabChange,
  onCopy,
  onDownload,
  onToggleBest,
  onUpdateNotes,
}: OutputViewerProps): JSX.Element {
  return (
    <section className="space-y-4" id="output">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">Output Viewer</h2>
        {run ? (
          <p className="text-sm text-[rgb(var(--text-muted))]">
            {run.scenarioSnapshot.name} • {formatDateTime(run.createdAt)}
          </p>
        ) : null}
      </div>

      <div className="panel">
        <div className="border-b border-[rgb(var(--line))] pb-3">
          <div aria-label="Output tabs" className="inline-flex rounded-xl bg-[rgb(var(--surface-muted))] p-1" role="tablist">
            {TABS.map((tab) => (
              <button
                aria-controls={`panel-${tab.id}`}
                aria-selected={activeTab === tab.id}
                className={classNames('tab-button', activeTab === tab.id && 'tab-button-active')}
                id={`tab-${tab.id}`}
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {!run ? (
          <div className="empty-state mt-5" id="panel-output" role="tabpanel">
            <p className="text-sm text-[rgb(var(--text-muted))]">No run selected yet. Start from Scenario Builder to see output.</p>
          </div>
        ) : (
          <>
            {activeTab === 'output' ? (
              <div className="mt-5 space-y-4" id="panel-output" role="tabpanel">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[rgb(var(--text-muted))]">
                    Format: <span className="font-medium text-[rgb(var(--text-strong))]">{run.scenarioSnapshot.outputFormat}</span>
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button className="button-quiet" onClick={onCopy} type="button">
                      Copy
                    </button>
                    <button className="button-quiet" onClick={onDownload} type="button">
                      Download
                    </button>
                    <button className="button-quiet" onClick={onToggleBest} type="button">
                      {run.isBest ? 'Best ✓' : 'Mark as Best'}
                    </button>
                  </div>
                </div>

                {run.status === 'running' ? (
                  <div className="empty-state">
                    <p className="text-sm text-[rgb(var(--text-muted))]">Running simulated tool call...</p>
                  </div>
                ) : (
                  <HighlightedOutput format={run.scenarioSnapshot.outputFormat} text={run.outputText} />
                )}
              </div>
            ) : null}

            {activeTab === 'logs' ? (
              <div className="mt-5" id="panel-logs" role="tabpanel">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.55)] p-3">
                    <dt className="text-[rgb(var(--text-muted))]">Timestamp</dt>
                    <dd className="mt-1 font-medium text-[rgb(var(--text-strong))]">{formatDateTime(run.createdAt)}</dd>
                  </div>
                  <div className="rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.55)] p-3">
                    <dt className="text-[rgb(var(--text-muted))]">Scenario ID</dt>
                    <dd className="mt-1 font-medium text-[rgb(var(--text-strong))]">{run.scenarioId}</dd>
                  </div>
                  <div className="rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.55)] p-3">
                    <dt className="text-[rgb(var(--text-muted))]">Settings</dt>
                    <dd className="mt-1 font-medium text-[rgb(var(--text-strong))]">
                      temp {run.settings.temperature.toFixed(2)} • max {run.settings.maxTokens}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.55)] p-3">
                    <dt className="text-[rgb(var(--text-muted))]">Duration</dt>
                    <dd className="mt-1 font-medium text-[rgb(var(--text-strong))]">
                      {run.status === 'running' ? 'Running...' : formatDuration(run.durationMs)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}

            {activeTab === 'notes' ? (
              <div className="mt-5" id="panel-notes" role="tabpanel">
                <label className="label" htmlFor="run-notes">
                  Reflections
                </label>
                <textarea
                  className="textarea min-h-48"
                  id="run-notes"
                  onChange={(event) => onUpdateNotes(event.target.value)}
                  placeholder="Capture what worked, what failed, and why. Notes are stored locally."
                  value={run.notes}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
