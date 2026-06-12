---
title: Use .catch() Over try/catch
impact: MEDIUM
impactDescription: .catch() is more concise and avoids nested blocks
tags: async, error, catch, try, handling
---

## Use .catch() Over try/catch

**Impact: MEDIUM (.catch() is more concise and avoids nested blocks)**

When handling errors in async code, prefer `.catch()` over `try/catch`. `.catch()` keeps the happy path flat and avoids a level of nesting.

**Incorrect (try/catch wrapping async call):**

```typescript
try {
  const user = await fetchUser(id);
  return user;
} catch (error: Error) {
  logError(error);
  return undefined;
}
```

**Correct (.catch() on the promise):**

```typescript
const user = await fetchUser(id).catch((error: Error) => {
  logError(error);
  return undefined;
});
```

Prefer `.catch()` when you're handling a single async operation's error and returning a fallback value. Use `try/catch` only when multiple sequential operations need to be wrapped in a single error handler.

```typescript
// try/catch is acceptable when multiple operations share error handling
try {
  const user = await fetchUser(id);
  const profile = await fetchProfile(user.id);
  return { user, profile };
} catch (error: Error) {
  logError(error);
  return undefined;
}
```