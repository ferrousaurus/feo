---
title: Controlled Inputs by Default, Aligned with Component Library
impact: MEDIUM
impactDescription: The choice between controlled and uncontrolled depends on the component and form library in use
tags: react, composition, controlled, uncontrolled, forms, mantine
---

## Controlled Inputs by Default, Aligned with Component Library

**Impact: MEDIUM (controlled/uncontrolled depends on component and form library)**

The choice between controlled and uncontrolled inputs depends on the component library and form library in use. The stack preferences specify Mantine for components and TanStack Form for forms, both of which favor controlled inputs.

### Controlled inputs (default)

Use controlled inputs when:

- Using Mantine components (they're controlled-by-default)
- The input value needs to be validated in real-time
- The input value affects other UI (cross-field dependencies, conditional rendering)
- The form library manages the state (TanStack Form)

```tsx
function SearchInput() {
  const [query, setQuery] = useState("");

  return <TextInput label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Uncontrolled inputs (specific cases)

Use uncontrolled inputs (with `useRef`) when:

- Using `<input type="file" />` — file inputs cannot be meaningfully controlled
- The input value is never read or validated — truly fire-and-forget
- The form library uses uncontrolled fields internally (TanStack Form can operate in uncontrolled mode for performance)

```tsx
function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    const file = fileInputRef.current?.files?.[0];
    if (file) uploadFile(file);
  }

  return <input ref={fileInputRef} type="file" />;
}
```

### With TanStack Form

TanStack Form manages field state internally. From React's perspective, form fields are uncontrolled — TanStack Form handles the state. Let it do so. Don't layer `useState` on top of TanStack Form's field state.

```tsx
function LoginForm() {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => login(value),
  });

  return (
    <form.Provider>
      <form>
        <form.Field name="email" validators={{ onChange: emailValidator }}>
          {(field) => <TextInput label="Email" value={field.state.value} onChange={field.handleChange} />}
        </form.Field>
        <button type="submit">Log in</button>
      </form>
    </form.Provider>
  );
}
```

### Cross-References

- Stack Preferences: Component Library (Mantine Go-To), Form Library (TanStack Form Go-To)
- Related: [state-use-ref-only.md](./state-use-ref-only.md)
