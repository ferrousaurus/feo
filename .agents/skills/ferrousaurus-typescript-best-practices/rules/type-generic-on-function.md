---
title: Place Generics on Functions, Not Type Aliases
impact: MEDIUM
impactDescription: Keeps type inference working at call sites
tags: type, generics, function, inference
---

## Place Generics on Functions, Not Type Aliases

**Impact: MEDIUM (keeps type inference working at call sites)**

When a function's output type depends on its input type, place the generic type parameter on the function itself, not on a separate type alias. This allows TypeScript to infer the generic type at the call site without explicit annotation.

**Incorrect (generic on type alias, requires explicit annotation):**

```typescript
type Mapper<TInput, TOutput> = (items: TInput[], fn: (item: TInput) => TOutput) => TOutput[];
const map: Mapper<number, string> = (items, fn) => items.map(fn);
```

**Correct (generic on function, inferred at call site):**

```typescript
const mapItems = <TInput, TOutput>(
  items: TInput[],
  fn: (item: TInput) => TOutput,
) => items.map(fn);

// TypeScript infers TInput=number, TOutput=string automatically
const result = mapItems([1, 2, 3], (n) => `Item ${n}`);
```

Generic type parameters should use descriptive names: `TInput`, `TOutput`, `TKey`, `TValue` — not single letters like `T`, `U`, `V`.

```typescript
// Incorrect — single letter generics
const first = <T,>(items: T[]) => items[0];

// Correct — descriptive generic names
const first = <TItem,>(items: TItem[]) => items[0];
```