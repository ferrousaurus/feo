---
title: Inline Exports on Declarations
impact: MEDIUM
impactDescription: Exports are visible at the declaration, not hidden at the file bottom
tags: module, export, inline, organization
---

## Inline Exports on Declarations

**Impact: MEDIUM (exports are visible at the declaration, not hidden at the file bottom)**

Place `export` directly on the declaration. Don't use bottom-of-file export blocks, which force readers to scroll to see what's exported and can drift out of sync with the implementation.

**Incorrect (bottom-of-file exports):**

```typescript
const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;

export { add, subtract };
```

**Correct (inline exports):**

```typescript
export const add = (a: number, b: number) => a + b;
export const subtract = (a: number, b: number) => a - b;
```

This also applies to function declarations:

```typescript
export async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```

And to type exports:

```typescript
export type User = {
  name: string;
  email: string;
};
```