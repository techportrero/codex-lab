import { PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'bug-fix',
    name: 'Bug Fix',
    description: 'Locate root cause and provide a minimal safe patch.',
    scenario: {
      name: 'Stabilize Checkout Bug',
      goal: 'Resolve a reproducible payment edge case without changing public APIs.',
      constraints: ['No breaking changes', 'Preserve tests', 'Small diff'],
      outputFormat: 'Code',
    },
    promptText: `You are fixing a production bug.

Context:
- Module: <path/to/file>
- Symptom: <what fails>
- Repro steps: <steps>

Tasks:
1. Explain the root cause in 2-4 bullets.
2. Provide a minimal patch.
3. Add or update tests proving the fix.
4. List risk and rollback plan.

Return code first, then brief rationale.`,
    settings: {
      temperature: 0.2,
      maxTokens: 1600,
    },
  },
  {
    id: 'refactor',
    name: 'Refactor',
    description: 'Improve structure and readability while keeping behavior unchanged.',
    scenario: {
      name: 'Refactor Legacy Service',
      goal: 'Reduce complexity and improve maintainability.',
      constraints: ['Behavior must match', 'Type-safe', 'Document tradeoffs'],
      outputFormat: 'Markdown',
    },
    promptText: `Refactor this code for readability and maintainability.

Requirements:
- Keep observable behavior identical.
- Split large functions into composable units.
- Improve naming and remove duplication.
- Keep final answer concise.

Output:
- Refactoring plan
- Updated code
- Why this is safer`,
    settings: {
      temperature: 0.35,
      maxTokens: 1800,
    },
  },
  {
    id: 'write-tests',
    name: 'Write Tests',
    description: 'Generate focused tests for critical behavior and edge cases.',
    scenario: {
      name: 'Coverage Expansion Sprint',
      goal: 'Add high-signal tests for fragile paths.',
      constraints: ['Fast tests', 'Deterministic', 'Edge cases included'],
      outputFormat: 'Code',
    },
    promptText: `Write tests for the following module:

<module code>

Requirements:
- Cover success path, failure path, and edge cases.
- Use clear arrange/act/assert structure.
- Avoid brittle snapshot tests unless justified.
- Include one table-driven test if suitable.

Return only test code and short assumptions.`,
    settings: {
      temperature: 0.15,
      maxTokens: 1400,
    },
  },
  {
    id: 'explain-code',
    name: 'Explain Code',
    description: 'Produce a concise technical walkthrough for onboarding and reviews.',
    scenario: {
      name: 'Architecture Walkthrough',
      goal: 'Explain critical flow for a new team member.',
      constraints: ['Clear language', 'No fluff', 'Highlight risks'],
      outputFormat: 'Plain text',
    },
    promptText: `Explain this code to a senior engineer joining the team.

Include:
1. High-level purpose
2. Data flow in order
3. Important edge cases
4. Risks and technical debt
5. Suggested next improvements

Keep the explanation practical and no more than 400 words.`,
    settings: {
      temperature: 0.4,
      maxTokens: 1100,
    },
  },
  {
    id: 'generate-ui-component',
    name: 'Generate UI Component',
    description: 'Create a production-ready UI component with accessibility details.',
    scenario: {
      name: 'Design System Component',
      goal: 'Generate a reusable component with good defaults and keyboard support.',
      constraints: ['Accessible', 'Responsive', 'Theme-aware'],
      outputFormat: 'JSON',
    },
    promptText: `Generate a reusable UI component spec and implementation notes.

Return valid JSON with these keys:
- componentName
- props
- interactionStates
- accessibilityChecklist
- implementationPlan

Context:
- Framework: React + TypeScript
- Styling: Tailwind
- Goal: ship-ready component`,
    settings: {
      temperature: 0.3,
      maxTokens: 1300,
    },
  },
];
