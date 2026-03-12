# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Type-check + production build (tsc -b && vite build)
npm run lint         # ESLint across all files
npm test             # Run Vitest in watch mode
npm test -- --run    # Run Vitest once (CI mode)
```

Run a single test file:
```bash
npm test -- src/App.test.tsx
```

Run Cypress E2E tests (requires dev server running):
```bash
npx cypress run --e2e
npx cypress open     # Interactive mode
```

Run Cypress component tests:
```bash
npx cypress run --component
npx cypress open --component
```

## Architecture

Early-stage React 19 + TypeScript SPA scaffolded with Vite. Two test layers:

- **Vitest + React Testing Library** — unit/integration tests colocated with source (`src/**/*.test.tsx`). Configured in `vite.config.ts` with `jsdom` environment and globals enabled. Setup file at `vitest.setup.ts` imports `@testing-library/jest-dom` and calls `cleanup()` after each test.
- **Cypress** — E2E tests in `cypress/e2e/` and component tests in `cypress/component/`. Component tests use Vite+React as the dev server.

Pre-commit hook (Husky + lint-staged) runs `eslint --cache --fix` on staged `*.ts`/`*.tsx` files.

Development guidelines (TDD workflow, TypeScript patterns, functional style) are in `.claude/CLAUDE.md`.
