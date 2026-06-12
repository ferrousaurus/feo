---
title: No useEffect for Derived State
impact: HIGH
impactDescription: Effect-based derived state causes cascading renders with stale intermediate values
tags: react, effect, derived state, useMemo, useState
---

## No useEffect for Derived State

**Impact: HIGH (Effect-based derived state causes cascading renders with stale intermediate values)**

Never use `useEffect` to compute values that can be derived from existing props or state. If you can calculate a value from what's already available during render, do it directly in the component body. This eliminates an entire render cycle and avoids stale intermediate states.

### Rules

- **Calculate during render** for simple derivations (filtering, mapping, combining)
- **Use `useMemo`** for expensive derivations (large list processing, complex computations)
- **Never use `useEffect` + `setState`** to sync derived state

**Incorrect (useEffect to sync state):**

```tsx
function TodoList({ todos, filter }: TodoListProps) {
  const [visibleTodos, setVisibleTodos] = useState([]);

  // 🔴 Avoid: Redundant state updated by an Effect
  useEffect(() => {
    setVisibleTodos(todos.filter((todo) => !todo.completed && todo.text.includes(filter)));
  }, [todos, filter]);

  return <ul>{visibleTodos.map((todo) => <li key={todo.id}>{todo.text}</li>)}</ul>;
}
```

This renders twice: once with stale `visibleTodos`, then again after the Effect updates it.

**Correct (calculate during render — simple derivation):**

```tsx
function TodoList({ todos, filter }: TodoListProps) {
  const visibleTodos = todos.filter((todo) => !todo.completed && todo.text.includes(filter));
  return <ul>{visibleTodos.map((todo) => <li key={todo.id}>{todo.text}</li>)}</ul>;
}
```

**Correct (useMemo for expensive derivation):**

```tsx
function TodoList({ todos, filter }: TodoListProps) {
  const visibleTodos = useMemo(
    () => todos.filter((todo) => !todo.completed && todo.text.includes(filter)),
    [todos, filter],
  );
  return <ul>{visibleTodos.map((todo) => <li key={todo.id}>{todo.text}</li>)}</ul>;
}
```

### Common patterns and their correct alternatives

| Pattern | Incorrect | Correct |
|---------|-----------|---------|
| Combine first/last name | `useEffect(() => setFullName(first + ' ' + last))` | `const fullName = first + ' ' + last` |
| Filter a list | `useEffect(() => setFiltered(items.filter(...)))` | `const filtered = items.filter(...)` |
| Compute total | `useEffect(() => setTotal(items.reduce(...)))` | `const total = items.reduce(...)` |
| Expensive computation | `useEffect(() => setResult(expensive(data)))` | `const result = useMemo(() => expensive(data), [data])` |

### Cross-References

- Related: [effect-external-systems-only.md](./effect-external-systems-only.md)
- Related: [hook-memoize-sparingly.md](./hook-memoize-sparingly.md)