import { BuilderDraft, OutputFormat } from '../types';

interface SimulateOutput {
  outputText: string;
  durationMs: number;
}

function previewText(text: string, maxLength = 80): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) {
    return compact;
  }
  return `${compact.slice(0, maxLength)}...`;
}

function codeOutput(draft: BuilderDraft): string {
  const constraints = draft.constraints.length
    ? draft.constraints.map((item) => `  '${item}'`).join(',\n')
    : "  'No explicit constraints provided'";

  return `type ScenarioInput = {
  name: string;
  goal: string;
  prompt: string;
  constraints: string[];
};

export function runScenario(input: ScenarioInput) {
  const summary = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    score: 0.92,
    modelHints: {
      temperature: ${draft.settings.temperature.toFixed(2)},
      maxTokens: ${draft.settings.maxTokens},
    },
  };

  return {
    ...summary,
    scenario: input.name,
    goal: input.goal,
    promptPreview: input.prompt.slice(0, 120),
    constraints: [
${constraints}
    ],
  };
}

const result = runScenario({
  name: '${draft.scenarioName}',
  goal: '${draft.goal.replace(/'/g, "\\'")}',
  prompt: '${previewText(draft.promptText, 72).replace(/'/g, "\\'")}',
  constraints: [${draft.constraints.map((tag) => `'${tag.replace(/'/g, "\\'")}'`).join(', ')}],
});

console.log(result);
`;
}

function markdownOutput(draft: BuilderDraft): string {
  const constraintLines = draft.constraints.length
    ? draft.constraints.map((tag) => `- ${tag}`).join('\n')
    : '- None provided';

  return `# ${draft.scenarioName}\n\n## Goal\n${draft.goal}\n\n## Constraints\n${constraintLines}\n\n## Prompt Snapshot\n> ${previewText(draft.promptText, 180)}\n\n## Recommended Next Steps\n1. Run one low-temperature baseline.\n2. Run one exploratory variant at +0.2 temperature.\n3. Compare outputs and mark the strongest run as Best.\n`;
}

function jsonOutput(draft: BuilderDraft): string {
  const payload = {
    scenario: {
      name: draft.scenarioName,
      goal: draft.goal,
      constraints: draft.constraints,
      outputFormat: draft.outputFormat,
    },
    runSummary: {
      qualityScore: 0.89,
      determinism: draft.settings.temperature <= 0.3 ? 'high' : 'moderate',
      promptDigest: previewText(draft.promptText, 120),
      settings: draft.settings,
    },
    suggestions: [
      'Add one strict negative constraint to reduce off-target output.',
      'Capture acceptance criteria as checkboxes in the prompt.',
      'Duplicate this run and test with lower max tokens for concise responses.',
    ],
  };

  return JSON.stringify(payload, null, 2);
}

function plainTextOutput(draft: BuilderDraft): string {
  const constraints = draft.constraints.length ? draft.constraints.join(', ') : 'none';

  return `Scenario ${draft.scenarioName} was processed with ${draft.settings.maxTokens} max tokens at temperature ${draft.settings.temperature.toFixed(2)}. The primary goal is ${draft.goal}. Active constraints: ${constraints}. Prompt summary: ${previewText(draft.promptText, 200)}. Suggested next action: run one stricter variant focused on acceptance criteria and compare line-by-line against this result.`;
}

function outputForFormat(format: OutputFormat, draft: BuilderDraft): string {
  switch (format) {
    case 'Code':
      return codeOutput(draft);
    case 'Markdown':
      return markdownOutput(draft);
    case 'JSON':
      return jsonOutput(draft);
    case 'Plain text':
      return plainTextOutput(draft);
    default:
      return plainTextOutput(draft);
  }
}

export async function runSimulatedScenario(draft: BuilderDraft): Promise<SimulateOutput> {
  const durationMs = 850 + Math.floor(Math.random() * 900);
  await new Promise((resolve) => window.setTimeout(resolve, durationMs));

  return {
    outputText: outputForFormat(draft.outputFormat, draft),
    durationMs,
  };
}
