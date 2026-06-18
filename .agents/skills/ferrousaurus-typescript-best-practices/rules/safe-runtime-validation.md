---
title: Runtime Validation at Boundaries with Zod or Valibot
impact: HIGH
impactDescription: Prevents untrusted data from bypassing the type system
tags: safety, validation, zod, valibot, boundary
---

## Runtime Validation at Boundaries with Zod or Valibot

**Impact: HIGH (prevents untrusted data from bypassing the type system)**

Use a runtime validation library (Zod, Valibot, or equivalent) to validate data at system boundaries — API responses, form inputs, parsed JSON, and any data from untrusted sources. TypeScript's type system is erased at runtime; runtime validation bridges the gap.

**Incorrect (type assertion on untrusted data):**

```typescript
const user = response.data as User;
```

**Incorrect (no validation):**

```typescript
const data = JSON.parse(rawString) as ApiResult;
```

**Correct (Zod schema validation):**

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
});

type User = z.infer<typeof UserSchema>;

const user = UserSchema.parse(response.data);
```

**Correct (Valibot validation):**

```typescript
import * as v from "valibot";

const UserSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

type User = v.InferOutput<typeof UserSchema>;

const user = v.parse(UserSchema, response.data);
```

Key boundaries that need validation:

- API responses
- Form submissions
- URL parameters and search params
- localStorage / sessionStorage reads
- File contents
- WebSocket messages
- Any `JSON.parse()` result
