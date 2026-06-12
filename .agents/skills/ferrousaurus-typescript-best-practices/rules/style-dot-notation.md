---
title: Use Dot Notation for Property Access
impact: LOW
impactDescription: Dot notation is more readable and type-safe
tags: style, property, dot, bracket, access
---

## Use Dot Notation for Property Access

**Impact: LOW (dot notation is more readable and type-safe)**

Always use dot notation (`obj.property`) to access object properties when the property name is a valid identifier. Only use bracket notation (`obj['property']`) for dynamic property access.

**Incorrect (bracket notation for known properties):**

```typescript
const name = user[`name`];
const email = user[`email`];
```

**Correct (dot notation):**

```typescript
const name = user.name;
const email = user.email;
```

Use bracket notation only for dynamic access:

```typescript
const field = `name`;
const value = user[field];
```

Dot notation is:
- More readable and concise
- Type-checked by TypeScript (bracket access with string literals can fall through)
- Easier for IDEs to provide autocomplete and refactoring support