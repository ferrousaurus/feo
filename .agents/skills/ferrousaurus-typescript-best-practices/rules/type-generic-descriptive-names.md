---
title: Use Descriptive Generic Names (TInput, Not T)
impact: MEDIUM
impactDescription: Self-documenting generics improve readability
tags: type, generics, naming, convention
---

## Use Descriptive Generic Names (TInput, Not T)

**Impact: MEDIUM (self-documenting generics improve readability)**

Generic type parameters should use descriptive names prefixed with `T`: `TInput`, `TOutput`, `TKey`, `TValue`. Never use single letters like `T`, `U`, `V` or `A`, `B`, `C`.

**Incorrect (single-letter generics):**

```typescript
const mapItems = <A, B>(items: A[], fn: (item: A) => B) => items.map(fn);

const first = <T>(items: T[]) => items[0];
```

**Correct (descriptive generic names):**

```typescript
const mapItems = <TInput, TOutput>(items: TInput[], fn: (item: TInput) => TOutput) => items.map(fn);

const first = <TItem>(items: TItem[]) => items[0];
```

Descriptive names make it immediately clear what role each generic plays in the function's contract, especially in functions with multiple type parameters.
