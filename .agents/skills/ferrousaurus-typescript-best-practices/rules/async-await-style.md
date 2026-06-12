---
title: Use async/await Over .then() Chains
impact: MEDIUM
impactDescription: Async/await is more readable and easier to debug than promise chains
tags: async, await, promise, then, style
---

## Use async/await Over .then() Chains

**Impact: MEDIUM (async/await is more readable and easier to debug than promise chains)**

Always use `async/await` syntax instead of `.then()` chains for asynchronous code. Async/await produces linear, easy-to-read code that follows the same control flow pattern as synchronous code.

**Incorrect (promise chain):**

```typescript
function fetchUserData(id: string) {
  return fetchUser(id)
    .then((user) => fetchProfile(user.id))
    .then((profile) => ({ user, profile }));
}
```

**Correct (async/await):**

```typescript
async function fetchUserData(id: string) {
  const user = await fetchUser(id);
  const profile = await fetchProfile(user.id);
  return { user, profile };
}
```

Async/await benefits:
- Linear control flow — reads top to bottom
- `try/catch` or `.catch()` for error handling (see `async-catch-over-trycatch`)
- Easier to set breakpoints and debug
- Works naturally with `for...of` for sequential async iteration
- Consistent with the side-effecting function declaration convention