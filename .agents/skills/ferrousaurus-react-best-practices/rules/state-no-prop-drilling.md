---
title: Switch to Store After 1-2 Intermediate Props
impact: HIGH
impactDescription: Prop drilling through unused intermediates creates fragile, hard-to-refactor code
tags: react, state, props, zustand, jotai
---

## Switch to Store After 1-2 Intermediate Props

**Impact: HIGH (prop drilling through unused intermediates creates fragile, hard-to-refactor code)**

When a prop passes through more than 1-2 intermediate components that don't use it, reach for a state store (Zustand or Jotai, per ferrousaurus-stack-preferences) or restructure with slot composition. Prop drilling makes components aware of data they don't need, couples them to ancestors they shouldn't know about, and makes refactoring painful.

The threshold is intentionally low: if a component receives a prop only to pass it down, that's a signal that the data flow should be restructured.

**Incorrect (prop drilling through 3 intermediates):**

```tsx
function App() {
  const [theme, setTheme] = useState("dark");
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }: LayoutProps) {
  // Layout doesn't use theme or setTheme — just passing through
  return <Sidebar theme={theme} setTheme={setTheme} />;
}

function Sidebar({ theme, setTheme }: SidebarProps) {
  // Sidebar doesn't use theme either — just passing through
  return <ThemeToggle theme={theme} setTheme={setTheme} />;
}

function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  // Only ThemeToggle actually uses theme
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle</button>;
}
```

**Correct (Zustand store — per ferrousaurus-stack-preferences):**

```tsx
const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));

function App() {
  return <Layout />;
}

function Layout() {
  return <Sidebar />;
}

function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle</button>;
}
```

Use Jotai (per ferrousaurus-stack-preferences — acceptable when many independent instances of state are needed) when the state is fine-grained and per-component:

```tsx
const themeAtom = atom("dark");

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle</button>;
}
```

### Cross-References

- Stack Preferences: Local State Mgmt (Zustand Go-To, Jotai Acceptable for many instances)
- Related: [state-no-context-runtime.md](./state-no-context-runtime.md)
- Related: [composition-slots-over-compound.md](./composition-slots-over-compound.md)
