---
title: Never Use Explicit Return Type Annotations
impact: CRITICAL
impactDescription: Return types should be inferred or asserted with satisfies
tags: function, return-type, inference, satisfies
---

## Never Use Explicit Return Type Annotations

**Impact: CRITICAL (return types should be inferred or asserted with satisfies)**

Never write explicit return type annotations on functions. TypeScript can infer return types, and explicit annotations create maintenance burden without benefit — they can drift from the actual implementation and make refactoring harder.

If you need to assert a specific type (e.g., for narrowing or documentation), use `satisfies` on the expression body instead.

**Incorrect (explicit return type annotation):**

```typescript
const add = (a: number, b: number): number => a + b;

function saveToDatabase(record: Record): Promise<void> {
  return db.insert(record);
}
```

**Incorrect (type annotation on const):**

```typescript
const add: (a: number, b: number) => number = (a, b) => a + b;
```

**Correct (inferred return type):**

```typescript
const add = (a: number, b: number) => a + b;

async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```

**Correct (type assertion with satisfies when needed):**

```typescript
const add = (a: number, b: number) => (a + b) satisfies number;
```

Use `satisfies` only when you need the compiler to verify the expression matches a specific type without widening it. For the vast majority of functions, let TypeScript infer the return type.