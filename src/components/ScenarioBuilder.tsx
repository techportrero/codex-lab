import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { BuilderDraft, OUTPUT_FORMATS, PromptTemplate } from '../types';
import { sanitizeTag } from '../lib/format';

interface ScenarioBuilderProps {
  draft: BuilderDraft;
  templates: PromptTemplate[];
  isRunning: boolean;
  error: string | null;
  onChange: (next: BuilderDraft) => void;
  onApplyTemplate: (template: PromptTemplate) => void;
  onClearPrompt: () => void;
  onRun: () => void;
}

export function ScenarioBuilder({
  draft,
  templates,
  isRunning,
  error,
  onChange,
  onApplyTemplate,
  onClearPrompt,
  onRun,
}: ScenarioBuilderProps): JSX.Element {
  const [tagInput, setTagInput] = useState('');
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const templateMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleWindowClick(event: MouseEvent): void {
      if (!templateMenuRef.current) {
        return;
      }
      if (!templateMenuRef.current.contains(event.target as Node)) {
        setShowTemplateMenu(false);
      }
    }

    if (showTemplateMenu) {
      window.addEventListener('mousedown', handleWindowClick);
      return () => window.removeEventListener('mousedown', handleWindowClick);
    }

    return undefined;
  }, [showTemplateMenu]);

  function updateDraft(partial: Partial<BuilderDraft>): void {
    onChange({ ...draft, ...partial });
  }

  function addConstraintFromInput(): void {
    const nextTag = sanitizeTag(tagInput);
    if (!nextTag || draft.constraints.includes(nextTag)) {
      setTagInput('');
      return;
    }

    updateDraft({ constraints: [...draft.constraints, nextTag] });
    setTagInput('');
  }

  function onTagKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addConstraintFromInput();
    }

    if (event.key === 'Backspace' && !tagInput && draft.constraints.length > 0) {
      updateDraft({ constraints: draft.constraints.slice(0, -1) });
    }
  }

  function removeConstraint(tag: string): void {
    updateDraft({ constraints: draft.constraints.filter((item) => item !== tag) });
  }

  return (
    <section className="space-y-4" id="scenarios">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">Scenario Builder</h2>
        {isRunning ? (
          <span className="inline-flex items-center rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent-soft))] px-3 py-1 text-xs font-medium text-[rgb(var(--accent-strong))]">
            Running...
          </span>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel space-y-4">
          <div>
            <label className="label" htmlFor="scenario-name">
              Scenario Name
            </label>
            <input
              className="input"
              id="scenario-name"
              onChange={(event) => updateDraft({ scenarioName: event.target.value })}
              placeholder="e.g. Stabilize Checkout Bug"
              type="text"
              value={draft.scenarioName}
            />
          </div>

          <div>
            <label className="label" htmlFor="scenario-goal">
              Goal
            </label>
            <textarea
              className="textarea"
              id="scenario-goal"
              onChange={(event) => updateDraft({ goal: event.target.value })}
              placeholder="Describe what success looks like"
              rows={4}
              value={draft.goal}
            />
          </div>

          <div>
            <label className="label" htmlFor="scenario-constraints">
              Constraints
            </label>
            <div className="input flex min-h-11 flex-wrap items-center gap-2 py-2">
              {draft.constraints.map((tag) => (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted))] px-2.5 py-1 text-xs text-[rgb(var(--text-strong))]"
                  key={tag}
                >
                  {tag}
                  <button
                    aria-label={`Remove ${tag}`}
                    className="rounded p-0.5 text-[rgb(var(--text-muted))] transition-colors duration-200 ease-out hover:text-[rgb(var(--text-strong))]"
                    onClick={() => removeConstraint(tag)}
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                className="min-w-[8rem] flex-1 bg-transparent text-sm text-[rgb(var(--text-strong))] outline-none placeholder:text-[rgb(var(--text-subtle))]"
                id="scenario-constraints"
                onBlur={addConstraintFromInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={onTagKeyDown}
                placeholder="Type and press Enter"
                type="text"
                value={tagInput}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="output-format">
              Output Format
            </label>
            <select
              className="input"
              id="output-format"
              onChange={(event) =>
                updateDraft({ outputFormat: event.target.value as BuilderDraft['outputFormat'] })
              }
              value={draft.outputFormat}
            >
              {OUTPUT_FORMATS.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="space-y-3 rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.7)] p-4">
            <legend className="label px-1">Model Settings (optional)</legend>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="label" htmlFor="temperature-slider">
                  Temperature
                </label>
                <span className="text-xs text-[rgb(var(--text-muted))]">{draft.settings.temperature.toFixed(2)}</span>
              </div>
              <input
                className="w-full accent-[rgb(var(--accent-strong))]"
                id="temperature-slider"
                max={1}
                min={0}
                onChange={(event) =>
                  updateDraft({
                    settings: {
                      ...draft.settings,
                      temperature: Number(event.target.value),
                    },
                  })
                }
                step={0.05}
                type="range"
                value={draft.settings.temperature}
              />
            </div>

            <div>
              <label className="label" htmlFor="max-tokens-input">
                Max Tokens
              </label>
              <input
                className="input"
                id="max-tokens-input"
                max={8192}
                min={64}
                onChange={(event) =>
                  updateDraft({
                    settings: {
                      ...draft.settings,
                      maxTokens: Number(event.target.value || 0),
                    },
                  })
                }
                type="number"
                value={draft.settings.maxTokens}
              />
            </div>
          </fieldset>
        </div>

        <div className="panel space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold tracking-tight text-[rgb(var(--text-strong))]">Prompt Editor</h3>

            <div className="flex flex-wrap gap-2" ref={templateMenuRef}>
              <div className="relative">
                <button
                  aria-expanded={showTemplateMenu}
                  aria-haspopup="menu"
                  className="button-quiet"
                  onClick={() => setShowTemplateMenu((current) => !current)}
                  type="button"
                >
                  Insert Template
                </button>

                {showTemplateMenu ? (
                  <div
                    className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-2 shadow-soft"
                    role="menu"
                  >
                    {templates.map((template) => (
                      <button
                        className="block w-full rounded-xl px-3 py-2 text-left transition-colors duration-200 ease-out hover:bg-[rgb(var(--surface-muted))] focus-ring"
                        key={template.id}
                        onClick={() => {
                          onApplyTemplate(template);
                          setShowTemplateMenu(false);
                        }}
                        role="menuitem"
                        type="button"
                      >
                        <p className="text-sm font-medium text-[rgb(var(--text-strong))]">{template.name}</p>
                        <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">{template.description}</p>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button className="button-quiet" onClick={onClearPrompt} type="button">
                Clear
              </button>
              <button className="button-primary" disabled={isRunning} onClick={onRun} type="button">
                Run
              </button>
            </div>
          </div>

          <label className="sr-only" htmlFor="prompt-editor">
            Prompt text
          </label>
          <textarea
            className="min-h-[25.5rem] w-full rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface-muted)/0.55)] px-4 py-3 font-mono text-sm leading-6 text-[rgb(var(--text-strong))] outline-none transition-all duration-200 ease-out placeholder:text-[rgb(var(--text-subtle))] focus:border-[rgb(var(--accent)/0.6)] focus:ring-2 focus:ring-[rgb(var(--accent)/0.2)]"
            id="prompt-editor"
            onChange={(event) => updateDraft({ promptText: event.target.value })}
            placeholder="Write your structured prompt here..."
            spellCheck={false}
            value={draft.promptText}
          />

          {error ? <p className="text-sm text-[rgb(var(--danger))]">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
