---
title: Use Optional Chaining Wherever Nullable
impact: MEDIUM
impactDescription: Concise and safe property access on nullable values
tags: nullability, optional-chaining, null-safety
---

## Use Optional Chaining Wherever Nullable

**Impact: MEDIUM (concise and safe property access on nullable values)**

Use `?.` (optional chaining) whenever accessing a property on a value that might be `null` or `undefined`. This is more concise and safer than explicit null checks.

**Incorrect (explicit null checks):**

```typescript
if (user && user.address && user.address.city) {
  return user.address.city;
}
return "Unknown";
```

**Correct (optional chaining):**

```typescript
return user?.address?.city ?? "Unknown";
```

**Incorrect (manual array access check):**

```typescript
if (items && items.length > 0 && items[0] && items[0].name) {
  return items[0].name;
}
return undefined;
```

**Correct (optional chaining):**

```typescript
return items?.[0]?.name;
```

Optional chaining is appropriate for any property access where the parent might be nullish. It's clear, concise, and eliminates nested `if` blocks.
