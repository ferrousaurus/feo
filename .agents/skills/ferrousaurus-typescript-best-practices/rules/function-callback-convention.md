---
title: Callbacks Follow Pure/Side-Effect Convention
impact: HIGH
impactDescription: Callbacks passed as arguments should use arrow or function declaration based on purity
tags: function, callback, pure, side-effect, convention
---

## Callbacks Follow Pure/Side-Effect Convention

**Impact: HIGH (callbacks passed as arguments should use arrow or function declaration based on purity)**

When defining callbacks — whether passed as arguments, stored in variables, or used inline — follow the same pure/side-effect convention. Pure callbacks (data transformations, filtering, mapping) use arrow syntax. Side-effecting callbacks (event handlers, I/O operations) use function declarations.

**Incorrect (function declaration for pure callback):**

```typescript
function isActive(user: User) {
  return user.status === 'active';
}
const activeUsers = users.filter(isActive);
```

**Incorrect (arrow function for side-effecting callback):**

```typescript
button.addEventListener('click', (event: MouseEvent) => {
  await saveData(formData);
  logEvent('form-submitted', { timestamp: Date.now() });
});
```

**Correct (arrow for pure callback):**

```typescript
const isActive = (user: User) => user.status === 'active';
const activeUsers = users.filter(isActive);
```

**Correct (function declaration for side-effecting callback):**

```typescript
function handleSubmit(event: MouseEvent) {
  await saveData(formData);
  logEvent('form-submitted', { timestamp: Date.now() });
}
button.addEventListener('click', handleSubmit);
```

This applies to all callback contexts: array methods, event handlers, Promise chains, and custom higher-order functions.