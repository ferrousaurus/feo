---
title: Arrow for Simple Components, Function Declaration for Hook-Using Components
impact: CRITICAL
impactDescription: Aligns component syntax with the pure/side-effect convention from the TypeScript skill
tags: react, component, arrow, declaration, hooks
---

## Arrow for Simple Components, Function Declaration for Hook-Using Components

**Impact: CRITICAL (aligns component syntax with the pure/side-effect convention)**

Although React components are technically side-effecting (they render to the DOM), the developer's mental model distinguishes between simple presentational components and components with hooks. Simple components that just render JSX without hooks are conceptually pure — they map props to UI. Components that use hooks manage state and effects, making them side-effecting.

Follow the TypeScript skill's pure/side-effect convention:

- **Arrow function (`const`)** for simple components: no hooks, just props → JSX
- **Function declaration** for hook-using components: uses `useState`, `useEffect`, custom hooks, etc.

**Incorrect (function declaration for simple presentational component):**

```tsx
function Badge({ label }: BadgeProps) {
  return <span className="badge">{label}</span>;
}
```

**Incorrect (arrow function for component with hooks):**

```tsx
const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState(null);
  const { data } = useUserQuery(userId);

  return <div>{user?.name}</div>;
};
```

**Correct (arrow for simple, declaration for hook-using):**

```tsx
const Badge = ({ label }: BadgeProps) => <span className="badge">{label}</span>;

function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState(null);
  const { data } = useUserQuery(userId);

  return <div>{data?.name}</div>;
}
```

This creates an immediate visual signal: `const Component = () =>` tells you "this is a simple presentational component," while `function Component()` tells you "this component manages state or side effects."

### Cross-References

- Related: [component-function-over-class.md](./component-function-over-class.md)
- TS Skill: `function-pure-arrow` — Pure functions use arrow syntax, side effects use function declarations