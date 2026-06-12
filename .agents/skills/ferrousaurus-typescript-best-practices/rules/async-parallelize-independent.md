---
title: Always Parallelize Independent Async Operations
impact: HIGH
impactDescription: Sequential awaits for independent operations wastes time
tags: async, parallel, promise-all, waterfall
---

## Always Parallelize Independent Async Operations

**Impact: HIGH (sequential awaits for independent operations wastes time)**

When multiple async operations have no dependencies on each other, run them in parallel using `Promise.all()`. Sequential `await` calls for independent operations create unnecessary waterfalls.

**Incorrect (sequential independent operations):**

```typescript
async function loadData(userId: string) {
  const user = await fetchUser(userId);
  const config = await fetchConfig();
  const permissions = await fetchPermissions(userId);
  return { user, config, permissions };
}
```

**Correct (parallel independent operations):**

```typescript
async function loadData(userId: string) {
  const [user, config, permissions] = await Promise.all([
    fetchUser(userId),
    fetchConfig(),
    fetchPermissions(userId),
  ]);
  return { user, config, permissions };
}
```

Only use sequential `await` when an operation depends on the result of the previous one:

```typescript
async function loadUserProfile(userId: string) {
  const user = await fetchUser(userId);
  const profile = await fetchProfile(user.id); // depends on user.id
  return { user, profile };
}
```