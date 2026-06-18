# TypeScript Best Practices

A structured repository for creating and maintaining TypeScript writing conventions optimized for agents and LLMs.

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
   - `function-` for Function Declarations (Section 1)
   - `type-` for Type System (Section 2)
   - `safe-` for Immutability & Safety (Section 3)
   - `nullability-` for Null & Optionality (Section 4)
   - `control-` for Control Flow (Section 5)
   - `async-` for Async Patterns (Section 6)
   - `module-` for Module Organization (Section 7)
   - `style-` for Style & Naming (Section 8)
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
tags: tag1, tag2, tag3
---

## Rule Title Here

Brief explanation of the rule and why it matters.

**Incorrect (description of what's wrong):**

\```typescript
// Bad code example
\```

**Correct (description of what's right):**

\```typescript
// Good code example
\```
````

## File Naming Convention

- Files starting with `_` are special (excluded from build)
- Rule files: `area-description.md` (e.g., `function-pure-arrow.md`)
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

The central convention: **pure functions use arrow syntax, side-effecting functions use `function` declarations.** This single visual signal makes code intent clear at a glance and shapes every other decision.
