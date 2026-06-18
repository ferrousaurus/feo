---
title: Leading Dot on New Line for Method Chaining
impact: MEDIUM
impactDescription: Cleaner diffs and easier reading for chained calls
tags: style, method, chaining, formatting
---

## Leading Dot on New Line for Method Chaining

**Impact: MEDIUM (cleaner diffs and easier reading for chained calls)**

When chaining method calls across multiple lines, place the dot at the beginning of the next line, not at the end of the previous line. This makes the chain visually clear and produces cleaner git diffs.

**Incorrect (trailing dot):**

```typescript
const result = items
  .filter((item: Item) => item.active)
  .map((item: Item) => item.name)
  .toSorted();
```

**Correct (leading dot on new line):**

```typescript
const result = items
  .filter((item: Item) => item.active)
  .map((item: Item) => item.name)
  .toSorted();
```

Leading dots make it immediately clear that a line is a continuation of a chain, and adding or removing a step only changes one line.
