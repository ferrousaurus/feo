---
title: Use as const for Literals and Immutable Objects
impact: MEDIUM
impactDescription: Narrows types to literal values and prevents mutation
tags: type, as-const, immutable, literal
---

## Use as const for Literals and Immutable Objects

**Impact: MEDIUM (narrows types to literal values and prevents mutation)**

Use `as const` when you need TypeScript to infer the narrowest possible literal types from a value. This is essential for creating readonly tuples, literal union types, and immutable configuration objects.

**Incorrect (TypeScript widens to broad types):**

```typescript
const roles = ['admin', 'editor', 'viewer'];
// typeof roles = string[] — too wide

const config = { port: 3000, host: 'localhost' };
// typeof config = { port: number; host: string } — too wide
```

**Correct (as const narrows to literal types):**

```typescript
const roles = ['admin', 'editor', 'viewer'] as const;
// typeof roles = readonly ['admin', 'editor', 'viewer']

type Role = (typeof roles)[number];
// type Role = 'admin' | 'editor' | 'viewer'

const config = { port: 3000, host: 'localhost' } as const;
// typeof config = { readonly port: 3000; readonly host: 'localhost' }
```

Use `as const` for:
- Const arrays that serve as the source for derived union types
- Configuration objects that should be immutable
- Tuple types where order matters
- Any value where you need literal types instead of widened types

Do not use `as const` for simple variable assignments where the type is not used for derivation:

```typescript
// Unnecessary — the type is already correct
const name = 'Alice' as const;

// Necessary — the type needs to be narrow
const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = (typeof ROLES)[number];
```