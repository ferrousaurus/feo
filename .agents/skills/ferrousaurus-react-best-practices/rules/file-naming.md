---
title: PascalCase for Component Files, camelCase for Non-Components
impact: LOW
impactDescription: Component files match their default export; non-component files follow TypeScript skill convention
tags: react, file, naming, pascalcase, camelcase
---

## PascalCase for Component Files, camelCase for Non-Components

**Impact: LOW (component files match their default export; non-components follow TypeScript convention)**

Component files use PascalCase, matching the name of their default export. This is a deliberate departure from the TypeScript skill's `module-file-naming` rule (which uses camelCase for all files), optimized for React projects where the file name should match the component name.

Non-component files (hooks, utils, types) follow the TypeScript skill's camelCase convention.

### Component files (PascalCase)

```
UserProfile.tsx    → exports default function UserProfile
SearchInput.tsx    → exports default const SearchInput = ...
Layout.tsx         → exports default function Layout
```

The file name matches the default export name. If the component is `UserProfile`, the file is `UserProfile.tsx`.

### Non-component files (camelCase)

```
useAuth.ts          → exports function useAuth
useDebounce.ts      → exports function useDebounce
formatDate.ts       → exports const formatDate
user.ts             → exports type User
```

### Why the difference?

React developers expect to find a component by its name. When you see `<UserProfile />`, you should be able to find `UserProfile.tsx` in `components/`. This convention is universal in React ecosystems and supported by IDE features like "Go to Definition."

For hooks and utilities, the camelCase convention from the TypeScript skill makes more sense — these are functions, not types or components.

### Cross-References

- Related: [file-type-directories.md](./file-type-directories.md)
- Related: [component-exports.md](./component-exports.md)
- TS Skill: `module-file-naming` — Use camelCase for file names (this rule differs for component files)