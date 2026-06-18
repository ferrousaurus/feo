---
title: Pure Functions Use Arrow Syntax, Side Effects Use Function Declarations
impact: CRITICAL
impactDescription: Creates immediate visual distinction between pure and impure code
tags: function, pure, side-effect, arrow, declaration, convention
---

## Pure Functions Use Arrow Syntax, Side Effects Use Function Declarations

**Impact: CRITICAL (creates immediate visual distinction between pure and impure code)**

The syntax of a function declaration communicates its behavior. Arrow functions (`const fn = () => ...`) signal purity — no side effects, no I/O, deterministisch output for given input. Function declarations (`function fn() { ... }`) signal side effects — I/O, mutation, network calls, non-deterministic behavior.

A pure function:

- Returns the same output for the same inputs
- Has no side effects (no I/O, no mutation of external state)
- Is referentially transparent (can be replaced by its return value)

A side-effecting function:

- Performs I/O (network, filesystem, database)
- Mutates external state
- Has non-deterministic behavior (randomness, timestamps)
- Throws errors as part of its contract

**Incorrect (arrow function with side effects):**

```typescript
const saveToDatabase = async (record: Record) => {
  await db.insert(record);
};
```

**Incorrect (function declaration for pure logic):**

```typescript
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Correct (arrow for pure, declaration for side effects):**

```typescript
const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0);

async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```

Async functions follow the same rule. An async pure function (data transformation) uses arrow syntax; an async side-effecting function uses a declaration.

**Correct (async pure transformation — arrow):**

```typescript
const toUserDTO = async (user: User): Promise<UserDTO> => ({
  id: user.id,
  name: user.name,
});
```

**Correct (async side effect — declaration):**

```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

This convention creates an immediate visual signal. When you see `const fn = `, you know it's safe to call without side effects. When you see `function fn()`, you know to watch for side effects.
