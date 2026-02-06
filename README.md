# CodexLab Tool Test Bench

A premium, local-first web app for testing Codex/AI-assisted development scenarios.
It lets you design structured prompts, simulate runs, save results, compare outputs, and present polished artifacts for portfolio use.

## Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- localStorage persistence (no backend)

## Features

- Apple-inspired minimal UI with light/dark themes, subtle gradients, and calm motion.
- Sticky top bar with section navigation and quick `New Run` action.
- Hero section with focused CTAs.
- Scenario Builder:
  - Scenario name, goal, constraints tag input
  - Output format selector (`Code`, `Markdown`, `JSON`, `Plain text`)
  - Model settings (`temperature`, `max tokens`)
  - Prompt editor with template insertion, clear, and run
- Prompt Template Library:
  - Bug Fix
  - Refactor
  - Write Tests
  - Explain Code
  - Generate UI Component
- Simulated run execution:
  - Inline running state
  - Generated output and run duration
- Output Viewer tabs:
  - Output (syntax-highlighted for code/JSON/Markdown)
  - Logs (timestamp, scenario ID, settings, duration)
  - Notes (editable and persisted)
- Run History:
  - Search and filter by output type and tag
  - View, Duplicate, Delete actions
  - Best-run badge support
- Compare view:
  - Two-run selection
  - Side-by-side output comparison
  - Synchronized scrolling
  - Changed-line highlighting
- About/footer section with portfolio-oriented messaging and contact link placeholders.
- Seeded sample data on first load.
- Robust empty states for all primary sections.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Customize Branding & Color Grading

### Brand name and labels

- Top bar brand text: `src/components/TopBar.tsx`
- Hero title/subtitle: `src/components/Hero.tsx`
- About copy/footer links: `src/components/AboutFooter.tsx`

### Theme palette and visual tone

- All design tokens live in `src/index.css` under `:root` and `[data-theme='dark']`:
  - `--bg`, `--surface`, `--surface-muted`
  - `--text-strong`, `--text-muted`, `--text-subtle`
  - `--line`, `--accent`, `--accent-strong`, `--accent-soft`
- Shared component styling classes (`.panel`, `.button-primary`, `.input`, etc.) are also in `src/index.css`.

### Prompt templates

- Edit template metadata and pre-filled prompts in `src/data/templates.ts`.

### Seeded demo content

- Update first-load sample scenarios/runs in `src/data/seed.ts`.

## Persistence Model

Stored in localStorage (`codexlab:store:v1`):

- `Scenario`: `{ id, name, goal, constraints[], outputFormat, createdAt, updatedAt }`
- `Run`: `{ id, scenarioId, promptText, settings, outputText, status, createdAt, durationMs, isBest, notes, scenarioSnapshot }`

Theme is stored separately under `codexlab:theme`.
