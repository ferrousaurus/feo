---
title: Use const in for...of Loops
impact: LOW
impactDescription: Signals that the loop variable is not reassigned
tags: immutability, for-of, const, loop
---

## Use const in for...of Loops

**Impact: LOW (signals that the loop variable is not reassigned)**

Always use `const` in `for...of` and `for...in` loops. The loop variable is a new binding for each iteration, so `const` is correct and signals that the variable won't be reassigned within the loop body.

**Incorrect (let in for...of):**

```typescript
for (let item of items) {
  console.log(item.name);
}
```

**Correct (const in for...of):**

```typescript
for (const item of items) {
  console.log(item.name);
}
```

This follows the same principle as `const` by default: if you don't reassign, use `const`.
