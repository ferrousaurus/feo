---
title: Prefix Booleans with is/has/should
impact: MEDIUM
impactDescription: Self-documenting boolean names at a glance
tags: style, naming, boolean, prefix
---

## Prefix Booleans with is/has/should

**Impact: MEDIUM (self-documenting boolean names at a glance)**

Boolean variables, parameters, and type properties should be prefixed with `is`, `has`, or `should` to make their boolean nature immediately clear. This eliminates ambiguity about what the value represents.

**Incorrect (ambiguous boolean names):**

```typescript
const active = true;
const admin = false;
const loading = true;
const permission = true;
```

**Correct (self-documenting boolean prefixes):**

```typescript
const isActive = true;
const isAdmin = false;
const isLoading = true;
const hasPermission = true;
```

Prefix guidelines:
- `is` for state/condition: `isActive`, `isVisible`, `isLoading`
- `has` for possession/containment: `hasPermission`, `hasChildren`, `hasError`
- `should` for intent/behavior: `shouldRetry`, `shouldValidate`, `shouldRedirect`

This also applies to type definitions:

```typescript
type User = {
  isActive: boolean;
  hasPermission: boolean;
  shouldResetPassword: boolean;
};
```