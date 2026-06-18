---
title: useEffect Only for Synchronizing with External Systems
impact: HIGH
impactDescription: Misused effects cause cascading renders, race conditions, and stale data
tags: react, effect, useEffect, lifecycle
---

## useEffect Only for Synchronizing with External Systems

**Impact: HIGH (misused effects cause cascading renders, race conditions, and stale data)**

`useEffect` is an escape hatch for synchronizing React components with external systems: third-party widgets, browser APIs, network subscriptions, DOM measurements. It is not a general-purpose lifecycle hook. Following React's "You Might Not Need an Effect" guidance, most common `useEffect` patterns have better alternatives.

### When useEffect IS appropriate

- Subscribing to a WebSocket or event source (though prefer `useSyncExternalStore`)
- Synchronizing with a third-party imperative library (e.g., a map widget, chart library)
- Measuring DOM layout (e.g., `getBoundingClientRect`)
- Sending analytics on mount (component was displayed to the user)
- Any side effect that runs _because the component was displayed_, not because of a user action

### When useEffect is NOT appropriate

- **Deriving state from props or state** → Calculate during render
- **Caching expensive computations** → Use `useMemo`
- **Resetting state on prop change** → Use `key` prop
- **Fetching data** → Use TanStack Query
- **Responding to user events** → Use event handlers
- **Notifying parent of state changes** → Call parent callback in the same event handler

**Incorrect (deriving state in an effect):**

```tsx
function SearchResults({ query }: SearchResultsProps) {
  const [filteredResults, setFilteredResults] = useState([]);

  // 🔴 Avoid: Deriving state in an Effect
  useEffect(() => {
    setFilteredResults(results.filter((r) => r.name.includes(query)));
  }, [results, query]);

  return <ul>{filteredResults.map(...)}</ul>;
}
```

**Correct (calculate during render):**

```tsx
function SearchResults({ query }: SearchResultsProps) {
  const filteredResults = results.filter((r) => r.name.includes(query));
  return <ul>{filteredResults.map(...)}</ul>;
}
```

**Correct (useMemo for expensive calculations):**

```tsx
function SearchResults({ query }: SearchResultsProps) {
  const filteredResults = useMemo(
    () => results.filter((r) => r.name.includes(query)),
    [results, query],
  );
  return <ul>{filteredResults.map(...)}</ul>;
}
```

**Incorrect (responding to user events in an effect):**

```tsx
function ProductPage({ product, onAddToCart }: ProductPageProps) {
  const [isAdded, setIsAdded] = useState(false);

  // 🔴 Avoid: Event logic in an Effect
  useEffect(() => {
    if (isAdded) {
      onAddToCart(product);
    }
  }, [isAdded, onAddToCart, product]);

  function handleAdd() {
    setIsAdded(true);
  }
}
```

**Correct (handle events in event handlers):**

```tsx
function ProductPage({ product, onAddToCart }: ProductPageProps) {
  function handleAdd() {
    onAddToCart(product);
  }

  return <button onClick={handleAdd}>Add to cart</button>;
}
```

If you can ask "why does this code need to run?" and the answer is "because the user clicked a button," it belongs in an event handler. If the answer is "because the component was displayed," it may belong in an Effect.

### Cross-References

- Related: [effect-no-derived-state.md](./effect-no-derived-state.md)
- Related: [effect-no-data-fetching.md](./effect-no-data-fetching.md)
- Related: [effect-sync-external-store.md](./effect-sync-external-store.md)
- Related: [state-key-reset.md](./state-key-reset.md)
- React Docs: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
