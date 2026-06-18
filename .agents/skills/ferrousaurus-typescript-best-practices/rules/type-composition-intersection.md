---
title: Use Intersection for Type Composition
impact: MEDIUM
impactDescription: Creates new types by combining existing ones
tags: type, intersection, composition, extends
---

## Use Intersection for Type Composition

**Impact: MEDIUM (creates new types by combining existing ones)**

Use intersection (`&`) to compose types from existing ones. This is the TypeScript-idiomatic way to extend or combine types, replacing class inheritance and interface extension.

**Incorrect (interface extends):**

```typescript
interface Admin extends User {
  role: "admin";
  permissions: string[];
}
```

**Correct (intersection composition):**

```typescript
type Admin = User & { role: "admin"; permissions: string[] };
```

**Correct (composing with utility types):**

```typescript
type AdminWithPermissions = User & { role: "admin"; permissions: string[] };
type AdminPreview = Pick<Admin, "id" | "name" | "role">;
```

Intersection is more flexible than `extends`:

- Works with any type (not just object shapes)
- Can compose unions
- Can be used inline without a separate declaration
- Works with `type` (which we always use)

```typescript
// Composing with unions
type ActiveAdmin = Admin & { status: "active" };

// Composing with Omit
type AdminWithoutRole = Omit<Admin, "role"> & { role: "superadmin" };
```
