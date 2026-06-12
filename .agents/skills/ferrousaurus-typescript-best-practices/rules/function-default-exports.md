---
title: Default Exports Follow Function Convention
impact: MEDIUM
impactDescription: Consistent export style ensures pure/side-effect distinction is visible at export
tags: function, export, default, convention
---

## Default Exports Follow Function Convention

**Impact: MEDIUM (consistent export style ensures pure/side-effect distinction is visible at export)**

Default exports follow the same pure/side-effect convention. A pure function uses `const` with arrow syntax and is exported separately. A side-effecting function uses a `function` declaration exported directly.

**Incorrect (arrow function as default for side-effecting code):**

```typescript
export default async (id: string) => {
  await db.delete(id);
};
```

**Incorrect (function declaration for pure logic as default):**

```typescript
export default function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Correct (side-effecting — function declaration):**

```typescript
export default async function deleteUser(id: string) {
  await db.delete(id);
}
```

**Correct (pure — const arrow exported as default):**

```typescript
const calculateTotal = (items: Item[]) =>
  items.reduce((sum, item) => sum + item.price, 0);

export default calculateTotal;
```

Named exports use inline `export` on the declaration, following the same convention:

```typescript
export const add = (a: number, b: number) => a + b;

export async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```