import { useEffect, useMemo, useState } from 'react';
import { AboutFooter } from './components/AboutFooter';
import { CompareSection } from './components/CompareSection';
import { Hero } from './components/Hero';
import { OutputViewer } from './components/OutputViewer';
import { RunHistory } from './components/RunHistory';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { TopBar } from './components/TopBar';
import { PROMPT_TEMPLATES } from './data/templates';
import { draftFromTemplate, duplicateRunToDraft, createDefaultDraft } from './lib/draft';
import { extensionForFormat } from './lib/format';
import { runSimulatedScenario } from './lib/simulate';
import { getInitialTheme, loadOrCreateStore, persistStore, persistTheme } from './lib/storage';
import { BuilderDraft, OutputFormat, Run, Scenario, ThemeMode } from './types';

type HistoryFormatFilter = 'All' | OutputFormat;
type OutputTab = 'output' | 'logs' | 'notes';

function byNewest(a: Run, b: Run): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function App(): JSX.Element {
  const initialStore = useMemo(() => loadOrCreateStore(), []);
  const initialRuns = useMemo(() => [...initialStore.runs].sort(byNewest), [initialStore.runs]);
  const initialCompleted = useMemo(
    () => initialRuns.filter((run) => run.status === 'completed'),
    [initialRuns],
  );

  const [scenarios, setScenarios] = useState<Scenario[]>(initialStore.scenarios);
  const [runs, setRuns] = useState<Run[]>(initialRuns);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [draft, setDraft] = useState<BuilderDraft>(() => createDefaultDraft());
  const [activeRunId, setActiveRunId] = useState<string | null>(initialRuns[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState<OutputTab>('output');
  const [runningRunId, setRunningRunId] = useState<string | null>(null);
  const [builderError, setBuilderError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState('');
  const [filterFormat, setFilterFormat] = useState<HistoryFormatFilter>('All');
  const [filterTag, setFilterTag] = useState('');

  const [leftRunId, setLeftRunId] = useState<string | null>(initialCompleted[0]?.id ?? null);
  const [rightRunId, setRightRunId] = useState<string | null>(initialCompleted[1]?.id ?? null);

  useEffect(() => {
    persistStore(scenarios, runs);
  }, [scenarios, runs]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!statusMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => setStatusMessage(null), 2200);
    return () => window.clearTimeout(timerId);
  }, [statusMessage]);

  const activeRun = useMemo(
    () => runs.find((run) => run.id === activeRunId) ?? null,
    [activeRunId, runs],
  );

  const completedRuns = useMemo(
    () => runs.filter((run) => run.status === 'completed'),
    [runs],
  );

  useEffect(() => {
    setLeftRunId((current) => {
      if (current && completedRuns.some((run) => run.id === current)) {
        return current;
      }
      return completedRuns[0]?.id ?? null;
    });
  }, [completedRuns]);

  useEffect(() => {
    setRightRunId((current) => {
      if (
        current &&
        current !== leftRunId &&
        completedRuns.some((run) => run.id === current)
      ) {
        return current;
      }

      return completedRuns.find((run) => run.id !== leftRunId)?.id ?? null;
    });
  }, [completedRuns, leftRunId]);

  const allTags = useMemo(() => {
    return Array.from(new Set(runs.flatMap((run) => run.scenarioSnapshot.constraints))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [runs]);

  const filteredRuns = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return runs.filter((run) => {
      const matchesFormat = filterFormat === 'All' || run.scenarioSnapshot.outputFormat === filterFormat;
      const matchesTag = !filterTag || run.scenarioSnapshot.constraints.includes(filterTag);
      const matchesQuery =
        !query ||
        run.scenarioSnapshot.name.toLowerCase().includes(query) ||
        run.promptText.toLowerCase().includes(query);

      return matchesFormat && matchesTag && matchesQuery;
    });
  }, [filterFormat, filterTag, runs, searchValue]);

  async function handleRun(): Promise<void> {
    if (runningRunId) {
      return;
    }

    if (!draft.scenarioName.trim() || !draft.goal.trim() || !draft.promptText.trim()) {
      setBuilderError('Scenario name, goal, and prompt are required before running.');
      return;
    }

    if (draft.settings.maxTokens < 64) {
      setBuilderError('Max tokens must be at least 64.');
      return;
    }

    setBuilderError(null);

    const draftSnapshot: BuilderDraft = {
      ...draft,
      constraints: [...draft.constraints],
      settings: { ...draft.settings },
    };

    const scenarioId = draftSnapshot.scenarioId ?? crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const scenario: Scenario = {
      id: scenarioId,
      name: draftSnapshot.scenarioName,
      goal: draftSnapshot.goal,
      constraints: draftSnapshot.constraints,
      outputFormat: draftSnapshot.outputFormat,
      createdAt:
        scenarios.find((current) => current.id === scenarioId)?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    setScenarios((previous) => {
      const existingIndex = previous.findIndex((item) => item.id === scenarioId);
      if (existingIndex === -1) {
        return [scenario, ...previous];
      }

      return previous.map((item) => (item.id === scenarioId ? scenario : item));
    });

    setDraft((previous) => ({ ...previous, scenarioId }));

    const runId = crypto.randomUUID();
    const runningRun: Run = {
      id: runId,
      scenarioId,
      promptText: draftSnapshot.promptText,
      settings: draftSnapshot.settings,
      outputText: '',
      status: 'running',
      createdAt: timestamp,
      durationMs: 0,
      isBest: false,
      notes: '',
      scenarioSnapshot: {
        name: draftSnapshot.scenarioName,
        goal: draftSnapshot.goal,
        constraints: draftSnapshot.constraints,
        outputFormat: draftSnapshot.outputFormat,
      },
    };

    setRuns((previous) => [runningRun, ...previous]);
    setActiveRunId(runId);
    setActiveTab('output');
    setRunningRunId(runId);
    scrollToSection('output');

    try {
      const result = await runSimulatedScenario(draftSnapshot);

      setRuns((previous) =>
        previous.map((run) =>
          run.id === runId
            ? {
                ...run,
                status: 'completed',
                outputText: result.outputText,
                durationMs: result.durationMs,
              }
            : run,
        ),
      );
      setStatusMessage('Run completed.');
    } catch {
      setRuns((previous) =>
        previous.map((run) =>
          run.id === runId
            ? {
                ...run,
                status: 'failed',
                outputText: 'Simulation failed. Try running again.',
              }
            : run,
        ),
      );
      setStatusMessage('Run failed.');
    } finally {
      setRunningRunId(null);
    }
  }

  function handleToggleTheme(): void {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  function handleNewRun(): void {
    setDraft(createDefaultDraft());
    setBuilderError(null);
    scrollToSection('scenarios');
  }

  function handleApplyTemplate(templateId: string): void {
    const template = PROMPT_TEMPLATES.find((item) => item.id === templateId);
    if (!template) {
      return;
    }

    setDraft(draftFromTemplate(template));
    setBuilderError(null);
  }

  function handleCopyOutput(): void {
    if (!activeRun || activeRun.status !== 'completed') {
      return;
    }

    window.navigator.clipboard
      .writeText(activeRun.outputText)
      .then(() => setStatusMessage('Output copied to clipboard.'))
      .catch(() => setStatusMessage('Copy failed.'));
  }

  function handleDownloadOutput(): void {
    if (!activeRun || activeRun.status !== 'completed') {
      return;
    }

    const extension = extensionForFormat(activeRun.scenarioSnapshot.outputFormat);
    const timestamp = new Date(activeRun.createdAt).toISOString().replace(/[:.]/g, '-');
    const fileName = `${slugify(activeRun.scenarioSnapshot.name)}-${timestamp}.${extension}`;
    const blob = new Blob([activeRun.outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Output downloaded.');
  }

  function handleToggleBest(): void {
    if (!activeRunId) {
      return;
    }

    setRuns((previous) =>
      previous.map((run) =>
        run.id === activeRunId
          ? {
              ...run,
              isBest: !run.isBest,
            }
          : run,
      ),
    );
  }

  function handleUpdateNotes(notes: string): void {
    if (!activeRunId) {
      return;
    }

    setRuns((previous) =>
      previous.map((run) =>
        run.id === activeRunId
          ? {
              ...run,
              notes,
            }
          : run,
      ),
    );
  }

  function handleViewRun(runId: string): void {
    setActiveRunId(runId);
    setActiveTab('output');
    scrollToSection('output');
  }

  function handleDuplicateRun(runId: string): void {
    const run = runs.find((item) => item.id === runId);
    if (!run) {
      return;
    }

    setDraft(duplicateRunToDraft(run));
    setBuilderError(null);
    scrollToSection('scenarios');
    setStatusMessage('Run duplicated into builder.');
  }

  function handleDeleteRun(runId: string): void {
    const shouldDelete = window.confirm('Delete this run permanently?');
    if (!shouldDelete) {
      return;
    }

    setRuns((previous) => {
      const nextRuns = previous.filter((run) => run.id !== runId).sort(byNewest);

      if (activeRunId === runId) {
        setActiveRunId(nextRuns[0]?.id ?? null);
      }

      return nextRuns;
    });
  }

  return (
    <div className="min-h-screen" id="top">
      <TopBar theme={theme} onNewRun={handleNewRun} onToggleTheme={handleToggleTheme} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-10 sm:px-6 lg:px-8">
        <Hero onCreateRun={() => scrollToSection('scenarios')} onViewHistory={() => scrollToSection('runs')} />

        <ScenarioBuilder
          draft={draft}
          error={builderError}
          isRunning={Boolean(runningRunId)}
          onApplyTemplate={(template) => handleApplyTemplate(template.id)}
          onChange={setDraft}
          onClearPrompt={() => setDraft((previous) => ({ ...previous, promptText: '' }))}
          onRun={handleRun}
          templates={PROMPT_TEMPLATES}
        />

        <OutputViewer
          activeTab={activeTab}
          onCopy={handleCopyOutput}
          onDownload={handleDownloadOutput}
          onTabChange={setActiveTab}
          onToggleBest={handleToggleBest}
          onUpdateNotes={handleUpdateNotes}
          run={activeRun}
        />

        <RunHistory
          filterFormat={filterFormat}
          filterTag={filterTag}
          hasAnyRuns={runs.length > 0}
          onDelete={handleDeleteRun}
          onDuplicate={handleDuplicateRun}
          onFilterFormatChange={setFilterFormat}
          onFilterTagChange={setFilterTag}
          onSearchChange={setSearchValue}
          onView={handleViewRun}
          runs={filteredRuns}
          searchValue={searchValue}
          tags={allTags}
        />

        <CompareSection
          leftRunId={leftRunId}
          onLeftChange={setLeftRunId}
          onRightChange={setRightRunId}
          rightRunId={rightRunId}
          runs={completedRuns}
        />

        <AboutFooter />
      </main>

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        {statusMessage ? <p className="status-pill">{statusMessage}</p> : null}
      </div>
    </div>
  );
}
