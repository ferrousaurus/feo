---
title: Use satisfies Only for Type Checking Without Widening
impact: MEDIUM
impactDescription: Prefer as const for immutability; use satisfies to verify a type without widening
tags: type, satisfies, widening, type-checking
---

## Use satisfies Only for Type Checking Without Widening

**Impact: MEDIUM (prefer as const for immutability; use satisfies to verify a type without widening)**

`satisfies` is for type-checking a value against a broader type without widening the value's inferred type. Use it when you need to verify conformance while preserving the narrower inferred type. For immutability and literal types, prefer `as const`.

**Incorrect (using satisfies when you need immutability):**

```typescript
const config = { port: 3000, host: 'localhost' } satisfies Config;
// typeof config = { port: number; host: string } — widened, mutable
```

**Correct (as const for immutability and narrow types):**

```typescript
const config = { port: 3000, host: 'localhost' } as const;
// typeof config = { readonly port: 3000; readonly host: 'localhost' }
```

**Correct (satisfies for type-checking without widening):**

```typescript
type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
};

const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  accent: '#28a745',
} satisfies ThemeColors;
// typeof colors = { primary: '#007bff'; secondary: '#6c757d'; accent: '#28a745' }
// Narrow types preserved, but verified against ThemeColors
```

`satisfies` catches errors (missing keys, wrong types) while keeping the value's precise type. Use it for configuration validation and type-checking. Use `as const` when you need readonly and literal types.