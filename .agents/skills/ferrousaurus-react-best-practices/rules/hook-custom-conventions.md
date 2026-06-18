---
title: Custom Hook Conventions
impact: MEDIUM
impactDescription: Consistent hook APIs make custom hooks predictable and composable
tags: react, hooks, custom hooks, conventions
---

## Custom Hook Conventions

**Impact: MEDIUM (consistent hook APIs make custom hooks predictable and composable)**

Custom hooks are React's primary mechanism for sharing stateful logic. Following consistent conventions makes hooks composable, testable, and easy to understand at a glance.

### Rules

1. **Prefix with `use`** — Every custom hook starts with `use`. This isn't just convention; it's required by the Rules of Hooks. `useAuth`, `useUserQuery`, `useDebounce`.

2. **Named export, no default** — Custom hooks are always named exports. Named imports make it clear what's being used and enable better refactoring.

3. **Return values**: tuple for ≤2 values, named object for 3+
   - 0-2 return values: return a tuple `[value, setter]` or `[state, actions]`
   - 3+ return values: return a named object `{ user, isLoading, error, refetch }`

4. **Single-purpose** — Each hook does one thing. `useAuth` handles authentication, `useUserQuery` fetches a user. Don't create kitchen-sink hooks like `useApp` that return everything.

5. **No conditional calls** — Hooks must never be called conditionally. This is a React rule, not a style rule, but it's worth reinforcing: no `if` statements, loops, or `try/catch` around hook calls.

6. **No JSX returns** — Custom hooks return data and actions, not JSX. If you need reusable UI, create a component.

**Incorrect (wrong return shape, multiple purposes, JSX return):**

```tsx
function useApp() {
  const user = useAuth();
  const notifications = useNotifications();
  const theme = useTheme();

  return {
    user,
    notifications,
    theme,
    renderHeader: () => <Header user={user} />,
  };
}
```

**Correct (single-purpose, proper return shape):**

```tsx
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function login(credentials: Credentials) {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authenticate(credentials);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  return { user, isLoading, error, login, logout };
}
```

**Correct (tuple return for 2 values):**

```tsx
function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
```

### Cross-References

- Related: [hook-memoize-sparingly.md](./hook-memoize-sparingly.md)
- Related: [data-colocation.md](./data-colocation.md)
