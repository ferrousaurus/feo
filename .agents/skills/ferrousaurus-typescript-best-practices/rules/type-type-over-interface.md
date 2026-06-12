---
title: Use type Alias, Never interface
impact: HIGH
impactDescription: Consistent type definition syntax across the codebase
tags: type, interface, alias, convention
---

## Use type Alias, Never interface

**Impact: HIGH (consistent type definition syntax across the codebase)**

Always use `type` for defining object shapes, unions, intersections, and any other type definition. Never use `interface`. `type` is more flexible (supports unions, intersections, conditional types, mapped types) and eliminates the need to choose between two syntaxes.

**Incorrect (using interface):**

```typescript
interface User {
  name: string;
  email: string;
}
```

**Correct (using type):**

```typescript
type User = {
  name: string;
  email: string;
};
```

`type` handles everything `interface` does, plus unions, intersections, and advanced type operations:

```typescript
type Status = 'active' | 'inactive' | 'pending';
type Admin = User & { role: 'admin'; permissions: string[] };
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
```

There is no situation where `interface` is required. Declaration merging — the one feature `interface` has that `type` doesn't — is an anti-pattern that creates hidden coupling.