import { formatDateTime } from '../lib/format';
import { OUTPUT_FORMATS, OutputFormat, Run } from '../types';

interface RunHistoryProps {
  runs: Run[];
  hasAnyRuns: boolean;
  searchValue: string;
  filterFormat: 'All' | OutputFormat;
  filterTag: string;
  tags: string[];
  onSearchChange: (value: string) => void;
  onFilterFormatChange: (value: 'All' | OutputFormat) => void;
  onFilterTagChange: (value: string) => void;
  onView: (runId: string) => void;
  onDuplicate: (runId: string) => void;
  onDelete: (runId: string) => void;
}

export function RunHistory({
  runs,
  hasAnyRuns,
  searchValue,
  filterFormat,
  filterTag,
  tags,
  onSearchChange,
  onFilterFormatChange,
  onFilterTagChange,
  onView,
  onDuplicate,
  onDelete,
}: RunHistoryProps): JSX.Element {
  return (
    <section className="space-y-4" id="runs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">Run History</h2>
        <p className="text-sm text-[rgb(var(--text-muted))]">{runs.length} total run{runs.length === 1 ? '' : 's'}</p>
      </div>

      <div className="panel space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="run-search">
              Search
            </label>
            <input
              className="input"
              id="run-search"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by scenario name or prompt"
              type="search"
              value={searchValue}
            />
          </div>

          <div>
            <label className="label" htmlFor="run-format-filter">
              Output Type
            </label>
            <select
              className="input"
              id="run-format-filter"
              onChange={(event) => onFilterFormatChange(event.target.value as 'All' | OutputFormat)}
              value={filterFormat}
            >
              <option value="All">All</option>
              {OUTPUT_FORMATS.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="label" htmlFor="run-tag-filter">
              Tag
            </label>
            <select
              className="input"
              id="run-tag-filter"
              onChange={(event) => onFilterTagChange(event.target.value)}
              value={filterTag}
            >
              <option value="">All tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {runs.length === 0 ? (
          <div className="empty-state">
            <p className="text-sm text-[rgb(var(--text-muted))]">
              {hasAnyRuns
                ? 'No runs match this search/filter combination.'
                : 'No runs yet. Execute your first scenario to build history.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {runs.map((run) => (
              <li
                className="rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.55)] p-4"
                key={run.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[rgb(var(--text-strong))]">{run.scenarioSnapshot.name}</p>
                      {run.isBest ? (
                        <span className="rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent-soft))] px-2 py-0.5 text-[11px] font-medium text-[rgb(var(--accent-strong))]">
                          Best
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                      {formatDateTime(run.createdAt)} • {run.scenarioSnapshot.outputFormat}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {run.scenarioSnapshot.constraints.map((tag) => (
                        <span
                          className="rounded-full border border-[rgb(var(--line))] px-2 py-0.5 text-[11px] text-[rgb(var(--text-muted))]"
                          key={`${run.id}-${tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button className="button-quiet" onClick={() => onView(run.id)} type="button">
                      View
                    </button>
                    <button className="button-quiet" onClick={() => onDuplicate(run.id)} type="button">
                      Duplicate
                    </button>
                    <button className="button-danger" onClick={() => onDelete(run.id)} type="button">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
