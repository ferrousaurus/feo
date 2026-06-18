---
title: Required Positional Params Then Options Object
impact: MEDIUM
impactDescription: Makes function signatures scannable and extensible
tags: function, parameters, options, signature
---

## Required Positional Params Then Options Object

**Impact: MEDIUM (makes function signatures scannable and extensible)**

When a function takes multiple parameters, place required positional parameters first, then an options object for optional or configuration parameters. This makes call sites readable and allows adding new options without breaking changes.

Always extract the options object type to a named `type` rather than inlining it.

**Incorrect (many positional parameters):**

```typescript
function saveToDatabase(record: Record, options: SaveOptions, userId: string) {
  // ...
}

saveToDatabase(record, { upsert: true }, "user-123");
```

**Incorrect (inlined options type):**

```typescript
const saveToDatabase = (record: Record, params: { options: SaveOptions; userId: string }) => {
  // ...
};
```

**Correct (required positional, then options object with extracted type):**

```typescript
type SaveToDatabaseParams = {
  options: SaveOptions;
  userId: string;
};

async function saveToDatabase(record: Record, params: SaveToDatabaseParams) {
  // ...
}

saveToDatabase(record, { options: { upsert: true }, userId: "user-123" });
```

This pattern scales well. Adding a new optional parameter only requires updating the type and the implementation, not every call site.
