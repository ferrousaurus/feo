---
title: Error Boundaries at Route and Feature Boundaries
impact: MEDIUM
impactDescription: Error boundaries prevent cascading failures but should be placed based on UX needs
tags: react, composition, error, boundary, error boundary
---

## Error Boundaries at Route and Feature Boundaries

**Impact: MEDIUM (error boundaries prevent cascading failures but should be placed based on UX needs)**

Place error boundaries at two levels: route boundaries (the default) and feature boundaries (for isolated components whose failure shouldn't take down the parent).

### Route-level error boundaries (default)

Every page/route should have an error boundary. If a route crashes, the user sees an error page instead of a blank screen or a cascading crash.

```tsx
function AppRoutes() {
  return (
    <ErrorBoundary fallback={<RouteErrorPage />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ErrorBoundary>
  );
}
```

### Feature-level error boundaries (UX-dependent)

Wrap isolated features in their own error boundaries when UX demands that their failure not affect the surrounding page. Use your judgment based on the user experience:

- A chat widget embedded in a dashboard should have its own error boundary — its crash shouldn't destroy the dashboard
- A third-party embed (map, video player, analytics widget) should be isolated — its failure shouldn't affect the page
- A complex interactive panel that's independent from the rest of the page

```tsx
function Dashboard() {
  return (
    <div>
      <StatsPanel />
      <ErrorBoundary fallback={<ChatError />}>
        <ChatWidget />
      </ErrorBoundary>
      <RecentActivity />
    </div>
  );
}
```

### What error boundaries don't catch

Error boundaries only catch errors during rendering, lifecycle methods, and constructors. They do **not** catch:

- Errors in event handlers (handle these with `try/catch`)
- Errors in async code (use TanStack Query's error handling)
- Errors in server-side rendering (use the framework's error handling)

```tsx
function SubmitButton() {
  const mutation = useMutation({ mutationFn: submitForm });

  function handleClick() {
    // ✅ Handle errors in event handlers, not error boundaries
    mutation.mutate(formData);
  }

  if (mutation.isError) {
    return <ErrorMessage error={mutation.error} />;
  }

  return <button onClick={handleClick}>Submit</button>;
}
```

### Cross-References

- Stack Preferences: SSR Library (TanStack Start Go-To)
- Related: [data-tanstack-query-only.md](./data-tanstack-query-only.md)