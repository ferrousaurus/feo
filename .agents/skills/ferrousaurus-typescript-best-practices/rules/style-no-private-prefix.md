---
title: No Underscore Prefix for Internal Variables
impact: LOW
impactDescription: Module scope and non-export are sufficient for privacy
tags: style, naming, private, underscore, convention
---

## No Underscore Prefix for Internal Variables

**Impact: LOW (module scope and non-export are sufficient for privacy)**

Don't use underscore prefixes (`_`) for module-scoped variables that are internal or private. TypeScript and JavaScript have proper privacy mechanisms: `private` class fields (which we don't use — see `function-no-classes`), module scope, and simply not exporting. The underscore prefix is a convention from languages without proper privacy; in TypeScript, it's unnecessary.

**Incorrect (underscore prefix):**

```typescript
const _internalCache = new Map();
const _isValid = (value: string) => value.length > 0;
```

**Correct (no prefix, just don't export):**

```typescript
const internalCache = new Map();
const isValid = (value: string) => value.length > 0;
```

If a variable is internal to a module, it doesn't need a prefix — it's internal by default (not exported). If you need to signal "don't use this outside," don't export it.
