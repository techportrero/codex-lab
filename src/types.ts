export const OUTPUT_FORMATS = ['Code', 'Markdown', 'JSON', 'Plain text'] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export type RunStatus = 'running' | 'completed' | 'failed';

export type ThemeMode = 'light' | 'dark';

export interface Scenario {
  id: string;
  name: string;
  goal: string;
  constraints: string[];
  outputFormat: OutputFormat;
  createdAt: string;
  updatedAt: string;
}

export interface RunSettings {
  temperature: number;
  maxTokens: number;
}

export interface Run {
  id: string;
  scenarioId: string;
  promptText: string;
  settings: RunSettings;
  outputText: string;
  status: RunStatus;
  createdAt: string;
  durationMs: number;
  isBest: boolean;
  notes: string;
  scenarioSnapshot: {
    name: string;
    goal: string;
    constraints: string[];
    outputFormat: OutputFormat;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  scenario: {
    name: string;
    goal: string;
    constraints: string[];
    outputFormat: OutputFormat;
  };
  promptText: string;
  settings: RunSettings;
}

export interface BuilderDraft {
  scenarioId?: string;
  scenarioName: string;
  goal: string;
  constraints: string[];
  outputFormat: OutputFormat;
  promptText: string;
  settings: RunSettings;
}
