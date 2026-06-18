---
title: Never Mutate Function Arguments
impact: CRITICAL
impactDescription: Prevents side-effect bugs and makes data flow predictable
tags: immutability, mutation, arguments, safety
---

## Never Mutate Function Arguments

**Impact: CRITICAL (prevents side-effect bugs and makes data flow predictable)**

Never mutate arguments passed to a function. This includes array methods that modify in-place (`.sort()`, `.splice()`, `.push()`), object property assignment, and any direct mutation. Always return new values instead.

**Incorrect (mutating arguments):**

```typescript
const sortUsers = (users: User[]) => {
  users.sort((a, b) => a.name.localeCompare(b.name));
  return users;
};

const updateName = (user: User, name: string) => {
  user.name = name;
  return user;
};
```

**Correct (returning new values):**

```typescript
const sortUsers = (users: readonly User[]) => users.toSorted((a, b) => a.name.localeCompare(b.name));

const updateName = (user: User, name: string): User => ({ ...user, name });
```

Mutation causes bugs that are hard to trace because the caller's data changes unexpectedly. Immutable patterns make data flow explicit and predictable.
