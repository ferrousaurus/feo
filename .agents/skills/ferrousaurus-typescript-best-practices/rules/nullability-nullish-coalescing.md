---
title: Use Nullish Coalescing (??) Instead of Logical OR (||)
impact: MEDIUM
impactDescription: Prevents falsy value bugs with 0, empty string, and false
tags: nullability, nullish-coalescing, logical-or, defaults
---

## Use Nullish Coalescing (??) Instead of Logical OR (||)

**Impact: MEDIUM (prevents falsy value bugs with 0, empty string, and false)**

Always use `??` (nullish coalescing) for default values, not `||` (logical OR). The `||` operator treats `0`, `""`, and `false` as falsy and falls back to the default, which is almost always a bug. `??` only falls back for `null` and `undefined`.

**Incorrect (logical OR treats 0 and '' as falsy):**

```typescript
const count = items.length || 10;
const name = user.name || "Unknown";
const isEnabled = config.enabled || false;
```

When `items.length` is `0`, `user.name` is `""`, or `config.enabled` is `false`, `||` incorrectly falls back to the default.

**Correct (nullish coalescing only falls back for null/undefined):**

```typescript
const count = items.length ?? 10;
const name = user.name ?? "Unknown";
const isEnabled = config.enabled ?? false;
```

`??` only replaces the value when it's `null` or `undefined`, preserving legitimate falsy values like `0`, `""`, and `false`.
