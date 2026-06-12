---
name: ferrousaurus-react-best-practices
description: React writing conventions that enforce functional component patterns, correct state management primitives, restricted useEffect usage, TanStack Query data fetching, slot-based composition, and consistent hook and rendering patterns. Contains 27 rules across 8 categories. Triggers on writing, reviewing, or refactoring React code.
license: MIT
metadata:
  author: ferrousaurus
  version: "1.0.0"
---

# Ferrousaurus React Best Practices

React writing conventions, designed for AI agents and LLMs. Contains 27 rules across 8 categories, prioritized by impact from critical (component definition and export conventions) to incremental (file organization and naming).

## When to Apply

Reference these guidelines when:
- Writing new React components or hooks
- Reviewing React code for pattern consistency
- Refactoring React code
- Setting up a new React project
- Deciding between state management approaches (useState vs useReducer vs Zustand/Jotai)

## Core Principle

The central convention is **`useEffect` only for synchronizing with external systems** — everything else has a better alternative. Combined with function components, useReducer for non-trivial state, TanStack Query for all server state, and slot-based composition, these rules eliminate the most common React anti-patterns.

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Component Definition | CRITICAL | `component-` |
| 2 | State Management | HIGH | `state-` |
| 3 | Effects & Lifecycle | HIGH | `effect-` |
| 4 | Data Fetching | HIGH | `data-` |
| 5 | Composition & Props | MEDIUM | `composition-` |
| 6 | Hooks | MEDIUM | `hook-` |
| 7 | Conditional Rendering | MEDIUM | `render-` |
| 8 | File Organization | LOW | `file-` |

## Quick Reference

### 1. Component Definition (CRITICAL)

- `component-function-over-class` — Function components only, never class components
- `component-arrow-vs-declaration` — Arrow for simple/hookless, `function` declaration for hook-using
- `component-no-react-fc` — Never use `React.FC`. Named `export type` for props, destructure in signature
- `component-exports` — Default export for component, named `export type` for props
- `component-server-client-boundary` — Metaframework-aware: TanStack Start uses server functions, Next.js is server-first

### 2. State Management (HIGH)

- `state-usereducer-nontrivial` — `useState` for simple values; `useReducer` for interdependent/complex state
- `state-no-context-runtime` — Context only for static/readonly wiring. Runtime state uses Zustand/Jotai (per stack-preferences)
- `state-no-prop-drilling` — Switch to store after 1-2 intermediate layers that don't use the prop
- `state-key-reset` — Use `key` prop to reset state, never `useEffect`
- `state-use-ref-only` — `useRef` only for DOM refs and non-rendering instance values

### 3. Effects & Lifecycle (HIGH)

- `effect-external-systems-only` — `useEffect` only for synchronizing with external systems
- `effect-no-derived-state` — Calculate during render or `useMemo`, never `useEffect`+`setState`
- `effect-no-data-fetching` — Always use TanStack Query (per stack-preferences)
- `effect-sync-external-store` — Always use `useSyncExternalStore` for external subscriptions

### 4. Data Fetching (HIGH)

- `data-tanstack-query-only` — All server state through TanStack Query, no `useEffect`+`useState` fetching
- `data-colocation` — Fetch where needed; TanStack Query deduplicates by queryKey

### 5. Composition & Props (MEDIUM)

- `composition-slots-over-compound` — Slot props over compound components; render props only when clearly needed
- `composition-children-type` — Type `children` as `React.ReactNode`
- `composition-controlled-default` — Controlled inputs by default (aligned with Mantine); TanStack Form manages its own state
- `composition-error-boundaries` — Route-level by default; feature-level based on UX needs
- `composition-fragments` — `<></>` for unkeyed, `<Fragment key={...}>` for keyed

### 6. Hooks (MEDIUM)

- `hook-custom-conventions` — `use` prefix, tuple for ≤2 returns, named object for 3+, single-purpose, no JSX returns
- `hook-memoize-sparingly` — `useMemo`, `useCallback`, `React.memo` only with measured evidence

### 7. Conditional Rendering (MEDIUM)

- `render-early-returns` — Early returns for null/error/loading states
- `render-no-nested-ternaries` — Never nest ternaries in JSX
- `render-conditional-patterns` — `&&` for boolean, ternary for either/or

### 8. File Organization (LOW)

- `file-type-directories` — Type-based directories (`components/`, `hooks/`, `utils/`)
- `file-naming` — PascalCase for component files, camelCase for non-components

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/component-function-over-class.md
rules/state-usereducer-nontrivial.md
rules/effect-external-systems-only.md
```

Each rule file contains:
- Impact level and description
- Incorrect code example
- Correct code example
- Cross-references to related rules

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`

## Deliberate Departures from TypeScript Best Practices

This skill deliberately differs from ferrousaurus-typescript-best-practices in two areas:

1. **File organization**: React projects use type-based directories (`components/`, `hooks/`, `utils/`) instead of flat-by-feature. React components, hooks, and utilities have different lifecycles and are found by different mental models.

2. **File naming**: React component files use PascalCase (matching their export name, e.g., `UserProfile.tsx`) instead of camelCase. Non-component files still follow camelCase.

## Companion Skills

- **ferrousaurus-stack-preferences** — Library choices (Zustand/Jotai, TanStack Query, Mantine, etc.) referenced in state management and data fetching rules
- **ferrousaurus-typescript-best-practices** — TypeScript syntax conventions (type over interface, arrow vs. declaration, const by default, etc.) that apply inside `.tsx` files as well