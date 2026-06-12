---
title: Use Object Map for Simple Lookups
impact: MEDIUM
impactDescription: Object maps are more concise and performant than if/else chains for value mapping
tags: control, object-map, lookup, switch
---

## Use Object Map for Simple Lookups

**Impact: MEDIUM (object maps are more concise and performant than if/else chains for value mapping)**

When mapping a set of known keys to values (with no complex logic per branch), use an object map or `Record` type instead of `switch`, `if/else`, or ternaries. Object maps are O(1) lookups, more concise, and easier to extend.

**Incorrect (switch for simple value mapping):**

```typescript
switch (status) {
  case 'active':
    return 'green';
  case 'inactive':
    return 'red';
  case 'pending':
    return 'yellow';
  default:
    return 'gray';
}
```

**Correct (object map):**

```typescript
const STATUS_COLORS: Record<Status, string> = {
  active: 'green',
  inactive: 'red',
  pending: 'yellow',
};

const color = STATUS_COLORS[status] ?? 'gray';
```

Use object maps when:
- Each branch maps a key to a static value
- No complex logic per branch
- The key set is known and finite

Use `switch` with braces when:
- Each branch has complex logic (side effects, multiple statements)
- The mapping depends on more than a simple key