---
title: Inline Callbacks When No Braces Needed
impact: LOW
impactDescription: Keeps code concise for simple expressions
tags: function, callback, inline, style
---

## Inline Callbacks When No Braces Needed

**Impact: LOW (keeps code concise for simple expressions)**

When a callback is pure and simple enough that it doesn't need braces (implicit return), pass it inline rather than extracting to a named variable. This reduces indentation and keeps the intent local.

**Incorrect (extracting trivial pure callbacks):**

```typescript
const isActive = (item: Item) => item.active;
items.filter(isActive);
```

**Correct (inline when no braces needed):**

```typescript
items.filter((item: Item) => item.active);
```

**Correct (extract when braces are needed or logic is complex):**

```typescript
const calculateDiscount = (order: Order) =>
  order.items.reduce((sum: number, item: Item) => sum + item.price, 0) * 0.1;

const discountedTotal = orders.map(calculateDiscount);
```

The rule: inline when the callback is a single expression. Extract when it needs multiple statements or would reduce readability.