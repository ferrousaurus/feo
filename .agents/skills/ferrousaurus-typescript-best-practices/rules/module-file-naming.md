---
title: Use camelCase for File Names
impact: LOW
impactDescription: Consistent file naming makes files easy to find
tags: module, file, naming, camelCase
---

## Use camelCase for File Names

**Impact: LOW (consistent file naming makes files easy to find)**

Use `camelCase` for all TypeScript file names. This matches the variable and function naming convention and avoids cross-platform case-sensitivity issues.

**Incorrect:**

```
UserRepository.ts
user-repository.ts
user_repository.ts
USER_REPOSITORY.ts
```

**Correct:**

```
userRepository.ts
formatName.ts
saveToDatabase.ts
```

Exceptions:

- Directive files that require specific names (e.g., `next.config.ts`, `tsconfig.json`)
- Test files that follow a framework convention (e.g., `user.test.ts`)
