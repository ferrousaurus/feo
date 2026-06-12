---
title: Always Use useSyncExternalStore for External Subscriptions
impact: HIGH
impactDescription: Manual useEffect subscriptions miss concurrent rendering edge cases and tear between trees
tags: react, effect, useSyncExternalStore, subscription, external store
---

## Always Use useSyncExternalStore for External Subscriptions

**Impact: HIGH (manual useEffect subscriptions miss concurrent rendering edge cases)**

When subscribing to an external data source (browser APIs, third-party state, WebSocket connections, Zustand/Jotai stores under the hood), always use `useSyncExternalStore` or a library-provided hook that wraps it. Never write manual `useEffect`-based subscriptions to external data sources.

Manual `useEffect` subscriptions have subtle bugs with concurrent rendering, tearing between trees, and stale snapshots. `useSyncExternalStore` handles all of these correctly.

**Incorrect (manual useEffect subscription):**

```tsx
function useOnlineStatus() {
  // 🔴 Avoid: Manual subscription misses concurrent rendering edge cases
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();
    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);

  return isOnline;
}
```

**Correct (useSyncExternalStore):**

```tsx
function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
```

### When you'll encounter this

Most of the time you won't write `useSyncExternalStore` directly. Library hooks already wrap it:

- **Zustand** — `useStore(selector)` wraps `useSyncExternalStore`
- **Jotai** — `useAtom(atom)` wraps `useSyncExternalStore`
- **TanStack Query** — `useQuery()` wraps `useSyncExternalStore`

You should only write `useSyncExternalStore` when:
- Subscribing to browser APIs (`navigator.onLine`, `window.matchMedia`, `IntersectionObserver`)
- Subscribing to third-party imperative libraries that manage their own state
- Creating a custom store hook for app-level state

### Cross-References

- Related: [effect-external-systems-only.md](./effect-external-systems-only.md)
- Related: [state-no-context-runtime.md](./state-no-context-runtime.md)
- React Docs: [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)