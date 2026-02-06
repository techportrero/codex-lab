import { PROMPT_TEMPLATES } from './templates';
import { Run, Scenario } from '../types';

function isoOffset(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

export function createSeedData(): { scenarios: Scenario[]; runs: Run[] } {
  const [bugFix, refactor, uiGen] = PROMPT_TEMPLATES;

  const scenarios: Scenario[] = [
    {
      id: 'scenario-seed-1',
      name: bugFix.scenario.name,
      goal: bugFix.scenario.goal,
      constraints: bugFix.scenario.constraints,
      outputFormat: bugFix.scenario.outputFormat,
      createdAt: isoOffset(180),
      updatedAt: isoOffset(120),
    },
    {
      id: 'scenario-seed-2',
      name: refactor.scenario.name,
      goal: refactor.scenario.goal,
      constraints: refactor.scenario.constraints,
      outputFormat: refactor.scenario.outputFormat,
      createdAt: isoOffset(95),
      updatedAt: isoOffset(70),
    },
    {
      id: 'scenario-seed-3',
      name: uiGen.scenario.name,
      goal: uiGen.scenario.goal,
      constraints: uiGen.scenario.constraints,
      outputFormat: uiGen.scenario.outputFormat,
      createdAt: isoOffset(60),
      updatedAt: isoOffset(45),
    },
  ];

  const runs: Run[] = [
    {
      id: 'run-seed-1',
      scenarioId: 'scenario-seed-1',
      promptText: bugFix.promptText,
      settings: bugFix.settings,
      outputText: `type CheckoutInput = {
  cartId: string;
  totalCents: number;
};

export function validateCheckout(input: CheckoutInput): void {
  if (!input.cartId.trim()) {
    throw new Error('Missing cart id');
  }

  // Guard against NaN and negative values before rounding.
  if (!Number.isFinite(input.totalCents) || input.totalCents < 0) {
    throw new Error('Invalid total');
  }
}
`,
      status: 'completed',
      createdAt: isoOffset(40),
      durationMs: 1126,
      isBest: true,
      notes: 'Best run so far. Tight patch and clear guard clauses.',
      scenarioSnapshot: {
        name: bugFix.scenario.name,
        goal: bugFix.scenario.goal,
        constraints: bugFix.scenario.constraints,
        outputFormat: bugFix.scenario.outputFormat,
      },
    },
    {
      id: 'run-seed-2',
      scenarioId: 'scenario-seed-2',
      promptText: refactor.promptText,
      settings: refactor.settings,
      outputText: `## Refactor Plan

1. Extract request validation from the handler.
2. Move persistence concerns into a small repository wrapper.
3. Replace nested conditionals with early returns.

## Safety Notes

- Kept all public method signatures unchanged.
- Added explicit unit tests around branch-heavy behavior.
- Preserved logging format to avoid breaking monitoring dashboards.
`,
      status: 'completed',
      createdAt: isoOffset(24),
      durationMs: 957,
      isBest: false,
      notes: 'Readable, but could be more concrete on tradeoffs.',
      scenarioSnapshot: {
        name: refactor.scenario.name,
        goal: refactor.scenario.goal,
        constraints: refactor.scenario.constraints,
        outputFormat: refactor.scenario.outputFormat,
      },
    },
    {
      id: 'run-seed-3',
      scenarioId: 'scenario-seed-3',
      promptText: uiGen.promptText,
      settings: uiGen.settings,
      outputText: JSON.stringify(
        {
          componentName: 'MetricCard',
          props: {
            title: 'string',
            value: 'string | number',
            trend: "'up' | 'down' | 'neutral'",
          },
          interactionStates: ['default', 'hover', 'focus-visible'],
          accessibilityChecklist: [
            '4.5:1 text contrast',
            'Semantic heading structure',
            'Keyboard focus ring',
          ],
          implementationPlan: [
            'Create typed props interface',
            'Add responsive Tailwind classes',
            'Document examples in Storybook',
          ],
        },
        null,
        2,
      ),
      status: 'completed',
      createdAt: isoOffset(8),
      durationMs: 801,
      isBest: false,
      notes: '',
      scenarioSnapshot: {
        name: uiGen.scenario.name,
        goal: uiGen.scenario.goal,
        constraints: uiGen.scenario.constraints,
        outputFormat: uiGen.scenario.outputFormat,
      },
    },
  ];

  return { scenarios, runs };
}
