---
title: Use map/filter/reduce for Pure Iteration
impact: MEDIUM
impactDescription: Functional methods are more expressive and composable for pure transforms
tags: async, iteration, map, filter, reduce, pure
---

## Use map/filter/reduce for Pure Iteration

**Impact: MEDIUM (functional methods are more expressive and composable for pure transforms)**

When iterating over collections for data transformation (no side effects), use `map`, `filter`, `reduce`, `flatMap`, and other functional array methods. These methods are composable, declarative, and align with the purity convention — the resulting function is an arrow function.

**Incorrect (for...of for pure transformation):**

```typescript
const names: string[] = [];
for (const user of users) {
  names.push(user.name);
}

const active: User[] = [];
for (const user of users) {
  if (user.active) {
    active.push(user);
  }
}
```

**Correct (functional methods for pure transforms):**

```typescript
const names = users.map((user: User) => user.name);

const active = users.filter((user: User) => user.active);
```

**Correct (chaining for composed transforms):**

```typescript
const sortedActiveNames = users
  .filter((user: User) => user.active)
  .map((user: User) => user.name)
  .toSorted();
```

Use `for...of` only when:
- Iterating with side effects (see `async-iteration-side-effects`)
- Breaking early from a loop (no `break` in `forEach`)
- Sequential async operations that depend on previous results