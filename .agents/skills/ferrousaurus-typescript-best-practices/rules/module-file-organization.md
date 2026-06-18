---
title: Types First, Then Functions in Files
impact: LOW
impactDescription: Consistent file structure makes scanning faster
tags: module, file, organization, types, functions
---

## Types First, Then Functions in Files

**Impact: LOW (consistent file structure makes scanning faster)**

Organize files with type definitions at the top, followed by function declarations. This matches TypeScript's top-down resolution and makes the file's contract visible before the implementation.

**Incorrect (functions before types they depend on):**

```typescript
export const formatName = (user: User): FormattedName => ({ full: `${user.first} ${user.last}`, display: user.first });

export type FormattedName = { full: string; display: string };
export type User = { first: string; last: string };
```

**Correct (types first, then functions):**

```typescript
export type User = { first: string; last: string };
export type FormattedName = { full: string; display: string };

export const formatName = (user: User): FormattedName => ({ full: `${user.first} ${user.last}`, display: user.first });

export default formatName;
```

This convention applies at every level: modules, sections within a file, and even test files (types/mocks first, then tests).
