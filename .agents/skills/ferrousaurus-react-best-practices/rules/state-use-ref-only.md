---
title: useRef Only for DOM References and Non-Rendering Instance Values
impact: HIGH
impactDescription: Using useRef as state replacement causes silent bugs — updates don't trigger re-renders
tags: react, state, useRef, ref
---

## useRef Only for DOM References and Non-Rendering Instance Values

**Impact: HIGH (using useRef as state replacement causes silent bugs — updates don't trigger re-renders)**

`useRef` is for values that should persist across renders without triggering a re-render when they change. It is not a state management tool. If a value change should update the UI, use `useState` or `useReducer` instead.

### Acceptable uses of useRef

- DOM element references (`useRef<HTMLDivElement>(null)`)
- Timer IDs (`setTimeout`/`setInterval` return values)
- Previous values that don't affect rendering
- Tracking whether a component is mounted
- Storing values that external imperative APIs need access to
- Instance values that must persist across renders but never drive rendering

### Unacceptable uses of useRef

- Storing values that affect what's rendered (use `useState` or `useReducer`)
- Replacing state to "avoid re-renders" (this is a bug, not an optimization)
- Caching computed values that affect the UI (use `useMemo`)

**Incorrect (useRef as state replacement):**

```tsx
function SearchResults({ query }: SearchResultsProps) {
  const resultsRef = useRef<SearchResult[]>([]);
  const isSearchingRef = useRef(false);

  // 🔴 Never: Ref values don't trigger re-renders
  // The UI will not update when resultsRef or isSearchingRef change
  async function handleSearch() {
    isSearchingRef.current = true; // UI won't reflect this
    const data = await fetchResults(query);
    resultsRef.current = data; // UI won't reflect this either
  }

  return <div>{resultsRef.current.length} results</div>; // Stale!
}
```

**Correct (useState for values that affect rendering):**

```tsx
function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch() {
    setIsSearching(true); // UI updates
    const data = await fetchResults(query);
    setResults(data); // UI updates
  }

  return <div>{results.length} results</div>;
}
```

**Correct (useRef for legitimate non-rendering values):**

```tsx
function Stopwatch() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);

  function handleStart() {
    intervalRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
  }

  function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return <div>{elapsed}s <button onClick={handleStart}>Start</button> <button onClick={handleStop}>Stop</button></div>;
}
```

### Cross-References

- Related: [state-usereducer-nontrivial.md](./state-usereducer-nontrivial.md)
- Related: [hook-custom-conventions.md](./hook-custom-conventions.md)