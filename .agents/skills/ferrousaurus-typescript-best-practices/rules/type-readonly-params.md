---
title: Use Readonly for Unmutated Parameters
impact: MEDIUM
impactDescription: Communicates intent and prevents accidental mutation
tags: type, readonly, immutable, parameters
---

## Use Readonly for Unmutated Parameters

**Impact: MEDIUM (communicates intent and prevents accidental mutation)**

Use `Readonly<T>` for object parameters and `readonly T[]` for array parameters that the function does not mutate. Do not mark individual properties as `readonly` on type definitions — use `Readonly<T>` at the parameter level instead.

**Incorrect (no readonly on parameters):**

```typescript
const processItems = (items: string[]) => {
  return items.toSorted();
};

const updateConfig = (config: Config) => {
  return { ...config, updatedAt: Date.now() };
};
```

**Incorrect (readonly on individual properties):**

```typescript
type Config = {
  readonly port: number;
  readonly host: string;
};
```

**Correct (Readonly and readonly array on parameters):**

```typescript
const processItems = (items: readonly string[]) => {
  return items.toSorted();
};

const updateConfig = (config: Readonly<Config>) => {
  return { ...config, updatedAt: Date.now() };
};
```

This makes the contract clear at the function signature: the caller's data won't be modified. `Readonly<T>` and `readonly T[]` on parameters signal "I won't mutate your data" without cluttering the type definition.
