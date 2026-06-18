---
title: Destructure in Function Parameters
impact: LOW
impactDescription: Concise and clear parameter access
tags: style, destructuring, parameters, function
---

## Destructure in Function Parameters

**Impact: LOW (concise and clear parameter access)**

When a function receives an object, destructure its properties directly in the parameter list. This makes the function's contract explicit — you can see exactly which properties it uses without reading the function body.

**Incorrect (accessing properties via dot notation):**

```typescript
const formatName = (user: User) => `${user.first} ${user.last}`;

function saveToDatabase(params: SaveParams) {
  await db.insert({ name: params.name, email: params.email });
}
```

**Correct (destructuring in parameters):**

```typescript
const formatName = ({ first, last }: User) => `${first} ${last}`;

function saveToDatabase({ name, email }: SaveParams) {
  await db.insert({ name, email });
}
```

Destructuring in parameters:

- Makes required properties visible in the signature
- Eliminates the `user.` prefix throughout the function body
- Works naturally with the option object pattern (see `function-option-object-pattern`)
