---
title: Prefer Ternary for Assignment and Return
impact: MEDIUM
impactDescription: Concise conditional expressions for values
tags: control, ternary, conditional, assignment
---

## Prefer Ternary for Assignment and Return

**Impact: MEDIUM (concise conditional expressions for values)**

Use ternary expressions (`?:`) for conditional assignments and return values. Ternaries are expressions — they produce a value — which makes them more composable and concise than `if/else` for value selection.

**Incorrect (if/else for assignment):**

```typescript
let label: string;
if (isActive) {
  label = 'Active';
} else {
  label = 'Inactive';
}
```

**Correct (ternary for assignment):**

```typescript
const label = isActive ? 'Active' : 'Inactive';
```

**Correct (ternary in return):**

```typescript
return isActive ? renderActive() : renderInactive();
```

Use ternaries whenever both branches produce a value. Use early returns when only one branch matters (see `control-early-return`).