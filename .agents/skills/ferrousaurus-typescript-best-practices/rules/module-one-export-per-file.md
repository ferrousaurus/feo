---
title: One Primary Export Per File
impact: MEDIUM
impactDescription: Makes modules focused and imports predictable
tags: module, export, default, file
---

## One Primary Export Per File

**Impact: MEDIUM (makes modules focused and imports predictable)**

Each file should have one primary export (a default export). Additional named exports for types and internal utilities are acceptable, but the file's purpose should be centered on one main thing.

**Incorrect (multiple unrelated exports):**

```typescript
// userUtils.ts
export const formatName = (user: User) => `${user.first} ${user.last}`;
export async function saveUser(user: User) { ... }
export type UserDTO = { ... };
export const validateEmail = (email: string) => ...;
```

**Correct (one primary export per file, types as named exports):**

```typescript
// formatName.ts
export type FormattedName = { full: string; display: string };

export const formatName = (user: User): FormattedName => ({ full: `${user.first} ${user.last}`, display: user.first });

export default formatName;
```

```typescript
// saveUser.ts
export type SaveUserParams = { user: User; validate: boolean };

export default async function saveUser(params: SaveUserParams) {
  await db.insert(params.user);
}
```

This convention makes imports predictable: the file name tells you what the default export is, and named exports provide supporting types.
