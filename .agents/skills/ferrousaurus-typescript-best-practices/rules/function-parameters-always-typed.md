---
title: All Function Parameters Must Be Explicitly Typed
impact: HIGH
impactDescription: Explicit types make contracts clear and catch errors at call sites
tags: function, parameters, typing, explicit
---

## All Function Parameters Must Be Explicitly Typed

**Impact: HIGH (explicit types make contracts clear and catch errors at call sites)**

Every parameter in a function declaration must have an explicit type annotation. Never rely on TypeScript to infer parameter types, even in callbacks where inference is possible.

For generic functions, use descriptive generic type parameters (e.g., `TInput`, `TOutput`) rather than single letters.

**Incorrect (inferred callback parameter types):**

```typescript
items.filter((item) => item.active);
```

**Incorrect (untyped parameters):**

```typescript
function process(data) {
  return data.map((x) => x.value);
}
```

**Correct (explicit parameter types):**

```typescript
items.filter((item: Item) => item.active);
```

**Correct (explicit types on standalone functions):**

```typescript
const process = (data: Data[]) =>
  data.map((x: Data) => x.value);
```

**Correct (generic with descriptive names):**

```typescript
const mapItems = <TInput, TOutput>(
  items: TInput[],
  transform: (item: TInput) => TOutput,
) => items.map(transform);
```