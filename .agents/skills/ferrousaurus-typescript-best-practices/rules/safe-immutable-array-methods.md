---
title: Use Immutable Array Methods
impact: HIGH
impactDescription: Prevents accidental mutation of arrays in React and functional code
tags: immutability, array, toSorted, toReversed, toSpliced
---

## Use Immutable Array Methods

**Impact: HIGH (prevents accidental mutation of arrays in React and functional code)**

Always use the immutable versions of array methods: `toSorted()` instead of `sort()`, `toReversed()` instead of `reverse()`, `toSpliced()` instead of `splice()`, and `with()` instead of bracket assignment. These methods return new arrays instead of mutating the original.

**Incorrect (mutating array methods):**

```typescript
items.sort((a, b) => a.name.localeCompare(b.name));
items.reverse();
items.splice(2, 1);
items[0] = newItem;
```

**Correct (immutable array methods):**

```typescript
const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name));
const reversed = items.toReversed();
const spliced = items.toSpliced(2, 1);
const updated = items.with(0, newItem);
```

These methods are available in all modern environments (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). For older environments, use spread:

```typescript
const sorted = [...items].sort(compareFn);
```

Mutation is especially dangerous in React and functional code where data is expected to be treated as read-only. Using immutable methods eliminates an entire class of bugs.