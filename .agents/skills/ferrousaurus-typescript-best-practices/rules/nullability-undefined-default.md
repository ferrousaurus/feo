---
title: Use undefined as Default for No Value
impact: MEDIUM
impactDescription: Consistent representation of absence across the codebase
tags: nullability, undefined, null, absence
---

## Use undefined as Default for No Value

**Impact: MEDIUM (consistent representation of absence across the codebase)**

Use `undefined` as the default way to represent "no value" or "not yet set." Reserve `null` for when something "explicitly does not exist" — a semantic distinction that signals intent. `undefined` integrates naturally with optional parameters and object properties, making it the better default.

**Incorrect (null for missing values):**

```typescript
function findUser(id: string): User | null {
  // ...
}

function greet(name?: string | null) {
  // ...
}
```

**Correct (undefined for missing, null for explicitly empty):**

```typescript
// undefined = "does not exist yet" (most common)
function findUser(id: string): User | undefined {
  // ...
}

// null = "explicitly does not exist" (rare, intentional)
type ConnectionState = "connecting" | "connected" | "disconnected" | null;
// null here means "explicitly no connection", not "connection unknown"
```

`undefined` is the natural choice because:

- Optional parameters default to `undefined`
- Missing object properties are `undefined`
- `??` (nullish coalescing) treats both `null` and `undefined`, so it works either way
- TypeScript's `?` syntax produces `undefined`, not `null`
