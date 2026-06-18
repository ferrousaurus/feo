---
title: Memoize Sparingly — Only With Measured Evidence
impact: MEDIUM
impactDescription: Premature memoization adds complexity without proven benefit; memo only when measured
tags: react, hooks, useMemo, useCallback, React.memo, memoization, performance
---

## Memoize Sparingly — Only With Measured Evidence

**Impact: MEDIUM (premature memoization adds complexity without proven benefit)**

Do not use `useMemo`, `useCallback`, or `React.memo` by default. Memoization has a cost (dependency comparison on every render, memory for cached values) that only pays off when there's evidence of a real performance problem. Reach for memoization only when:

1. **You've measured a performance problem** — profiling shows a specific component or computation is slow
2. **You're passing callbacks to a memoized child** — `useCallback` is needed to preserve `React.memo`'s effectiveness on child components

### useMemo: only for expensive computations

Use `useMemo` when a computation is demonstrably expensive (measured, not assumed). "Might be expensive" is not enough — many computations are faster than React's comparison overhead.

**Incorrect (premature memoization):**

```tsx
function UserList({ users }: UserListProps) {
  // Not expensive — filtering 100 items is fast
  const activeUsers = useMemo(() => users.filter((u) => u.isActive), [users]);
  return (
    <ul>
      {activeUsers.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

**Correct (compute during render):**

```tsx
function UserList({ users }: UserListProps) {
  const activeUsers = users.filter((u) => u.isActive);
  return (
    <ul>
      {activeUsers.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

**Correct (useMemo for genuinely expensive computation):**

```tsx
function ReportDashboard({ data }: ReportDashboardProps) {
  const processedData = useMemo(() => expensiveTransform(data), [data]);
  return <Chart data={processedData} />;
}
```

### useCallback: only for memoized children

Use `useCallback` when passing a callback to a child component wrapped in `React.memo`. If the child isn't memoized, `useCallback` provides no benefit — the child re-renders regardless.

**Incorrect (useCallback without memoized child):**

```tsx
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => setCount((c) => c + 1), []);
  // Button isn't memoized, so useCallback provides no benefit
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**Correct (useCallback with memoized child):**

```tsx
const ExpensiveButton = React.memo(function ExpensiveButton({ onClick, label }: ExpensiveButtonProps) {
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  return <ExpensiveButton onClick={handleClick} label={`Count: ${count}`} />;
}
```

### React.memo: only with measured re-renders

Wrap components with `React.memo` only when you've measured unnecessary re-renders that cause a visible performance problem. When you memoize a component, also memoize any callbacks passed to it.

**A better strategy: component extraction**

Often, the best solution isn't memoization but splitting the component so the expensive part doesn't re-render when the cheap part changes:

```tsx
// ✅ Better: Extract the static part so it doesn't re-render
function Parent() {
  const [text, setText] = useState("");
  return (
    <div>
      <StaticHeader />
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

// StaticHeader only renders once — no memoization needed
const StaticHeader = () => <h1>My App</h1>;
```

### Cross-References

- Related: [effect-no-derived-state.md](./effect-no-derived-state.md)
- React Docs: [You Might Not Need an Effect — Caching expensive calculations](https://react.dev/learn/you-might-not-need-an-effect#caching-expensive-calculations)
