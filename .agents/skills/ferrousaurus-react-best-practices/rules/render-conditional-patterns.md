---
title: Use && for Boolean Conditions, Ternary for Either/Or
impact: MEDIUM
impactDescription: Consistent conditional rendering patterns make JSX predictable and readable
tags: react, rendering, conditional, jsx, ternary
---

## Use && for Boolean Conditions, Ternary for Either/Or

**Impact: MEDIUM (consistent conditional rendering patterns make JSX predictable)**

Use the `&&` operator for conditional rendering when something is either shown or hidden. Use the ternary operator `? :` when rendering one of two different elements. Never use `&&` with values that could be `0` — it will render the number.

### && for show/hide (boolean conditions)

Use `&&` when you conditionally render an element or render nothing:

```tsx
return (
  <div>
    {isLoggedIn && <UserMenu />}
    {hasNotifications && <NotificationBadge />}
  </div>
);
```

**Beware of `0`:** `&&` with a falsy number will render the number. Always ensure the left side is a boolean:

```tsx
// ❌ Wrong: renders "0" when items.length is 0
{items.length && <ItemList items={items} />}

// ✅ Correct: boolean on the left side
{items.length > 0 && <ItemList items={items} />}
```

### Ternary for either/or rendering

Use `? :` when you render one of two elements:

```tsx
return isLoading ? <Spinner /> : <UserList users={users} />;
```

### Early returns for complex conditions

When conditional rendering involves multiple states or guard clauses, use early returns instead of nesting ternaries:

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <EmptyState />;

  return <Profile user={user} />;
}
```

### Summary

| Pattern | Use When |
|---------|----------|
| `condition && <Element />` | Show or hide a single element |
| `condition ? <A /> : <B />` | Render one of two different elements |
| Early return | Guard clauses, loading/error/empty states |
| Extracted function | Complex conditional logic, multiple branches |
| Object map | Static mapping from value to element/class |

### Cross-References

- Related: [render-early-returns.md](./render-early-returns.md)
- Related: [render-no-nested-ternaries.md](./render-no-nested-ternaries.md)
- TS Skill: `control-object-map` — Use object map for simple lookups