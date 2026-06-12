---
title: Always Use Early Returns, Avoid Deep Nesting
impact: HIGH
impactDescription: Flat control flow is easier to read and reason about
tags: control, early-return, nesting, guard
---

## Always Use Early Returns, Avoid Deep Nesting

**Impact: HIGH (flat control flow is easier to read and reason about)**

Return early when conditions fail. This flattens code, reduces nesting, and makes the "happy path" immediately visible. Never write deeply nested conditionals — guard clauses first, then the main logic.

**Incorrect (deeply nested conditionals):**

```typescript
function process(user: User) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        return transform(user);
      }
      return null;
    }
    return null;
  }
  return null;
}
```

**Correct (early returns, flat structure):**

```typescript
const process = (user: User | undefined) => {
  if (!user) return undefined;
  if (!user.active) return undefined;
  if (!user.verified) return undefined;

  return transform(user);
};
```

Early returns follow the "fail fast" principle. Each guard clause says "here's why we can't proceed." After all guards, the remaining code is the happy path with zero nesting.