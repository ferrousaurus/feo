---
title: Metaframework-Aware Server/Client Component Boundary
impact: HIGH
impactDescription: Wrong boundary choices cause unnecessary client JS or broken interactivity
tags: react, component, server, client, rsc, tanstack-start, nextjs
---

## Metaframework-Aware Server/Client Component Boundary

**Impact: HIGH (wrong boundary choices cause unnecessary client JS or broken interactivity)**

The server/client component boundary depends on the metaframework in use. There is no one-size-fits-all rule — the correct pattern depends on which framework you're using.

### TanStack Start

TanStack Start uses **server functions**, not React Server Components. Components are client-rendered by default. Server functions are called explicitly for data mutations and server-side logic. Do not try to use RSC patterns in TanStack Start.

**Correct (TanStack Start — server functions for mutations):**

```tsx
export default function UserProfile({ userId }: UserProfileProps) {
  const { data } = useUserQuery(userId);

  async function handleSave(formData: FormData) {
    await updateUserMutation(formData);
  }

  return <Form onSubmit={handleSave}>...</Form>;
}
```

### Next.js (App Router)

Next.js is built around React Server Components. Default to server components. Only add `'use client'` when a component needs interactivity (useState, useEffect, event handlers). Keep client components small and at the leaf level.

**Correct (Next.js — server component by default):**

```tsx
// This component has no hooks or event handlers — it's a server component
export default function UserProfile({ userId }: UserProfileProps) {
  const user = await getUser(userId);

  return (
    <div>
      <h1>{user.name}</h1>
      <UserActions userId={userId} />
    </div>
  );
}
```

```tsx
"use client";

// Only this interactive leaf is a client component
export default function UserActions({ userId }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>;
}
```

### General Principle

Regardless of framework: push interactivity to the edges. The more logic that runs on the server, the less JavaScript shipped to the client. Only components that need hooks or event handlers should be client components.

### Cross-References

- Stack Preferences: Rendering Library (React), SSR Library (TanStack Start), Routing Library (TanStack Router)
- Related: [data-tanstack-query-only.md](./data-tanstack-query-only.md)
