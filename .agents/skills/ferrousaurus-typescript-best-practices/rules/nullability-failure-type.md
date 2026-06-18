---
title: Use T | undefined to Signal Failure
impact: MEDIUM
impactDescription: Consistent failure signaling without exceptions
tags: nullability, undefined, failure, option
---

## Use T | undefined to Signal Failure

**Impact: MEDIUM (consistent failure signaling without exceptions)**

When a function can fail to produce a value (not found, invalid input, etc.), return `T | undefined` rather than throwing an exception. Throw exceptions only for truly exceptional conditions. This makes failure a visible part of the type signature and forces callers to handle it.

**Incorrect (throwing for expected failures):**

```typescript
function findUser(id: string): User {
  const user = db.find(id);
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }
  return user;
}
```

**Correct (returning undefined for expected "not found"):**

```typescript
const findUser = (id: string): User | undefined => db.find(id);
```

**When to throw vs return undefined:**

Return `T | undefined` when:

- The function is a lookup/query that may not find a result
- The failure is an expected, normal outcome
- The caller should decide how to handle the absence

Throw an exception when:

- The failure is truly exceptional and unexpected
- The function is performing a mutation that failed
- The failure should bubble up and be caught at a boundary

```typescript
// Return undefined — "not found" is normal
const findUser = (id: string): User | undefined => db.find(id);

// Throw — "already exists" is exceptional
async function createUser(data: CreateUserDTO): Promise<User> {
  const existing = findUser(data.email);
  if (existing) {
    throw new ConflictError(`User ${data.email} already exists`);
  }
  return db.insert(data);
}
```
