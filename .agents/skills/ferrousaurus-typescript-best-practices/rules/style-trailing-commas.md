---
title: Always Use Trailing Commas
impact: LOW
impactDescription: Cleaner diffs and easier reordering
tags: style, trailing-comma, formatting, diff
---

## Always Use Trailing Commas

**Impact: LOW (cleaner diffs and easier reordering)**

Always include trailing commas in multiline structures: arrays, objects, function parameters, and type definitions. Trailing commas make git diffs cleaner (single-line changes don't affect surrounding lines) and make reordering items easier.

**Incorrect (no trailing commas):**

```typescript
const user = {
  name: `Alice`,
  email: `alice@example.com`
};

const items = [
  `first`,
  `second`
];

const add = (
  a: number,
  b: number
) => a + b;
```

**Correct (trailing commas everywhere):**

```typescript
const user = {
  name: `Alice`,
  email: `alice@example.com`,
};

const items = [
  `first`,
  `second`,
];

const add = (
  a: number,
  b: number,
) => a + b;
```

This applies to:
- Array literals
- Object literals
- Function parameter lists
- Type definitions
- Import/export lists
- Destructuring patterns