---
title: Always Use TanStack Query for Server State
impact: HIGH
impactDescription: useEffect+useState fetching causes race conditions, stale data, and boilerplate
tags: react, data, fetching, tanstack-query, useEffect
---

## Always Use TanStack Query for Server State

**Impact: HIGH (useEffect+useState fetching causes race conditions, stale data, and boilerplate)**

All server state flows through TanStack Query (per ferrousaurus-stack-preferences). Never use `useEffect` + `useState` for data fetching. TanStack Query handles caching, background refetching, stale-while-revalidate, deduplication, and race conditions — all of which you'd have to implement manually with `useEffect`.

**Incorrect (useEffect + useState for fetching):**

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 🔴 Avoid: Manual fetching with race conditions and no caching
  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    fetchUser(userId)
      .then((data) => {
        if (!ignore) {
          setUser(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [userId]);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}
```

**Correct (TanStack Query):**

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}
```

TanStack Query provides:
- Automatic caching and deduplication by queryKey
- Background refetching and stale-while-revalidate
- Built-in loading and error states
- Race condition prevention
- Prefetching and invalidation APIs
- SSR support via hydration

### Mutations

For data mutations (POST, PUT, DELETE), use TanStack Query's `useMutation`:

```tsx
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDTO) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Cross-References

- Stack Preferences: Async State Mgmt (TanStack Query Go-To), API Client (Native fetch + TanStack Query)
- Related: [data-colocation.md](./data-colocation.md)
- Related: [effect-external-systems-only.md](./effect-external-systems-only.md)