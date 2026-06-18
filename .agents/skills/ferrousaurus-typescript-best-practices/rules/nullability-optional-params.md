---
title: Use ? for Optional Parameters, Not | undefined
impact: MEDIUM
impactDescription: Cleaner signatures and consistent optional parameter style
tags: nullability, optional, parameters, undefined
---

## Use ? for Optional Parameters, Not | undefined

**Impact: MEDIUM (cleaner signatures and consistent optional parameter style)**

When a parameter is optional, use the `?` modifier instead of making the type a union with `undefined`. The `?` syntax is more concise and clearly signals "this parameter can be omitted."

**Incorrect (explicit undefined union):**

```typescript
function greet(name: string, title: string | undefined) {
  // ...
}

const add = (a: number, b: number, offset: number | undefined) => (offset ? a + b + offset : a + b);
```

**Correct (optional parameter with ?):**

```typescript
function greet(name: string, title?: string) {
  // ...
}

const add = (a: number, b: number, offset?: number) => (offset ? a + b + offset : a + b);
```

The `?` syntax is equivalent to `| undefined` in the parameter type, but it's more readable and makes the intent explicit: the parameter is meant to be omitted, not passed as `undefined`.
