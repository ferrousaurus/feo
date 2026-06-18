---
title: Use Switch with Braces for Complex Branching
impact: MEDIUM
impactDescription: Switch with braces is explicit and prevents scope bugs
tags: control, switch, braces, branching
---

## Use Switch with Braces for Complex Branching

**Impact: MEDIUM (switch with braces is explicit and prevents scope bugs)**

When logic per branch is too complex for an object map, use a `switch` statement. Always wrap each `case` in braces `{ }` to create a block scope. This prevents variable name collisions and makes each branch visually distinct.

**Incorrect (switch without braces):**

```typescript
switch (status) {
  case "active":
    const message = "Account active";
    sendNotification(message);
    break;
  case "pending":
    const message = "Pending verification"; // Error: Cannot redeclare block-scoped variable
    sendNotification(message);
    break;
}
```

**Correct (switch with braces):**

```typescript
switch (status) {
  case "active": {
    const message = "Account active";
    sendNotification(message);
    break;
  }
  case "pending": {
    const message = "Pending verification";
    sendNotification(message);
    break;
  }
  default: {
    const message = "Unknown status";
    logWarning(message);
  }
}
```

Braces give each `case` its own scope, preventing variable redeclaration errors and making the code structure explicit. Always include a `default` case.
