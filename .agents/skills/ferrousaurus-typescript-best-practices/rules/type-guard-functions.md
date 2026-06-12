---
title: Use User-Defined Type Predicates for Narrowing
impact: HIGH
impactDescription: Safe narrowing without type assertions
tags: type, guard, predicate, narrowing, safety
---

## Use User-Defined Type Predicates for Narrowing

**Impact: HIGH (safe narrowing without type assertions)**

When TypeScript can't narrow a type automatically (e.g., from `unknown` to `User`), use user-defined type predicates (`value is Type`) instead of type assertions. Type predicates express the narrowing logic in a runtime-checkable way that TypeScript can verify.

**Incorrect (type assertion for narrowing):**

```typescript
const user = data as User;
```

**Correct (type guard function with predicate):**

```typescript
const isUser = (value: unknown): value is User =>
  typeof value === 'object' &&
  value !== null &&
  'name' in value &&
  'email' in value;

if (isUser(data)) {
  // data is now narrowed to User
  console.log(data.name);
}
```

**Common type guards:**

```typescript
const isString = (value: unknown): value is string =>
  typeof value === 'string';

const isNonNullable = <T,>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined;

const hasProperty = <K extends string>(
  value: unknown,
  key: K,
): value is Record<K, unknown> =>
  typeof value === 'object' && value !== null && key in value;
```

For complex validation at API boundaries, use a runtime validation library (Zod, valibot) instead of manual type guards. Type guards are appropriate for narrowing within your application where the runtime check is simple.