---
title: Multiline Objects When 2 or More Properties
impact: LOW
impactDescription: Consistent formatting for readability
tags: style, object, multiline, formatting
---

## Multiline Objects When 2 or More Properties

**Impact: LOW (consistent formatting for readability)**

Objects with 2 or more properties should be formatted across multiple lines, with each property on its own line. Single-property objects can stay on one line.

**Incorrect (2+ properties on one line):**

```typescript
const user = { name: `Alice`, email: `alice@example.com` };
```

**Correct (2+ properties multiline):**

```typescript
const user = {
  name: `Alice`,
  email: `alice@example.com`,
};
```

**Correct (single property inline):**

```typescript
const result = { value: 42 };
```

This keeps objects scannable — each property gets its own line, adding/removing a property doesn't affect other lines, and trailing commas work naturally.