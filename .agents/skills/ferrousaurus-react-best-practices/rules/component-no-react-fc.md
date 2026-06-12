---
title: Never Use React.FC for Component Typing
impact: CRITICAL
impactDescription: React.FC adds no value, prevents flexible return types, and makes generics awkward
tags: react, component, types, React.FC
---

## Never Use React.FC for Component Typing

**Impact: CRITICAL (React.FC adds no value and introduces unnecessary constraints)**

Never use `React.FC`, `React.FunctionComponent`, or `React.VFC` to type component props. Define props as a named `type` and destructure them in the function signature. This aligns with the TypeScript skill's `type-type-over-interface` rule and provides better control over component signatures.

**Incorrect (React.FC):**

```tsx
const Badge: React.FC<BadgeProps> = ({ label }) => <span>{label}</span>;

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // ...
};
```

Problems with `React.FC`:
- Adds `children` to props implicitly (before React 18), creating confusion
- Makes generic components awkward: `const List: React.FC<ListProps<T>>` doesn't work cleanly
- Prevents flexible return types (e.g., `React.ReactNode` that includes `string | null`)
- Provides no benefit over a named type + destructured parameters
- Obscures the actual props contract

**Correct (named type + function signature):**

```tsx
export type BadgeProps = {
  label: string;
};

const Badge = ({ label }: BadgeProps) => <span>{label}</span>;

export type UserProfileProps = {
  userId: string;
};

function UserProfile({ userId }: UserProfileProps) {
  // ...
}
```

The props type is always a `type` (never `interface`), always exported, and always destructured in the function signature. This makes the props contract explicit and allows generic components without gymnastics.

### Cross-References

- Related: [component-exports.md](./component-exports.md)
- TS Skill: `type-type-over-interface` — Use `type` alias, never `interface`