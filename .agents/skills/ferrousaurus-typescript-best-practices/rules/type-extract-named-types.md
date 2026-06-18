---
title: Extract Parameter Object Types to Named type
impact: MEDIUM
impactDescription: Named types are reusable and self-documenting
tags: type, parameters, naming, extraction
---

## Extract Parameter Object Types to Named type

**Impact: MEDIUM (named types are reusable and self-documenting)**

When a function takes an options/parameter object, extract the object type to a named `type` rather than inlining it in the parameter. Named types are reusable, self-documenting, and can be exported separately.

**Incorrect (inline object type):**

```typescript
async function saveToDatabase(record: Record, params: { options: SaveOptions; userId: string; validate: boolean }) {
  // ...
}
```

**Correct (named extracted type):**

```typescript
type SaveToDatabaseParams = {
  options: SaveOptions;
  userId: string;
  validate: boolean;
};

async function saveToDatabase(record: Record, params: SaveToDatabaseParams) {
  // ...
}
```

Named types can be:

- Exported for use in other modules
- Referenced in JSDoc
- Composed with other types via intersection or union
- Used as type arguments for generic functions
