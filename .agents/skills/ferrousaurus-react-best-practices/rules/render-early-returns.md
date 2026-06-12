---
title: Early Returns for Null and Error States
impact: MEDIUM
impactDescription: Early returns flatten component logic and make the happy path prominent
tags: react, rendering, conditional, early return
---

## Early Returns for Null and Error States

**Impact: MEDIUM (early returns flatten component logic and make the happy path prominent)**

Use early returns for null checks, loading states, and error states before the main render. This aligns with the TypeScript skill's `control-early-return` rule and keeps the happy path at the bottom of the component, unindented and easy to read.

**Incorrect (nested conditionals for guard clauses):**

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (!isLoading) {
    if (!error) {
      if (user) {
        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        );
      }
      return <EmptyState />;
    }
    return <ErrorMessage error={error} />;
  }
  return <Spinner />;
}
```

**Correct (early returns, flat structure):**

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <EmptyState />;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

Early returns follow the "fail fast" principle. Each guard clause says "here's why we can't proceed." After all guards, the remaining code is the happy path with zero nesting.

### Order of early returns

Follow a consistent order:
1. Loading states
2. Error states
3. Empty/null states
4. Happy path (no guard, final return)

### Cross-References

- Related: [render-no-nested-ternaries.md](./render-no-nested-ternaries.md)
- Related: [render-conditional-patterns.md](./render-conditional-patterns.md)
- TS Skill: `control-early-return` — Always use early returns, avoid deep nesting