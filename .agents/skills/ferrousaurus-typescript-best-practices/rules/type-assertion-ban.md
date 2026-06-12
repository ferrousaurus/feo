---
title: Never Use Type Assertions (as Type)
impact: CRITICAL
impactDescription: Type assertions bypass the type system and hide real bugs
tags: type, assertion, as, safety, bypass
---

## Never Use Type Assertions (as Type)

**Impact: CRITICAL (type assertions bypass the type system and hide real bugs)**

Never use type assertions (`as Type`). They override TypeScript's type checker, telling the compiler "trust me, I know better" — which is exactly when bugs happen. Type assertions don't perform any runtime check; they silently allow invalid types through.

**Incorrect (type assertion bypasses safety):**

```typescript
const user = data as User;
const value = result as string;
const element = document.querySelector('.box') as HTMLElement;
```

**Correct alternatives:**

Use user-defined type guards for narrowing from `unknown`:

```typescript
const isUser = (value: unknown): value is User =>
  typeof value === 'object' && value !== null && 'name' in value;

const user = isUser(data) ? data : undefined;
```

Use runtime validation (Zod/valibot) at boundaries:

```typescript
const UserSchema = z.object({ name: z.string(), email: z.string() });
const user = UserSchema.parse(data);
```

Use `satisfies` to verify a value conforms to a type without widening:

```typescript
const config = { port: 3000, host: 'localhost' } satisfies Config;
```

Non-null assertion (`!`) is also a type assertion and is equally banned. Use optional chaining and nullish coalescing instead:

```typescript
// Incorrect
const name = user!.name;

// Correct
const name = user?.name ?? 'Unknown';
```

There are no exceptions. If TypeScript can't infer the type, fix the types — don't override them.