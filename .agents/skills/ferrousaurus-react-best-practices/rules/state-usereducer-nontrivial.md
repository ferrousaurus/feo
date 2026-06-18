---
title: useReducer for Non-Trivial State, useState for Simple State
impact: HIGH
impactDescription: Prevents cascading setState calls and state bugs in complex components
tags: react, state, useReducer, useState
---

## useReducer for Non-Trivial State, useState for Simple State

**Impact: HIGH (prevents cascading setState calls and state bugs in complex components)**

Choose the right state primitive based on state complexity. `useState` is for simple, independent values. `useReducer` is for state with interdependent fields, complex transitions, or when multiple `setState` calls would be chained in the same handler.

### When to use useState

- Single boolean, string, or number values
- Simple toggles (`isModalOpen`, `isExpanded`)
- Independent state that doesn't affect other state

### When to use useReducer

- State fields that depend on each other (e.g., `isSubmitting` depends on `isFormValid`)
- Complex state transitions (state machines, multi-step flows)
- When a single action requires multiple `setState` calls
- Form state with validation logic

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

### Cross-References

- Related: [state-no-context-runtime.md](./state-no-context-runtime.md)
- Related: [state-key-reset.md](./state-key-reset.md)
- TS Skill: `control-switch-braces` — Switch with braces for complex branching
