---
title: Use for...of for Side-Effecting Iteration
impact: MEDIUM
impactDescription: for...of makes side effects explicit and allows break/continue
tags: async, iteration, for-of, side-effects, loop
---

## Use for...of for Side-Effecting Iteration

**Impact: MEDIUM (for...of makes side effects explicit and allows break/continue)**

When iteration involves side effects (I/O, mutations, logging, database writes), use `for...of` instead of `forEach` or `map`. `for...of` makes the side effect explicit (this is not a pure transform), supports `break`/`continue`, and works naturally with `await`.

**Incorrect (forEach with side effects):**

```typescript
users.forEach((user: User) => {
  saveToDatabase(user);
});
```

**Incorrect (map with side effects — ignores return value):**

```typescript
users.map((user: User) => {
  sendEmail(user.email, 'Welcome');
  return user;
});
```

**Correct (for...of for side-effecting iteration):**

```typescript
for (const user of users) {
  saveToDatabase(user);
}
```

**Correct (for...of with async side effects):**

```typescript
for (const user of users) {
  await sendEmail(user.email, 'Welcome');
}
```

For parallel async side effects, use `Promise.allSettled` (see `async-promise-all-settled`).

The function declaration convention makes this even clearer: a `for...of` loop inside a `function` declaration signals "this code has side effects."