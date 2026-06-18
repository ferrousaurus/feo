---
title: Default Export for Component, Named Export for Props Type
impact: CRITICAL
impactDescription: Consistent export pattern makes files identifiable and props consumable
tags: react, component, export, default
---

## Default Export for Component, Named Export for Props Type

**Impact: CRITICAL (consistent export pattern makes files identifiable and props consumable)**

Every component file has exactly one default export (the component) and named exports for its props type. The default export follows the pure/side-effect convention: arrow components use `export default` after declaration, hook-using components use `export default function`.

The props type is always exported as a named `type` so consumers can reference it.

**Incorrect (named export only, no default):**

```tsx
export function UserProfile({ userId }: UserProfileProps) {
  // ...
}
```

**Incorrect (default export without exported props type):**

```tsx
type UserProfileProps = {
  userId: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  // ...
}
```

**Incorrect (arrow component as default expression without const name):**

```tsx
export default ({ label }: BadgeProps) => <span>{label}</span>;
```

**Correct (hook-using component — function declaration default export):**

```tsx
export type UserProfileProps = {
  userId: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  const { data } = useUserQuery(userId);
  return <div>{data?.name}</div>;
}
```

**Correct (simple component — const arrow exported as default):**

```tsx
export type BadgeProps = {
  label: string;
};

const Badge = ({ label }: BadgeProps) => <span className="badge">{label}</span>;

export default Badge;
```

This pattern ensures:

- The default export makes the file's purpose immediately clear
- Named props type export allows consumers to reference `UserProfileProps`
- The pure/side-effect convention is preserved at the export level

### Cross-References

- Related: [component-arrow-vs-declaration.md](./component-arrow-vs-declaration.md)
- TS Skill: `function-default-exports` — Default exports follow function convention
