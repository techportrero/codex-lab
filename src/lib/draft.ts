import { PROMPT_TEMPLATES } from '../data/templates';
import { BuilderDraft, PromptTemplate, Run } from '../types';

export function createDefaultDraft(): BuilderDraft {
  const template = PROMPT_TEMPLATES[0];
  return draftFromTemplate(template);
}

export function draftFromTemplate(template: PromptTemplate): BuilderDraft {
  return {
    scenarioName: template.scenario.name,
    goal: template.scenario.goal,
    constraints: [...template.scenario.constraints],
    outputFormat: template.scenario.outputFormat,
    promptText: template.promptText,
    settings: { ...template.settings },
  };
}

export function duplicateRunToDraft(run: Run): BuilderDraft {
  return {
    scenarioName: `${run.scenarioSnapshot.name} Copy`,
    goal: run.scenarioSnapshot.goal,
    constraints: [...run.scenarioSnapshot.constraints],
    outputFormat: run.scenarioSnapshot.outputFormat,
    promptText: run.promptText,
    settings: { ...run.settings },
  };
}
