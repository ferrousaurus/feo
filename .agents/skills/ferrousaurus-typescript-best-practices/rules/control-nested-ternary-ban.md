---
title: Nested Ternaries Are Banned
impact: HIGH
impactDescription: Nested ternaries are unreadable; extract to a function
tags: control, ternary, nested, extraction, readability
---

## Nested Ternaries Are Banned

**Impact: HIGH (nested ternaries are unreadable; extract to a function)**

Never nest ternary expressions. They are difficult to read, hard to debug, and force readers to mentally track multiple branching conditions. When logic requires more than one condition, extract it into a named function with early returns.

**Incorrect (nested ternary):**

```typescript
const label = role === 'admin' ? 'Admin' : role === 'mod' ? 'Moderator' : 'User';
```

**Correct (extracted function with early returns):**

```typescript
const getLabel = (role: 'admin' | 'mod' | 'user') => {
  if (role === 'admin') {
    return 'Admin';
  }
  if (role === 'mod') {
    return 'Moderator';
  }
  return 'User';
};

const label = getLabel(role);
```

The extracted function is:
- Testable — you can unit test `getLabel` independently
- Debuggable — you can set breakpoints on each branch
- Readable — each condition gets its own line
- Extensible — adding a new role doesn't make the line longer