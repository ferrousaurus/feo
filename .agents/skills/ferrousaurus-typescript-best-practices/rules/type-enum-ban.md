---
title: Never Use TypeScript enum
impact: HIGH
impactDescription: Avoids runtime bloat and non-standard semantics
tags: type, enum, union, const
---

## Never Use TypeScript enum

**Impact: HIGH (avoids runtime bloat and non-standard semantics)**

Never use TypeScript `enum`. Enums generate unnecessary runtime code, have surprising semantics (reverse mapping for numeric enums), and don't align with TypeScript's type-first philosophy. Use union types for simple cases and const arrays with derived types when you need both the values and the type.

**Incorrect (enum):**

```typescript
enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
}
```

**Correct (union type for simple cases):**

```typescript
type Status = "active" | "inactive" | "pending";
```

**Correct (const array + derived type when you need both values and type):**

```typescript
const STATUSES = ["active", "inactive", "pending"] as const;
type Status = (typeof STATUSES)[number];
```

The const array pattern gives you:

- Runtime iteration: `STATUSES.forEach(...)`
- Type safety: `Status` is `'active' | 'inactive' | 'pending'`
- Lookup: `STATUSES.includes(value)`
- No generated JavaScript code for the type
