# React Best Practices

**Version 1.0.0**
Ferrousaurus
May 2026

> **Note:**
> This document is for agents and LLMs to follow when writing, reviewing, or refactoring React code. Humans may also find it useful, but guidance here is optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

React writing conventions, designed for AI agents and LLMs. Contains 27 rules across 8 categories, prioritized by impact from critical (component definition and export conventions) to incremental (file organization and naming). Each rule includes detailed explanations and code examples comparing incorrect vs. correct implementations.

---

## Table of Contents

1. [Component Definition](#1-component-definition) — **CRITICAL**
   - 1.1 [Function Components Only, Never Class Components](#11-function-components-only-never-class-components)
   - 1.2 [Arrow for Simple Components, Function Declaration for Hook-Using Components](#12-arrow-for-simple-components-function-declaration-for-hook-using-components)
   - 1.3 [Never Use React.FC for Component Typing](#13-never-use-reactfc-for-component-typing)
   - 1.4 [Default Export for Component, Named Export for Props Type](#14-default-export-for-component-named-export-for-props-type)
   - 1.5 [Metaframework-Aware Server/Client Component Boundary](#15-metaframework-aware-serverclient-component-boundary)
2. [State Management](#2-state-management) — **HIGH**
   - 2.1 [useReducer for Non-Trivial State, useState for Simple State](#21-usereducer-for-non-trivial-state-usestate-for-simple-state)
   - 2.2 [No Context for Runtime-Updating State](#22-no-context-for-runtime-updating-state)
   - 2.3 [Switch to Store After 1-2 Intermediate Props](#23-switch-to-store-after-1-2-intermediate-props)
   - 2.4 [Use key Prop to Reset State, Not useEffect](#24-use-key-prop-to-reset-state-not-useeffect)
   - 2.5 [useRef Only for DOM References and Non-Rendering Instance Values](#25-useref-only-for-dom-references-and-non-rendering-instance-values)
3. [Effects & Lifecycle](#3-effects--lifecycle) — **HIGH**
   - 3.1 [useEffect Only for Synchronizing with External Systems](#31-useeffect-only-for-synchronizing-with-external-systems)
   - 3.2 [No useEffect for Derived State](#32-no-useeffect-for-derived-state)
   - 3.3 [Always Use TanStack Query for Server State](#33-always-use-tanstack-query-for-server-state)
   - 3.4 [Always Use useSyncExternalStore for External Subscriptions](#34-always-use-usesyncexternalstore-for-external-subscriptions)
4. [Data Fetching](#4-data-fetching) — **HIGH**
   - 4.1 [Always Use TanStack Query for Server State](#41-always-use-tanstack-query-for-server-state)
   - 4.2 [Fetch Data Where It's Needed — Colocation Over Hoisting](#42-fetch-data-where-its-needed--colocation-over-hoisting)
5. [Composition & Props](#5-composition--props) — **MEDIUM**
   - 5.1 [Slot Props Over Compound Components](#51-slot-props-over-compound-components)
   - 5.2 [Type children as React.ReactNode](#52-type-children-as-reactreactnode)
   - 5.3 [Controlled Inputs by Default, Aligned with Component Library](#53-controlled-inputs-by-default-aligned-with-component-library)
   - 5.4 [Error Boundaries at Route and Feature Boundaries](#54-error-boundaries-at-route-and-feature-boundaries)
   - 5.5 [Prefer Short Fragment Syntax](#55-prefer-short-fragment-syntax)
6. [Hooks](#6-hooks) — **MEDIUM**
   - 6.1 [Custom Hook Conventions](#61-custom-hook-conventions)
   - 6.2 [Memoize Sparingly — Only With Measured Evidence](#62-memoize-sparingly--only-with-measured-evidence)
7. [Conditional Rendering](#7-conditional-rendering) — **MEDIUM**
   - 7.1 [Early Returns for Null and Error States](#71-early-returns-for-null-and-error-states)
   - 7.2 [No Nested Ternaries in JSX](#72-no-nested-ternaries-in-jsx)
   - 7.3 [Use && for Boolean Conditions, Ternary for Either/Or](#73-use--for-boolean-conditions-ternary-for-eitheror)
8. [File Organization](#8-file-organization) — **LOW**
   - 8.1 [Type-Based Directories for React Projects](#81-type-based-directories-for-react-projects)
   - 8.2 [PascalCase for Component Files, camelCase for Non-Components](#82-pascalcase-for-component-files-camelcase-for-non-components)

---

## 1. Component Definition

**Impact: CRITICAL**

The foundational conventions for how React components are defined and exported. Function components over class components, arrow vs. declaration based on hooks, never using React.FC, and metaframework-aware server/client boundaries. These rules establish the visual and structural patterns that make React code immediately scannable.

### 1.1 Function Components Only, Never Class Components

**Impact: CRITICAL (eliminates `this` binding issues and favors functional composition)**

Never use class components. Function components are the standard React pattern. Class components introduce `this` binding confusion, lifecycle method complexity, and ceremony that function components with hooks avoid entirely. This aligns with the TypeScript skill's `function-no-classes` rule — prefer functions and closures over classes.

**Incorrect (class component):**

```tsx
class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.state = { isLoading: true };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ isLoading: false });
  }

  render() {
    return <button onClick={this.handleClick}>{this.state.isLoading ? "Loading" : "Done"}</button>;
  }
}
```

**Correct (function component):**

```tsx
type UserProfileProps = {
  userId: string;
};

function UserProfile({ userId }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => setIsLoading(false);

  return <button onClick={handleClick}>{isLoading ? "Loading" : "Done"}</button>;
}
```

Function components have no `this` binding issues, no constructor boilerplate, and can use all React hooks. Class components cannot use hooks, making them incompatible with the state management and data fetching patterns in this guide.

### 1.2 Arrow for Simple Components, Function Declaration for Hook-Using Components

**Impact: CRITICAL (aligns component syntax with the pure/side-effect convention)**

Although React components are technically side-effecting (they render to the DOM), the developer's mental model distinguishes between simple presentational components and components with hooks. Simple components that just render JSX without hooks are conceptually pure — they map props to UI. Components that use hooks manage state and effects, making them side-effecting.

Follow the TypeScript skill's pure/side-effect convention:

- **Arrow function (`const`)** for simple components: no hooks, just props → JSX
- **Function declaration** for hook-using components: uses `useState`, `useEffect`, custom hooks, etc.

**Incorrect (function declaration for simple presentational component):**

```tsx
function Badge({ label }: BadgeProps) {
  return <span className="badge">{label}</span>;
}
```

**Incorrect (arrow function for component with hooks):**

```tsx
const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState(null);
  const { data } = useUserQuery(userId);

  return <div>{user?.name}</div>;
};
```

**Correct (arrow for simple, declaration for hook-using):**

```tsx
const Badge = ({ label }: BadgeProps) => <span className="badge">{label}</span>;

function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState(null);
  const { data } = useUserQuery(userId);

  return <div>{data?.name}</div>;
}
```

This creates an immediate visual signal: `const Component = () =>` tells you "this is a simple presentational component," while `function Component()` tells you "this component manages state or side effects."

### 1.3 Never Use React.FC for Component Typing

**Impact: CRITICAL (React.FC adds no value and introduces unnecessary constraints)**

Never use `React.FC`, `React.FunctionComponent`, or `React.VFC` to type component props. Define props as a named `type` and destructure them in the function signature. This aligns with the TypeScript skill's `type-type-over-interface` rule and provides better control over component signatures.

**Incorrect (React.FC):**

```tsx
const Badge: React.FC<BadgeProps> = ({ label }) => <span>{label}</span>;
```

Problems with `React.FC`:

- Adds `children` to props implicitly (before React 18), creating confusion
- Makes generic components awkward
- Prevents flexible return types
- Provides no benefit over a named type + destructured parameters
- Obscures the actual props contract

**Correct (named type + function signature):**

```tsx
export type BadgeProps = {
  label: string;
};

const Badge = ({ label }: BadgeProps) => <span>{label}</span>;
```

### 1.4 Default Export for Component, Named Export for Props Type

**Impact: CRITICAL (consistent export pattern makes files identifiable and props consumable)**

Every component file has exactly one default export (the component) and named exports for its props type. The default export follows the pure/side-effect convention: arrow components use `export default` after declaration, hook-using components use `export default function`.

The props type is always exported as a named `type` so consumers can reference it.

**Incorrect (named export only, no default):**

```tsx
export function UserProfile({ userId }: UserProfileProps) {
  // ...
}
```

**Incorrect (default export without exported props type):**

```tsx
type UserProfileProps = {
  userId: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  // ...
}
```

**Correct (hook-using component — function declaration default export):**

```tsx
export type UserProfileProps = {
  userId: string;
};

export default function UserProfile({ userId }: UserProfileProps) {
  const { data } = useUserQuery(userId);
  return <div>{data?.name}</div>;
}
```

**Correct (simple component — const arrow exported as default):**

```tsx
export type BadgeProps = {
  label: string;
};

const Badge = ({ label }: BadgeProps) => <span className="badge">{label}</span>;

export default Badge;
```

### 1.5 Metaframework-Aware Server/Client Component Boundary

**Impact: HIGH (wrong boundary choices cause unnecessary client JS or broken interactivity)**

The server/client component boundary depends on the metaframework in use. There is no one-size-fits-all rule — the correct pattern depends on which framework you're using.

**TanStack Start** uses **server functions**, not React Server Components. Components are client-rendered by default. Server functions are called explicitly for data mutations and server-side logic. Do not try to use RSC patterns in TanStack Start.

**Next.js (App Router)** is built around React Server Components. Default to server components. Only add `'use client'` when a component needs interactivity (useState, useEffect, event handlers). Keep client components small and at the leaf level.

Regardless of framework: push interactivity to the edges. The more logic that runs on the server, the less JavaScript shipped to the client. Only components that need hooks or event handlers should be client components.

---

## 2. State Management

**Impact: HIGH**

Choosing the right state management primitive for each scenario. useReducer for non-trivial state, no Context for runtime-updating data, early escape from prop drilling, key-based state resets, and strict limits on useRef. These rules prevent the most common React state anti-patterns.

### 2.1 useReducer for Non-Trivial State, useState for Simple State

**Impact: HIGH (prevents cascading setState calls and state bugs in complex components)**

Choose the right state primitive based on state complexity. `useState` is for simple, independent values. `useReducer` is for state with interdependent fields, complex transitions, or when multiple `setState` calls would be chained in the same handler.

**When to use useState:** Single boolean, string, or number values. Simple toggles. Independent state that doesn't affect other state.

**When to use useReducer:** State fields that depend on each other. Complex state transitions (state machines, multi-step flows). When a single action requires multiple `setState` calls. Form state with validation logic.

**Incorrect (multiple useState for interdependent state):**

```tsx
function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [step, setStep] = useState(1);

  async function handleSubmit() {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setError(undefined);
    try {
      await submitOrder();
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  }
}
```

**Correct (useReducer for interdependent state):**

```tsx
type CheckoutState = {
  isSubmitting: boolean;
  isFormValid: boolean;
  error: string | undefined;
  step: number;
};

type CheckoutAction =
  | { type: "SUBMIT" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "SET_FORM_VALID"; isValid: boolean };

const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case "SUBMIT":
      return { ...state, isSubmitting: true, error: undefined };
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false, step: 2 };
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, error: action.error };
    case "SET_FORM_VALID":
      return { ...state, isFormValid: action.isValid };
    default:
      return state;
  }
};

function CheckoutForm() {
  const [state, dispatch] = useReducer(checkoutReducer, {
    isSubmitting: false,
    isFormValid: false,
    error: undefined,
    step: 1,
  });
}
```

**Correct (useState for simple independent state):**

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
```

### 2.2 No Context for Runtime-Updating State

**Impact: HIGH (Context re-renders all consumers on every update, causing performance problems)**

React Context is acceptable only for truly static or readonly data that does not change during the app lifecycle at runtime. When a Context value updates, **all consumers re-render**, even if they only use a subset of the value.

**Acceptable uses of Context:** Theme configuration that loads once and never changes. Feature flags loaded at app startup. Locale/language that changes rarely. Authenticated user info that doesn't change within a session.

**Unacceptable uses of Context:** Cart count, notification counts, or any frequently-updating value. Form state shared across components. Any state where `setContext` or `setState` on the provider is called after initial load. Real-time data.

**Incorrect (Context for runtime-updating state):**

```tsx
const CartContext = createContext<CartContext | null>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const addItem = (item: CartItem) => setItems([...items, item]);

  return <CartContext.Provider value={{ items, addItem }}>{children}</CartContext.Provider>;
}

// Every component that calls useCart() re-renders when ANY item changes
function Header() {
  const { items } = useContext(CartContext);
  return <div>Cart: {items.length}</div>;
}
```

**Correct (Zustand/Jotai for runtime-updating state — per ferrousaurus-stack-preferences):**

```tsx
const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

function Header() {
  const itemCount = useCartStore((state) => state.items.length);
  return <div>Cart: {itemCount}</div>;
}
```

### 2.3 Switch to Store After 1-2 Intermediate Props

**Impact: HIGH (prop drilling through unused intermediates creates fragile, hard-to-refactor code)**

When a prop passes through more than 1-2 intermediate components that don't use it, reach for a state store (Zustand or Jotai, per ferrousaurus-stack-preferences) or restructure with slot composition.

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

function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle</button>;
}
```

**Correct (Zustand store):**

```tsx
const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));

function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  return <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Toggle</button>;
}
```

### 2.4 Use key Prop to Reset State, Not useEffect

**Impact: HIGH (key-based reset is immediate and avoids cascading re-renders)**

When a component's state needs to reset in response to a prop change (e.g., switching user profiles), use the `key` prop to unmount and remount the component. Never use `useEffect` to reset state in response to prop changes — it causes an extra render with stale state.

**Incorrect (useEffect to reset state on prop change):**

```tsx
function ProfileEditor({ userId }: ProfileEditorProps) {
  const [draft, setDraft] = useState("");

  // 🔴 Avoid: Resetting state in an Effect on prop change
  useEffect(() => {
    setDraft("");
  }, [userId]);

  return <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />;
}
```

**Correct (key to reset all state):**

```tsx
function ProfilePage({ userId }: ProfilePageProps) {
  return <ProfileEditor key={userId} userId={userId} />;
}

function ProfileEditor({ userId }: ProfileEditorProps) {
  const [draft, setDraft] = useState("");
  // When userId changes, the key change unmounts and remounts, resetting all state
  return <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />;
}
```

When you need to reset only some state (not all), adjust state during render rather than in an Effect. But prefer the `key` approach whenever possible.

### 2.5 useRef Only for DOM References and Non-Rendering Instance Values

**Impact: HIGH (using useRef as state replacement causes silent bugs — updates don't trigger re-renders)**

`useRef` is for values that should persist across renders without triggering a re-render when they change. If a value change should update the UI, use `useState` or `useReducer` instead.

**Acceptable uses:** DOM element references, timer IDs, previous values that don't affect rendering, tracking whether a component is mounted, instance values that must persist across renders but never drive rendering.

**Unacceptable uses:** Storing values that affect what's rendered (use `useState` or `useReducer`). Replacing state to "avoid re-renders" (this is a bug, not an optimization). Caching computed values that affect the UI (use `useMemo`).

**Incorrect (useRef as state replacement):**

```tsx
function SearchResults({ query }: SearchResultsProps) {
  const resultsRef = useRef<SearchResult[]>([]);
  const isSearchingRef = useRef(false);

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
    setIsSearching(true);
    const data = await fetchResults(query);
    setResults(data);
  }

  return <div>{results.length} results</div>;
}
```

---

## 3. Effects & Lifecycle

**Impact: HIGH**

Restricting useEffect to its intended purpose: synchronizing with external systems. Derived state is computed during render, data fetching uses TanStack Query, and external store subscriptions use useSyncExternalStore. Following React's "You Might Not Need an Effect" guidance eliminates cascading renders, race conditions, and stale data bugs.

### 3.1 useEffect Only for Synchronizing with External Systems

**Impact: HIGH (misused effects cause cascading renders, race conditions, and stale data)**

`useEffect` is an escape hatch for synchronizing React components with external systems: third-party widgets, browser APIs, network subscriptions, DOM measurements. It is not a general-purpose lifecycle hook.

**When useEffect IS appropriate:** Subscribing to a WebSocket or event source. Synchronizing with a third-party imperative library. Measuring DOM layout. Sending analytics on mount. Any side effect that runs _because the component was displayed_.

**When useEffect is NOT appropriate:** Deriving state from props or state (calculate during render). Caching expensive computations (use `useMemo`). Resetting state on prop change (use `key`). Fetching data (use TanStack Query). Responding to user events (use event handlers). Notifying parent of state changes (call callback in same handler).

**Incorrect (deriving state in an effect):**

```tsx
function SearchResults({ query }: SearchResultsProps) {
  const [filteredResults, setFilteredResults] = useState([]);

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

**Incorrect (responding to user events in an effect):**

```tsx
function ProductPage({ product, onAddToCart }: ProductPageProps) {
  const [isAdded, setIsAdded] = useState(false);

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

### 3.2 No useEffect for Derived State

**Impact: HIGH (Effect-based derived state causes cascading renders with stale intermediate values)**

Never use `useEffect` to compute values that can be derived from existing props or state. If you can calculate a value from what's already available during render, do it directly in the component body. Use `useMemo` for expensive derivations.

**Incorrect (useEffect to sync state):**

```tsx
function TodoList({ todos, filter }: TodoListProps) {
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(todos.filter((todo) => !todo.completed && todo.text.includes(filter)));
  }, [todos, filter]);

  return (
    <ul>
      {visibleTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

**Correct (calculate during render):**

```tsx
function TodoList({ todos, filter }: TodoListProps) {
  const visibleTodos = todos.filter((todo) => !todo.completed && todo.text.includes(filter));
  return (
    <ul>
      {visibleTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

**Correct (useMemo for expensive derivation):**

```tsx
function TodoList({ todos, filter }: TodoListProps) {
  const visibleTodos = useMemo(
    () => todos.filter((todo) => !todo.completed && todo.text.includes(filter)),
    [todos, filter],
  );
  return (
    <ul>
      {visibleTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

| Pattern                 | Incorrect                                          | Correct                                                 |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------------- |
| Combine first/last name | `useEffect(() => setFullName(first + ' ' + last))` | `const fullName = first + ' ' + last`                   |
| Filter a list           | `useEffect(() => setFiltered(items.filter(...)))`  | `const filtered = items.filter(...)`                    |
| Expensive computation   | `useEffect(() => setResult(expensive(data)))`      | `const result = useMemo(() => expensive(data), [data])` |

### 3.3 Always Use TanStack Query for Server State

**Impact: HIGH (useEffect+useState fetching causes race conditions, stale data, and boilerplate)**

All server state flows through TanStack Query. Never use `useEffect` + `useState` for data fetching. TanStack Query handles caching, background refetching, stale-while-revalidate, deduplication, and race conditions — all of which you'd have to implement manually.

**Incorrect (useEffect + useState for fetching):**

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}
```

### 3.4 Always Use useSyncExternalStore for External Subscriptions

**Impact: HIGH (manual useEffect subscriptions miss concurrent rendering edge cases)**

When subscribing to an external data source, always use `useSyncExternalStore` or a library-provided hook that wraps it. Never write manual `useEffect`-based subscriptions to external data sources.

**Incorrect (manual useEffect subscription):**

```tsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }
    updateState();
    window.addEventListener("online", updateState);
    window.addEventListener("offline", updateState);
    return () => {
      window.removeEventListener("online", updateState);
      window.removeEventListener("offline", updateState);
    };
  }, []);

  return isOnline;
}
```

**Correct (useSyncExternalStore):**

```tsx
function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
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

Most library hooks (Zustand's `useStore`, Jotai's `useAtom`, TanStack Query's `useQuery`) already wrap `useSyncExternalStore`. You only need to write it directly for browser APIs or custom stores.

---

## 4. Data Fetching

**Impact: HIGH**

All server state flows through TanStack Query. No useEffect+useState fetching patterns, ever. Components call data-fetching hooks directly where the data is needed, relying on TanStack Query's deduplication by queryKey.

### 4.1 Always Use TanStack Query for Server State

See [Section 3.3](#33-always-use-tanstack-query-for-server-state) — this rule is in both the Effects and Data Fetching categories because it replaces both `useEffect` for fetching and establishes the data fetching pattern.

### 4.2 Fetch Data Where It's Needed — Colocation Over Hoisting

**Impact: HIGH (colocation simplifies data flow; TanStack Query deduplicates identical queryKeys)**

Call data-fetching hooks directly in the component that needs the data. Do not hoist fetching to a parent component just to pass data down as props. TanStack Query deduplicates requests by queryKey, so multiple components requesting the same data will not issue duplicate network requests.

**Incorrect (hoisting data fetching to parent and drilling):**

```tsx
function Dashboard() {
  const { data: user } = useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });
  const { data: notifications } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });

  return (
    <div>
      <UserProfile user={user} />
      <NotificationList notifications={notifications} />
    </div>
  );
}
```

**Correct (fetch where needed):**

```tsx
function Dashboard() {
  return (
    <div>
      <UserProfile userId={userId} />
      <NotificationList />
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
```

---

## 5. Composition & Props

**Impact: MEDIUM**

Component composition patterns: slot props over compound components, React.ReactNode for children, controlled inputs by default, error boundaries at route and feature boundaries, and Fragment conventions. These rules create consistent, predictable component APIs.

### 5.1 Slot Props Over Compound Components

**Impact: MEDIUM (explicit slot props make data flow visible and components easy to compose)**

Prefer explicit slot props for component composition. Compound component patterns make data flow invisible and harder to trace. Render props are acceptable when they're clearly the right tool.

**Slot props (preferred):**

```tsx
<Tabs
  list={
    <Tabs.List>
      <Tab>Profile</Tab>
      <Tab>Settings</Tab>
    </Tabs.List>
  }
  panels={
    <Tabs.Panels>
      <TabPanel>
        <Profile />
      </TabPanel>
      <TabPanel>
        <Settings />
      </TabPanel>
    </Tabs.Panels>
  }
/>
```

The parent `Tabs` component manages active tab state, but the consumer controls what's rendered in each slot. Data flow is explicit.

**Compound components (avoid by default):**

```tsx
// ❌ Avoid: Implicit state sharing via context
<Tabs>
  <TabList>
    <Tab>Profile</Tab>
    <Tab>Settings</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Profile />
    </TabPanel>
    <TabPanel>
      <Settings />
    </TabPanel>
  </TabPanels>
</Tabs>
```

**Render props (acceptable when clearly needed):**

```tsx
<DataList query={usersQuery} renderItem={(user) => <UserRow user={user} />} />
```

This is acceptable because `DataList` manages fetching logic while the consumer controls rendering.

Compound components may be acceptable when: using third-party libraries that mandate the pattern (e.g., Mantine's `Tabs`), deeply nested structures where slot props become unwieldy, or when the component API is defined by a design system you don't control.

### 5.2 Type children as React.ReactNode

**Impact: MEDIUM (React.ReactNode covers all renderable output)**

When a component accepts `children`, type it as `React.ReactNode`. This is the broadest correct type, covering all renderable output: `null`, `undefined`, `string`, `number`, `ReactElement`, `Fragment`, and arrays.

**Incorrect (too narrow):**

```tsx
type LayoutProps = {
  children: React.ReactElement; // ❌ Rejects strings, numbers, fragments, null
};
```

**Correct:**

```tsx
export type LayoutProps = {
  children: React.ReactNode;
};
```

If a component doesn't use `children`, don't include it in the props type at all.

### 5.3 Controlled Inputs by Default, Aligned with Component Library

**Impact: MEDIUM (controlled/uncontrolled depends on component and form library)**

The choice between controlled and uncontrolled inputs depends on the component library and form library in use. With Mantine (controlled-by-default) and TanStack Form (manages its own state), controlled inputs are the default.

**Controlled inputs** for: Mantine components, real-time validation, cross-field dependencies, form-managed state.

**Uncontrolled inputs** (with `useRef`) for: file inputs, truly fire-and-forget inputs, or when TanStack Form operates in uncontrolled mode.

With TanStack Form, let it manage field state internally. Don't layer `useState` on top.

### 5.4 Error Boundaries at Route and Feature Boundaries

**Impact: MEDIUM (error boundaries prevent cascading failures but should be placed based on UX needs)**

Place error boundaries at two levels:

**Route-level error boundaries (default):** Every page/route should have an error boundary. If a route crashes, the user sees an error page instead of a blank screen.

**Feature-level error boundaries (UX-dependent):** Wrap isolated features in their own error boundaries when UX demands that their failure not affect the surrounding page. Examples: chat widgets, third-party embeds, independent dashboard panels.

Error boundaries do **not** catch: errors in event handlers (use `try/catch`), errors in async code (use TanStack Query's error handling), or errors in SSR (use the framework's error handling).

### 5.5 Prefer Short Fragment Syntax

**Impact: MEDIUM (consistent fragment style reduces noise)**

Use `<></>` for unkeyed fragments. Only use `<Fragment key={...}>` when keyed fragments are needed. Never use `<React.Fragment>`.

```tsx
// Unkeyed — use short syntax
<>
  <h2>{title}</h2>
  <p>{description}</p>
</>;

// Keyed — use Fragment with key
{
  items.map((item) => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  ));
}
```

---

## 6. Hooks

**Impact: MEDIUM**

Custom hook conventions (use prefix, return shape, single-purpose, no JSX returns) and strict memoization policy (useMemo, useCallback, React.memo only with measured evidence). Hooks are the primary extension point for React logic, so consistent conventions are essential.

### 6.1 Custom Hook Conventions

**Impact: MEDIUM (consistent hook APIs make custom hooks predictable and composable)**

1. **Prefix with `use`** — Every custom hook starts with `use`. Required by the Rules of Hooks.
2. **Named export, no default** — Custom hooks are always named exports.
3. **Return values**: tuple for ≤2 values, named object for 3+.
4. **Single-purpose** — Each hook does one thing.
5. **No conditional calls** — Never call hooks inside conditions, loops, or `try/catch`.
6. **No JSX returns** — Custom hooks return data and actions, not JSX.

**Incorrect (kitchen-sink hook with JSX return):**

```tsx
function useApp() {
  const user = useAuth();
  const notifications = useNotifications();
  return { user, notifications, renderHeader: () => <Header user={user} /> };
}
```

**Correct (single-purpose, proper return shape):**

```tsx
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function login(credentials: Credentials) {
    /* ... */
  }
  function logout() {
    setUser(null);
  }

  return { user, isLoading, error, login, logout };
}

function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
```

### 6.2 Memoize Sparingly — Only With Measured Evidence

**Impact: MEDIUM (premature memoization adds complexity without proven benefit)**

Do not use `useMemo`, `useCallback`, or `React.memo` by default. Reach for memoization only when:

1. You've measured a performance problem
2. You're passing callbacks to a memoized child component

**useMemo**: only for genuinely expensive computations (measured, not assumed).

**useCallback**: only when passing callbacks to a child wrapped in `React.memo`.

**React.memo**: only when you've measured unnecessary re-renders that cause a visible performance problem.

A better strategy than memoization is often component extraction — splitting the expensive part so it doesn't re-render when the cheap part changes.

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
```

---

## 7. Conditional Rendering

**Impact: MEDIUM**

Early returns for null/error states, banned nested ternaries in JSX, and clear patterns for && vs. ternary. Aligned with the TypeScript skill's control flow rules, adapted for JSX rendering.

### 7.1 Early Returns for Null and Error States

**Impact: MEDIUM (early returns flatten component logic and make the happy path prominent)**

Use early returns for null checks, loading states, and error states before the main render. This aligns with the TypeScript skill's `control-early-return` rule.

**Incorrect (nested conditionals for guard clauses):**

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (!isLoading) {
    if (!error) {
      if (user) {
        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        );
      }
      return <EmptyState />;
    }
    return <ErrorMessage error={error} />;
  }
  return <Spinner />;
}
```

**Correct (early returns, flat structure):**

```tsx
function UserProfile({ userId }: UserProfileProps) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <EmptyState />;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

Order of early returns: loading states → error states → empty/null states → happy path.

### 7.2 No Nested Ternaries in JSX

**Impact: MEDIUM (nested ternaries are unreadable in JSX)**

Never nest ternary expressions in JSX. Extract to a function with early returns or use an object map for static value mappings.

**Incorrect (nested ternaries in JSX):**

```tsx
function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={status === "active" ? "badge-green" : status === "pending" ? "badge-yellow" : "badge-red"}>
      {status === "active" ? "Active" : status === "pending" ? "Pending" : "Inactive"}
    </span>
  );
}
```

**Correct (object map for static value mapping):**

```tsx
const BADGE_STYLES: Record<Status, string> = {
  active: "badge-green",
  pending: "badge-yellow",
  inactive: "badge-red",
};

const BADGE_LABELS: Record<Status, string> = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={BADGE_STYLES[status]}>{BADGE_LABELS[status]}</span>
);
```

A single ternary for either/or rendering is acceptable: `return isLoading ? <Spinner /> : <Content />;`

### 7.3 Use && for Boolean Conditions, Ternary for Either/Or

**Impact: MEDIUM (consistent conditional rendering patterns make JSX predictable)**

Use `&&` for conditional rendering when something is either shown or hidden. Use `? :` when rendering one of two different elements. Beware of `0` with `&&` — always ensure the left side is a boolean.

**Correct patterns:**

```tsx
// && for show/hide
{
  isLoggedIn && <UserMenu />;
}
{
  items.length > 0 && <ItemList items={items} />;
}

// Ternary for either/or
return isLoading ? <Spinner /> : <UserList users={users} />;
```

**Beware of 0:**

```tsx
// ❌ Renders "0" when items.length is 0
{
  items.length && <ItemList items={items} />;
}

// ✅ Correct: boolean on the left side
{
  items.length > 0 && <ItemList items={items} />;
}
```

| Pattern                     | Use When                                     |
| --------------------------- | -------------------------------------------- |
| `condition && <Element />`  | Show or hide a single element                |
| `condition ? <A /> : <B />` | Render one of two different elements         |
| Early return                | Guard clauses, loading/error/empty states    |
| Extracted function          | Complex conditional logic, multiple branches |
| Object map                  | Static mapping from value to element/class   |

---

## 8. File Organization

**Impact: LOW**

Type-based directories and PascalCase component filenames. A deliberate departure from the TypeScript skill's flat-by-feature convention, optimized for React projects where component hierarchy and hook reuse follow type-based patterns.

### 8.1 Type-Based Directories for React Projects

**Impact: LOW (predictable file location by category)**

Organize React project files by type in dedicated directories:

```
src/
  components/
    UserProfile.tsx
    UserList.tsx
    SearchInput.tsx
    Layout.tsx
  hooks/
    useAuth.ts
    useDebounce.ts
    useUserQuery.ts
  utils/
    formatDate.ts
    calculateTotal.ts
  types/
    user.ts
    api.ts
    common.ts
  pages/
    Dashboard.tsx
    Settings.tsx
```

If a directory grows past ~20 files, group by feature domain within the type directory:

```
src/
  components/
    user/
      UserProfile.tsx
      UserList.tsx
    order/
      OrderDetail.tsx
      OrderList.tsx
```

The primary organization is by type, not by feature.

### 8.2 PascalCase for Component Files, camelCase for Non-Components

**Impact: LOW (component files match their default export; non-components follow TypeScript convention)**

Component files use PascalCase, matching the name of their default export. Non-component files (hooks, utils, types) follow the TypeScript skill's camelCase convention.

```
UserProfile.tsx    → exports default function UserProfile
SearchInput.tsx    → exports default const SearchInput = ...
useAuth.ts         → exports function useAuth
formatDate.ts      → exports const formatDate
user.ts            → exports type User
```

This is a deliberate departure from the TypeScript skill's `module-file-naming` rule (which uses camelCase for all files). React developers expect to find a component by its name — when you see `<UserProfile />`, you should be able to find `UserProfile.tsx` in `components/`.

---

## Deliberate Departures from TypeScript Best Practices

This skill deliberately differs from ferrousaurus-typescript-best-practices in two areas:

1. **File organization**: React projects use type-based directories (`components/`, `hooks/`, `utils/`) instead of flat-by-feature. React components, hooks, and utilities have different lifecycles and are found by different mental models.

2. **File naming**: React component files use PascalCase (matching their export name, e.g., `UserProfile.tsx`) instead of camelCase. Non-component files still follow camelCase.

---

## Companion Skills

- **ferrousaurus-stack-preferences** — Library choices (Zustand/Jotai, TanStack Query, Mantine, etc.) referenced in state management and data fetching rules
- **ferrousaurus-typescript-best-practices** — TypeScript syntax conventions (type over interface, arrow vs. declaration, const by default, etc.) that apply inside `.tsx` files as well
