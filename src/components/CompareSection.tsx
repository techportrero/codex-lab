import { useMemo, useRef } from 'react';
import { buildLineDiff } from '../lib/diff';
import { formatDateTime } from '../lib/format';
import { Run } from '../types';

interface CompareSectionProps {
  runs: Run[];
  leftRunId: string | null;
  rightRunId: string | null;
  onLeftChange: (runId: string) => void;
  onRightChange: (runId: string) => void;
}

function classNames(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function CompareSection({
  runs,
  leftRunId,
  rightRunId,
  onLeftChange,
  onRightChange,
}: CompareSectionProps): JSX.Element {
  const leftRun = runs.find((run) => run.id === leftRunId) ?? null;
  const rightRun = runs.find((run) => run.id === rightRunId) ?? null;

  const diff = useMemo(() => {
    if (!leftRun || !rightRun) {
      return null;
    }
    return buildLineDiff(leftRun.outputText, rightRun.outputText);
  }, [leftRun, rightRun]);

  const leftScrollRef = useRef<HTMLDivElement | null>(null);
  const rightScrollRef = useRef<HTMLDivElement | null>(null);
  const syncRef = useRef(false);

  function syncScroll(source: 'left' | 'right'): void {
    if (syncRef.current) {
      return;
    }

    const sourceElement = source === 'left' ? leftScrollRef.current : rightScrollRef.current;
    const targetElement = source === 'left' ? rightScrollRef.current : leftScrollRef.current;

    if (!sourceElement || !targetElement) {
      return;
    }

    syncRef.current = true;
    targetElement.scrollTop = sourceElement.scrollTop;
    targetElement.scrollLeft = sourceElement.scrollLeft;
    window.requestAnimationFrame(() => {
      syncRef.current = false;
    });
  }

  return (
    <section className="space-y-4" id="compare">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">Compare</h2>
        {diff ? <p className="text-sm text-[rgb(var(--text-muted))]">{diff.changedCount} changed lines</p> : null}
      </div>

      <div className="panel space-y-4">
        {runs.length < 2 ? (
          <div className="empty-state">
            <p className="text-sm text-[rgb(var(--text-muted))]">At least two completed runs are needed for side-by-side compare.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="compare-left">
                  Left Run
                </label>
                <select
                  className="input"
                  id="compare-left"
                  onChange={(event) => onLeftChange(event.target.value)}
                  value={leftRunId ?? ''}
                >
                  <option value="" disabled>
                    Select a run
                  </option>
                  {runs.map((run) => (
                    <option key={run.id} value={run.id}>
                      {run.scenarioSnapshot.name} • {formatDateTime(run.createdAt)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="compare-right">
                  Right Run
                </label>
                <select
                  className="input"
                  id="compare-right"
                  onChange={(event) => onRightChange(event.target.value)}
                  value={rightRunId ?? ''}
                >
                  <option value="" disabled>
                    Select a run
                  </option>
                  {runs.map((run) => (
                    <option key={run.id} value={run.id}>
                      {run.scenarioSnapshot.name} • {formatDateTime(run.createdAt)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!leftRun || !rightRun || !diff ? (
              <div className="empty-state">
                <p className="text-sm text-[rgb(var(--text-muted))]">
                  Choose two runs to compare outputs. Scrolling is synchronized automatically.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.5)]">
                  <div className="border-b border-[rgb(var(--line))] px-4 py-3">
                    <p className="text-sm font-medium text-[rgb(var(--text-strong))]">{leftRun.scenarioSnapshot.name}</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">{formatDateTime(leftRun.createdAt)}</p>
                  </div>
                  <div
                    className="h-[24rem] overflow-auto"
                    onScroll={() => syncScroll('left')}
                    ref={leftScrollRef}
                  >
                    <pre className="font-mono text-xs leading-6 text-[rgb(var(--text-strong))]">
                      {diff.leftLines.map((line, index) => (
                        <div
                          className={classNames(
                            'grid grid-cols-[3rem_1fr] gap-3 px-4',
                            diff.leftChanged.has(index) && 'bg-[rgb(var(--warn-soft))]',
                          )}
                          key={`left-${index}-${line}`}
                        >
                          <span className="select-none text-[rgb(var(--text-subtle))]">{index + 1}</span>
                          <span>{line || ' '}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>

                <div className="rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.5)]">
                  <div className="border-b border-[rgb(var(--line))] px-4 py-3">
                    <p className="text-sm font-medium text-[rgb(var(--text-strong))]">{rightRun.scenarioSnapshot.name}</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">{formatDateTime(rightRun.createdAt)}</p>
                  </div>
                  <div
                    className="h-[24rem] overflow-auto"
                    onScroll={() => syncScroll('right')}
                    ref={rightScrollRef}
                  >
                    <pre className="font-mono text-xs leading-6 text-[rgb(var(--text-strong))]">
                      {diff.rightLines.map((line, index) => (
                        <div
                          className={classNames(
                            'grid grid-cols-[3rem_1fr] gap-3 px-4',
                            diff.rightChanged.has(index) && 'bg-[rgb(var(--warn-soft))]',
                          )}
                          key={`right-${index}-${line}`}
                        >
                          <span className="select-none text-[rgb(var(--text-subtle))]">{index + 1}</span>
                          <span>{line || ' '}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
