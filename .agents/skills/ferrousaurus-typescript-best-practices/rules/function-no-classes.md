---
title: Never Use Classes — Prefer Functions and Closures
impact: HIGH
impactDescription: Eliminates this binding issues and favors functional composition
tags: function, class, closure, oop, functional
---

## Never Use Classes — Prefer Functions and Closures

**Impact: HIGH (eliminates `this` binding issues and favors functional composition)**

Use plain functions and closures instead of classes. Classes introduce `this` binding confusion, implicit mutation, and ceremony that plain functions avoid. Closures naturally encapsulate state without the pitfalls of class-based `this`.

**Incorrect (class with `this` binding issues):**

```typescript
class UserRepository {
  constructor(private db: Database) {}

  async findById(id: string) {
    return this.db.findUnique({ where: { id } });
  }
}

const repo = new UserRepository(db);
const find = repo.findById;
find('123'); // TypeError: cannot read properties of undefined
```

**Correct (closure — no `this`, no binding issues):**

```typescript
const createUserRepository = (db: Database) => ({
  findById: async (id: string) => db.findUnique({ where: { id } }),
});

const repo = createUserRepository(db);
const find = repo.findById;
find('123'); // works correctly
```

Closures also make the pure/side-effect distinction clear. Pure factory functions return objects of pure functions. Side-effecting factory functions (like one that connects to a database) use `function` declarations:

```typescript
async function createUserRepository(connectionString: string) {
  const db = await connect(connectionString);
  return {
    findById: async (id: string) => db.findUnique({ where: { id } }),
  };
}
```