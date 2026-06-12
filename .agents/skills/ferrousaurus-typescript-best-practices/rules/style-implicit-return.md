---
title: No Braces for Simple Arrow Function Bodies
impact: LOW
impactDescription: Concise and readable for single-expression functions
tags: style, arrow, implicit, return, braces
---

## No Braces for Simple Arrow Function Bodies

**Impact: LOW (concise and readable for single-expression functions)**

For arrow functions that contain a single expression, use implicit return (no braces, no `return` keyword). When the function needs multiple statements, use braces with explicit `return`.

**Incorrect (unnecessary braces for single expression):**

```typescript
const add = (a: number, b: number) => {
  return a + b;
};

const getName = (user: User) => {
  return user.name;
};
```

**Correct (implicit return for single expressions):**

```typescript
const add = (a: number, b: number) => a + b;
const getName = (user: User) => user.name;
```

**Correct (braces for multi-statement bodies):**

```typescript
const processOrder = (order: Order) => {
  const total = calculateTotal(order);
  const validated = validateOrder(order);
  return submitOrder(validated, total);
};
```

For multi-line expressions, start the expression on the same line as `=>`:

```typescript
const result = (items: Item[]) => items
  .filter((item: Item) => item.active)
  .map((item: Item) => item.name)
  .toSorted();
```