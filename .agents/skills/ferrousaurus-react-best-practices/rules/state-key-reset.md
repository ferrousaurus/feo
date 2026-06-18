---
title: Use key Prop to Reset State, Not useEffect
impact: HIGH
impactDescription: Key-based reset is immediate and avoids cascading re-renders from Effect-based reset
tags: react, state, key, reset, useEffect
---

## Use key Prop to Reset State, Never useEffect

**Impact: HIGH (key-based reset is immediate and avoids cascading re-renders)**

When a component's state needs to reset in response to a prop change (e.g., switching user profiles, navigating between items), use the `key` prop to unmount and remount the component. Never use `useEffect` to reset state in response to prop changes — it causes an extra render with stale state, then another render after the state update.

**Incorrect (useEffect to reset state on prop change):**

```tsx
function ProfileEditor({ userId }: ProfileEditorProps) {
  const [draft, setDraft] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // 🔴 Avoid: Resetting state in an Effect on prop change
  useEffect(() => {
    setDraft("");
    setHasChanges(false);
  }, [userId]);

  return (
    <textarea
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        setHasChanges(true);
      }}
    />
  );
}
```

This is inefficient: the component first renders with stale state, then re-renders after the Effect fires.

**Correct (key to reset all state):**

```tsx
function ProfilePage({ userId }: ProfilePageProps) {
  return <ProfileEditor key={userId} userId={userId} />;
}

function ProfileEditor({ userId }: ProfileEditorProps) {
  const [draft, setDraft] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // When userId changes, ProfilePage renders <ProfileEditor key={newUserId} />,
  // which unmounts and remounts ProfileEditor, resetting all state automatically.
  return (
    <textarea
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        setHasChanges(true);
      }}
    />
  );
}
```

When you need to reset only some state (not all), adjust state during render:

**Correct (adjusting specific state during render):**

```tsx
function List({ items }: ListProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // ✅ Adjusting state during render, not in an Effect
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelectedId(undefined);
  }

  const selection = items.find((item) => item.id === selectedId) ?? null;

  return <ul>{/* ... */}</ul>;
}
```

But prefer the `key` approach whenever possible — it resets all state without any manual tracking.

### Cross-References

- Related: [effect-no-derived-state.md](./effect-no-derived-state.md)
- React Docs: [You Might Not Need an Effect — Resetting all state when a prop changes](https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes)
