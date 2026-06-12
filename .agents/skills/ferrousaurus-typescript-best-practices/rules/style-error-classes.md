---
title: Custom Error Classes Extending Error
impact: MEDIUM
impactDescription: Structured error handling enables precise catch blocks
tags: style, error, class, exception, custom
---

## Custom Error Classes Extending Error

**Impact: MEDIUM (structured error handling enables precise catch blocks)**

Create custom error classes that extend `Error` for different error types in your application. This enables precise error handling with `instanceof` checks and adds context (error codes, metadata) to errors.

**Incorrect (plain Error):**

```typescript
throw new Error(`User not found`);
throw new Error(`Invalid input`);
```

**Correct (custom error classes):**

```typescript
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = `NotFoundError`;
  }
}

class ValidationError extends Error {
  constructor(message: string, public readonly fields: string[]) {
    super(message);
    this.name = `ValidationError`;
  }
}

async function fetchUser(id: string) {
  const user = await db.find(id);
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }
  return user;
}
```

Custom errors enable type-safe catch blocks:

```typescript
try {
  await saveData(data);
} catch (error: Error) {
  if (error instanceof ValidationError) {
    // Handle validation errors specifically
    logError(error);
  } else {
    throw error;
  }
}
```

Even though we don't use classes for application code (see `function-no-classes`), custom error classes are the one exception — they're a built-in JavaScript pattern and `instanceof` requires the class hierarchy.