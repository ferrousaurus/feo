---
title: Use Rest Parameters and Object Spread
impact: MEDIUM
impactDescription: Rest params and spread are more type-safe than alternatives
tags: style, rest, spread, parameters, merge
---

## Use Rest Parameters and Object Spread

**Impact: MEDIUM (rest params and spread are more type-safe than alternatives)**

Use rest parameters for variadic functions instead of array arguments. Use object spread for merging objects instead of `Object.assign`.

**Rest parameters (not array argument):**

```typescript
// Incorrect — caller must wrap in array
const log = (messages: string[]) => { ... };
log([`hello`, `world`]);

// Correct — caller passes directly
const log = (...messages: string[]) => { ... };
log(`hello`, `world`);
```

**Object spread (not Object.assign):**

```typescript
// Incorrect — Object.assign mutates the target
const updated = Object.assign({}, user, { name: `New` });

// Correct — spread creates a new object
const updated = { ...user, name: `New` };
```

Object spread:
- Always returns a new object (immutable)
- Is more readable and concise
- Has clearer TypeScript inference
- Doesn't have `Object.assign`'s mutation pitfalls