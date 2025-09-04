CRUSH quickstart for agents working in this repo

Stack
- Next.js 15 (App Router), React 19, TypeScript 5, ESLint 9 (flat config), Tailwind CSS 4
- Path alias: @/* -> src/*

Install/build/run
- Install: npm i
- Dev: npm run dev (Next + Turbopack on http://localhost:3000)
- Build: npm run build (Turbopack)
- Start prod: npm start

Lint/typecheck/format
- Lint all: npm run lint
- Lint specific file: npx eslint path/to/file.{ts,tsx}
- Typecheck: npx tsc --noEmit
- Format: use Prettier defaults if present; otherwise follow rules below (no formatter script defined)

Testing
- No test framework configured. If you add tests, prefer Vitest or Jest. Example single test run: npx vitest run path/to/test.spec.ts or npx jest path/to/test.test.ts.

Code style guidelines
- Imports: use type-only imports for types (import type { X }); absolute imports via @/ for src; group as: built-ins, external, internal(@/), then relative; no default-export unless React components/pages; prefer named exports.
- Formatting: 2-space indent; semicolons required; single quotes in TS/JS, double quotes in JSON; trailing commas where valid; max line ~100-120.
- Types: strict TypeScript enabled; avoid any; prefer unknown over any; narrow with type guards; define interfaces for object shapes; reuse Next.js/React types from next and react.
- React/Next: Server Components by default; use 'use client' only when needed; keep components small and pure; prefer async server functions; avoid fetch in client unless necessary.
- Naming: camelCase for variables/functions; PascalCase for React components/types; UPPER_SNAKE_CASE for env constants; files kebab-case for non-components, PascalCase for components.
- Error handling: never swallow errors; throw new Error with message (no console logs in prod paths); in API/server actions return typed Result objects or throw and handle at boundary; validate inputs (zod or similar) before use.
- State/data: prefer React useState/useReducer minimally in client; cache/fetch on server; use Suspense for data fetching components.
- CSS: Tailwind CSS v4; keep globals in src/app/globals.css; co-locate component styles; avoid arbitrary values when a token exists.

Project conventions
- ESLint config extends next/core-web-vitals and next/typescript; respect its rules, fix warnings before commit.
- tsconfig uses "moduleResolution": "bundler"; do not rely on Node-style path resolution outside that model.
- Env: do not hardcode secrets; if you add envs, document them in .env.example and reference via process.env only on server.

Cursor/Copilot rules
- No Cursor or Copilot instruction files found in this repo. If added later (.cursor/rules/, .cursorrules, .github/copilot-instructions.md), mirror their key points here.
