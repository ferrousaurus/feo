# React Best Practices

A structured repository for creating and maintaining React writing conventions optimized for agents and LLMs.

## Structure

- `rules/` - Individual rule files (one per rule)
  - `_sections.md` - Section metadata (titles, impacts, descriptions)
  - `_template.md` - Template for creating new rules
  - `area-description.md` - Individual rule files
- `metadata.json` - Document metadata (version, organization, abstract)
- **`AGENTS.md`** - Compiled output with all rules expanded
- `SKILL.md` - Skill definition for OpenCode integration

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/area-description.md`
2. Choose the appropriate area prefix:
   - `component-` for Component Definition (Section 1)
   - `state-` for State Management (Section 2)
   - `effect-` for Effects & Lifecycle (Section 3)
   - `data-` for Data Fetching (Section 4)
   - `composition-` for Composition & Props (Section 5)
   - `hook-` for Hooks (Section 6)
   - `render-` for Conditional Rendering (Section 7)
   - `file-` for File Organization (Section 8)
3. Fill in the frontmatter and content
4. Ensure you have clear examples with explanations
5. Update `SKILL.md` and `AGENTS.md` to include the new rule

## Rule File Structure

Each rule file should follow this structure:

````markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description
tags: react, tag2, tag3
---

## Rule Title Here

**Impact: MEDIUM (optional impact description)**

Brief explanation of the rule and why it matters.

**Incorrect (description of what's wrong):**

\```tsx
// Bad code example
\```

**Correct (description of what's right):**

\```tsx
// Good code example
\```
````

## File Naming Convention

- Files starting with `_` are special (excluded from build)
- Rule files: `area-description.md` (e.g., `component-arrow-vs-declaration.md`)
- Section is automatically inferred from filename prefix
- Rules are sorted alphabetically by title within each section

## Impact Levels

- `CRITICAL` - Highest priority, core conventions
- `HIGH` - Significant impact on correctness and readability
- `MEDIUM-HIGH` - Moderate-high gains
- `MEDIUM` - Moderate improvements
- `LOW-MEDIUM` - Low-medium gains
- `LOW` - Incremental improvements, formatting consistency

## Core Principle

The central convention: **`useEffect` only for synchronizing with external systems** — everything else has a better alternative. Combined with function components, useReducer for non-trivial state, TanStack Query for all server state, and slot-based composition, these rules eliminate the most common React anti-patterns.

## Deliberate Departures from TypeScript Best Practices

This skill deliberately differs from ferrousaurus-typescript-best-practices in two areas:

1. **File organization**: React projects use type-based directories (`components/`, `hooks/`, `utils/`) instead of flat-by-feature.
2. **File naming**: React component files use PascalCase (matching their export name) instead of camelCase.

## Companion Skills

- **ferrousaurus-stack-preferences** — Library choices referenced in state management and data fetching rules
- **ferrousaurus-typescript-best-practices** — TypeScript syntax conventions that apply inside `.tsx` files
