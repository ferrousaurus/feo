---
title: Use Promise.allSettled for Parallel Side Effects
impact: MEDIUM
impactDescription: Prevents partial failures from killing the entire batch
tags: async, promise, allSettled, parallel, side-effects
---

## Use Promise.allSettled for Parallel Side Effects

**Impact: MEDIUM (prevents partial failures from killing the entire batch)**

When running multiple side-effecting async operations in parallel (logging, analytics, writes), use `Promise.allSettled()` instead of `Promise.all()`. `Promise.all()` rejects on the first failure, which can abort remaining operations that should still complete.

**Incorrect (Promise.all aborts on first failure):**

```typescript
await Promise.all([
  sendEmail(user.email, 'Welcome'),
  logEvent('user_created', { userId: user.id }),
  updateSearchIndex(user.id),
]);
// If sendEmail fails, logEvent and updateSearchIndex are never awaited
```

**Correct (Promise.allSettled runs all to completion):**

```typescript
const results = await Promise.allSettled([
  sendEmail(user.email, 'Welcome'),
  logEvent('user_created', { userId: user.id }),
  updateSearchIndex(user.id),
]);

for (const result of results) {
  if (result.status === 'rejected') {
    logError(result.reason);
  }
}
```

Use `Promise.all()` when:
- All operations are pure data fetches
- A single failure means the whole batch is invalid
- You want to fail fast

Use `Promise.allSettled()` when:
- Operations are independent side effects
- Each should complete regardless of others
- You need to collect all results, including failures
- You'll handle errors individually