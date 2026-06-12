---
title: Const Array with Derived Type for Fixed Value Sets
impact: MEDIUM
impactDescription: Provides both runtime values and type safety without enums
tags: type, enum, const, union, values
---

## Const Array with Derived Type for Fixed Value Sets

**Impact: MEDIUM (provides both runtime values and type safety without enums)**

When you need both the runtime values (for iteration, lookup, mapping) and the type (for type checking), use a `const` array with a derived type. Never use enums.

**Incorrect (enum for iteration and typing):**

```typescript
enum Role {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

// Need runtime iteration
const roles = Object.values(Role);
```

**Incorrect (duplicated values and type):**

```typescript
const roles = ['admin', 'editor', 'viewer'];
type Role = 'admin' | 'editor' | 'viewer';
```

**Correct (const array + derived type, single source of truth):**

```typescript
const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = (typeof ROLES)[number];

// Runtime iteration
ROLES.forEach((role) => {
  console.log(role);
});

// Type checking
const hasRole = (value: string): value is Role =>
  ROLES.includes(value as Role);
```

This pattern keeps values and types in sync automatically. Add a value to `ROLES` and the `Role` type updates immediately.