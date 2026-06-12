---
title: No Swap Destructuring
impact: LOW
impactDescription: Destructuring swaps sacrifice readability for cleverness
tags: style, destructuring, swap, assignment
---

## No Swap Destructuring

**Impact: LOW (destructuring swaps sacrifice readability for cleverness)**

Don't use array destructuring to swap variables. It's a clever trick that obscures intent. Use a temporary variable instead — it's explicit and obvious.

**Incorrect (swap destructuring):**

```typescript
let a = 1;
let b = 2;
[a, b] = [b, a];
```

**Correct (temporary variable):**

```typescript
let a = 1;
let b = 2;
const temp = a;
a = b;
b = temp;
```

The temporary variable approach:
- Is immediately obvious to any reader
- Doesn't require understanding destructuring assignment
- Works in all languages (not a JS-specific trick)
- Is explicit about what's happening