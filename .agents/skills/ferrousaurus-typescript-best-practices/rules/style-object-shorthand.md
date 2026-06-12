---
title: Use Object Shorthand When Key Matches Variable Name
impact: LOW
impactDescription: Reduces duplication and makes code more concise
tags: style, object, shorthand, property
---

## Use Object Shorthand When Key Matches Variable Name

**Impact: LOW (reduces duplication and makes code more concise)**

Use object shorthand `{ name }` instead of `{ name: name }` when the property key matches the variable name. This reduces duplication and makes the intent clear.

**Incorrect (redundant key-value):**

```typescript
const user = { name: name, email: email };
const params = { record: record, options: options };
```

**Correct (object shorthand):**

```typescript
const user = { name, email };
const params = { record, options };
```

Use shorthand when the key and value share the same name. Keep the full form when they differ:

```typescript
const user = { name, email, isActive: active };
```