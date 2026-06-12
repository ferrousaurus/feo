---
title: const by Default, let Only When Reassigned, var Banned
impact: HIGH
impactDescription: Prevents accidental reassignment and signals intent
tags: immutability, const, let, var, declaration
---

## const by Default, let Only When Reassigned, var Banned

**Impact: HIGH (prevents accidental reassignment and signals intent)**

Always use `const` for variable declarations. Use `let` only when the variable is actually reassigned. Never use `var`. This makes intent clear: `const` means "this value won't change," and the rare `let` signals "this value changes."

**Incorrect (let when no reassignment):**

```typescript
let items = [1, 2, 3];
let config = { port: 3000 };
let result = processData(input);
```

**Incorrect (var anywhere):**

```typescript
var count = 0;
```

**Correct (const by default, let only for reassignment):**

```typescript
const items = [1, 2, 3];
const config = { port: 3000 };
const result = processData(input);

// let only when the variable is reassigned
let total = 0;
for (const item of items) {
  total += item.price;
}
```

In `for...of` and `for...in` loops, always use `const`:

```typescript
for (const item of items) {
  // ...
}
```

Using `const` by default catches accidental reassignment bugs at compile time and makes code easier to reason about.