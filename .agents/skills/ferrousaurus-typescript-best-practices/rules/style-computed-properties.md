---
title: Computed Property Keys Are Acceptable
impact: LOW
impactDescription: Computed properties enable dynamic, type-safe object creation
tags: style, computed, property, dynamic
---

## Computed Property Keys Are Acceptable

**Impact: LOW (computed properties enable dynamic, type-safe object creation)**

Computed property keys (`{ [key]: value }`) are acceptable and useful for creating objects with dynamic property names. They are type-safe and more concise than building objects imperatively.

**Incorrect (imperative object building):**

```typescript
const config: Record<string, string> = {};
for (const key of Object.keys(source)) {
  config[key.toUpperCase()] = source[key];
}
```

**Correct (computed property keys):**

```typescript
const config = Object.fromEntries(
  Object.entries(source).map(([key, value]: [string, string]) => [
    key.toUpperCase(),
    value,
  ]),
);
```

**Correct (computed property in object literal):**

```typescript
const eventType = `click`;
const handler = { [eventType]: (e: Event) => logEvent(e) };
```

Computed properties are a TypeScript feature, not a code smell. Use them when property names are determined at runtime.