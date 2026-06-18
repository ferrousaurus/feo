---
title: Fetch Data Where It's Needed — Colocation Over Hoisting
impact: HIGH
impactDescription: Colocation simplifies data flow; TanStack Query deduplicates identical queryKeys
tags: react, data, fetching, colocation, tanstack-query
---

## Fetch Data Where It's Needed — Colocation Over Hoisting

**Impact: HIGH (colocation simplifies data flow; TanStack Query deduplicates identical queryKeys)**

Call data-fetching hooks directly in the component that needs the data. Do not hoist fetching to a parent component just to pass data down as props — TanStack Query deduplicates requests by queryKey, so multiple components requesting the same data will not issue duplicate network requests.

**Incorrect (hoisting data fetching to parent and drilling):**

```tsx
function Dashboard() {
  const { data: user } = useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });
  const { data: orders } = useQuery({ queryKey: ["orders", userId], queryFn: () => fetchOrders(userId) });

  return (
    <div>
      <UserProfile user={user} />
      <NotificationList notifications={notifications} />
      <OrderHistory orders={orders} />
    </div>
  );
}
```

This makes `Dashboard` responsible for data it doesn't render, and every child is coupled to Dashboard's data structure.

**Correct (fetch where needed):**

```tsx
function Dashboard() {
  return (
    <div>
      <UserProfile userId={userId} />
      <NotificationList />
      <OrderHistory userId={userId} />
    </div>
  );
}

function UserProfile({ userId }: UserProfileProps) {
  const { data: user } = useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });
  return <div>{user?.name}</div>;
}

function NotificationList() {
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });
  return (
    <ul>
      {notifications?.map((n) => (
        <li key={n.id}>{n.text}</li>
      ))}
    </ul>
  );
}

function OrderHistory({ userId }: OrderHistoryProps) {
  const { data: orders } = useQuery({ queryKey: ["orders", userId], queryFn: () => fetchOrders(userId) });
  return <div>{orders?.length} orders</div>;
}
```

When multiple components need the same data, they use the same `queryKey`. TanStack Query deduplicates the request — only one network call is made, and both components receive the cached result.

**Same data, multiple components — automatically deduplicated:**

```tsx
// Both components use the same queryKey — only one fetch occurs
function Header() {
  const { data: user } = useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });
  return <div>{user?.name}</div>;
}

function Sidebar() {
  const { data: user } = useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });
  return <div>{user?.email}</div>;
}
```

### Cross-References

- Stack Preferences: Async State Mgmt (TanStack Query Go-To)
- Related: [data-tanstack-query-only.md](./data-tanstack-query-only.md)
- Related: [state-no-prop-drilling.md](./state-no-prop-drilling.md)
