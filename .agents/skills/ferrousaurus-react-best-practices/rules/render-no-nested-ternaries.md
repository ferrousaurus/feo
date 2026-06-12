---
title: No Nested Ternaries in JSX
impact: MEDIUM
impactDescription: Nested ternaries are unreadable in JSX; extract to functions or early returns
tags: react, rendering, conditional, ternary, jsx
---

## No Nested Ternaries in JSX

**Impact: MEDIUM (nested ternaries are unreadable in JSX; extract to functions or early returns)**

Never nest ternary expressions in JSX. They are difficult to read, hard to debug, and make the render output unclear. This aligns with the TypeScript skill's `control-nested-ternary-ban` rule.

**Incorrect (nested ternaries in JSX):**

```tsx
function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={status === 'active' ? 'badge-green' : status === 'pending' ? 'badge-yellow' : 'badge-red'}>
      {status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Inactive'}
    </span>
  );
}
```

**Correct (extracted function with early returns):**

```tsx
const getBadgeLabel = (status: Status) => {
  if (status === 'active') return 'Active';
  if (status === 'pending') return 'Pending';
  return 'Inactive';
};

const getBadgeClassName = (status: Status) => {
  if (status === 'active') return 'badge-green';
  if (status === 'pending') return 'badge-yellow';
  return 'badge-red';
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={getBadgeClassName(status)}>{getBadgeLabel(status)}</span>
);
```

**Correct (object map for static value mapping):**

```tsx
const BADGE_STYLES: Record<Status, string> = {
  active: 'badge-green',
  pending: 'badge-yellow',
  inactive: 'badge-red',
};

const BADGE_LABELS: Record<Status, string> = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={BADGE_STYLES[status]}>{BADGE_LABELS[status]}</span>
);
```

A single ternary in JSX for either/or rendering is acceptable:

```tsx
return isLoading ? <Spinner /> : <Content />;
```

But as soon as you need a second condition, extract to a function or use an object map.

### Cross-References

- Related: [render-early-returns.md](./render-early-returns.md)
- Related: [render-conditional-patterns.md](./render-conditional-patterns.md)
- TS Skill: `control-nested-ternary-ban` — Nested ternaries are banned; extract to a function
- TS Skill: `control-object-map` — Use object map for simple lookups