---
title: Prefer Built-in Utility Types
impact: LOW
impactDescription: Reduces boilerplate and improves readability
tags: type, utility, partial, pick, omit
---

## Prefer Built-in Utility Types

**Impact: LOW (reduces boilerplate and improves readability)**

Use TypeScript's built-in utility types (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters`, etc.) instead of manually defining equivalent types. They are well-understood, type-safe, and reduce duplication.

**Incorrect (manually defining what a utility type already provides):**

```typescript
type UserUpdate = {
  name?: string;
  email?: string;
  avatar?: string;
};
```

**Correct (using built-in utility types):**

```typescript
type UserUpdate = Partial<Pick<User, 'name' | 'email' | 'avatar'>>;
```

**More examples:**

```typescript
// Readonly version of a type
type FrozenConfig = Readonly<Config>;

// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>;

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Function return type
type ApiResponse = ReturnType<typeof fetchUser>;

// Record type for maps
type UserRoleMap = Record<UserRole, Permission[]>;
```

Only define custom types when the built-in utilities can't express what you need.