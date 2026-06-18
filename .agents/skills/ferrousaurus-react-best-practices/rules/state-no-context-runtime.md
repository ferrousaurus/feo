---
title: No Context for Runtime-Updating State
impact: HIGH
impactDescription: Context re-renders all consumers on every update, causing performance problems
tags: react, state, context, zustand, jotai
---

## No Context for Runtime-Updating State

**Impact: HIGH (Context re-renders all consumers on every update, causing performance problems)**

React Context is acceptable only for truly static or readonly data that does not change during the app lifecycle at runtime. When Context value updates, **all consumers re-render**, even if they only use a subset of the value. This makes Context inappropriate for any state that updates during runtime.

### Acceptable uses of Context

- Theme configuration that loads once and never changes
- Feature flags loaded at app startup
- Locale/language that changes rarely (full page re-render is acceptable)
- Authenticated user info that doesn't change within a session
- Any value that is effectively constant after initial load

### Unacceptable uses of Context

- Cart count, notification counts, or any frequently-updating value
- Form state shared across components
- Any state where `setContext` or `setState` on the provider is called after initial load
- Real-time data (WebSocket messages, live scores, chat messages)

**Incorrect (Context for runtime-updating state):**

```tsx
type CartContext = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
};

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

With Zustand/Jotai, components subscribe to specific slices of state and only re-render when their slice changes. Context forces all consumers to re-render on any change.

### Cross-References

- Stack Preferences: Local State Mgmt (Zustand Go-To, Jotai Acceptable for many instances)
- Related: [state-no-prop-drilling.md](./state-no-prop-drilling.md)
- Related: [data-tanstack-query-only.md](./data-tanstack-query-only.md)
