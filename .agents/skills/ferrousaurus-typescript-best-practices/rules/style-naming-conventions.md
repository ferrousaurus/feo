---
title: Use camelCase for Variables and PascalCase for Types
impact: MEDIUM
impactDescription: Standard TypeScript convention that all codebases follow
tags: style, naming, camelCase, PascalCase
---

## Use camelCase for Variables and PascalCase for Types

**Impact: MEDIUM (standard TypeScript convention that all codebases follow)**

Variables and functions use `camelCase`. Types and type aliases use `PascalCase`. This is the universal TypeScript convention and distinguishes values from types at a glance.

**Incorrect:**

```typescript
type user_account = { user_name: string };
const UserRecord = { name: `Alice` };
function GetProfile() { ... }
const user_email = `alice@example.com`;
```

**Correct:**

```typescript
type UserAccount = { userName: string };
const userRecord = { name: `Alice` };
function fetchProfile() { ... }
const userEmail = `alice@example.com`;
```

Convention summary:

| Kind | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Functions | camelCase | `fetchProfile`, `calculateTotal` |
| Types | PascalCase | `UserAccount`, `ApiResponse` |
| Constants | camelCase | `maxRetries`, `apiBaseUrl` |
| Files | camelCase | `userRepository.ts` |