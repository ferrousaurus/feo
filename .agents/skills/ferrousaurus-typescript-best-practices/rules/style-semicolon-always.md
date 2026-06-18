---
title: Always Use Semicolons
impact: LOW
impactDescription: Prevents ASI-related bugs and makes statements explicit
tags: style, semicolon, statement, formatting
---

## Always Use Semicolons

**Impact: LOW (prevents ASI-related bugs and makes statements explicit)**

Always terminate statements with semicolons. Relying on Automatic Semicolon Insertion (ASI) is error-prone and can introduce subtle bugs, especially with statements that begin with `(`, `[`, or `/`.

**Incorrect (relying on ASI):**

```typescript
const name = `Alice`
const age = 30
const items = [1, 2, 3]

// ASI bug: (function...) is treated as a function call
const result = compute()
(function() { ... })()
```

**Correct (explicit semicolons):**

```typescript
const name = `Alice`;
const age = 30;
const items = [1, 2, 3];

const result = compute();
(function() { ... })();
```

Semicolons make statement boundaries explicit and prevent a class of bugs that are difficult to diagnose.
