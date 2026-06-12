---
title: Parenthesize Implicit Object Returns
impact: MEDIUM
impactDescription: Prevents ASI bugs and makes intent clear
tags: style, arrow, return, object, parenthesize
---

## Parenthesize Implicit Object Returns

**Impact: MEDIUM (prevents ASI bugs and makes intent clear)**

When an arrow function implicitly returns an object literal, wrap the object in parentheses. This prevents TypeScript from interpreting the braces as a function body rather than an object literal.

**Incorrect (unparenthesized — parsed as function body):**

```typescript
const toDTO = (user: User) => { name: user.name, email: user.email };
// Returns undefined — braces treated as function body
```

**Correct (parenthesized):**

```typescript
const toDTO = (user: User) => ({
  name: user.name,
  email: user.email,
});
```

The parentheses make it unambiguous: the arrow function returns the object, rather than containing a block with a labeled statement. This is one of the most common TypeScript pitfalls for developers transitioning from JavaScript.