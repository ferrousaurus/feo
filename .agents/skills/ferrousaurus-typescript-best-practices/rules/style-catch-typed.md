---
title: Catch Errors as Error Type
impact: MEDIUM
impactDescription: Typed catch blocks enable proper error handling
tags: style, error, catch, typed
---

## Catch Errors as Error Type

**Impact: MEDIUM (typed catch blocks enable proper error handling)**

Always type catch parameter as `Error`, never as `unknown` or `any`. This ensures you have access to `message`, `name`, and `stack` properties and forces consistent error handling.

**Incorrect (untyped or unknown catch):**

```typescript
try {
  await saveData(data);
} catch (error) {
  // untyped — error is unknown by default in strict mode
  console.log(error.message); // Error: Property 'message' does not exist on type 'unknown'
}

try {
  await saveData(data);
} catch (error: any) {
  // any — loses all type safety
  console.log(error);
}
```

**Correct (catch as Error):**

```typescript
try {
  await saveData(data);
} catch (error: Error) {
  if (error instanceof ValidationError) {
    logError(error);
  } else {
    logError(error);
    throw error;
  }
}
```

When using `.catch()` (preferred over try/catch — see `async-catch-over-trycatch`):

```typescript
const user = await fetchUser(id).catch((error: Error) => {
  logError(error);
  return undefined;
});
```