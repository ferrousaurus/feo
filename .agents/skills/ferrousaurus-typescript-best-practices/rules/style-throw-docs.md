---
title: Document Thrown Errors with @throws JSDoc
impact: LOW
impactDescription: Makes error contracts visible in the type system
tags: style, jsdoc, throws, error, documentation
---

## Document Thrown Errors with @throws JSDoc

**Impact: LOW (makes error contracts visible in the type system)**

When a function throws an error, document it with `@throws` in JSDoc. TypeScript doesn't have built-in checked exceptions, so `@throws` is the only way to make a function's error contract visible to callers.

**Incorrect (undocumented thrown errors):**

```typescript
async function deleteUser(id: string) {
  const session = await verifySession();
  if (!session) {
    throw new UnauthorizedError(`Must be logged in`);
  }
  await db.user.delete({ where: { id } });
}
```

**Correct (documented with @throws):**

```typescript
/**
 * Deletes a user by ID.
 *
 * @throws {UnauthorizedError} When the user is not authenticated
 * @throws {NotFoundError} When the user ID does not exist
 */
async function deleteUser(id: string) {
  const session = await verifySession();
  if (!session) {
    throw new UnauthorizedError(`Must be logged in`);
  }
  await db.user.delete({ where: { id } });
}
```

`@throws` makes errors discoverable:

- IDE hover shows what errors a function can throw
- Callers know what to handle without reading the implementation
- Error handling can be systematic rather than reactive
