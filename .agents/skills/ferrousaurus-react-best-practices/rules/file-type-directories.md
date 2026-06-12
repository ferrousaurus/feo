---
title: Type-Based Directories for React Projects
impact: LOW
impactDescription: Predictable file location by category; components/, hooks/, utils/ etc.
tags: react, file, organization, directory, structure
---

## Type-Based Directories for React Projects

**Impact: LOW (predictable file location by category)**

Organize React project files by type in dedicated directories. This is a deliberate departure from the TypeScript skill's `module-flat-by-feature` rule, optimized for React projects where component hierarchy, hook reuse, and utility sharing follow type-based patterns.

### Directory structure

```
src/
  components/
    UserProfile.tsx
    UserList.tsx
    SearchInput.tsx
    Layout.tsx
  hooks/
    useAuth.ts
    useDebounce.ts
    useUserQuery.ts
  utils/
    formatDate.ts
    calculateTotal.ts
  types/
    user.ts
    api.ts
    common.ts
  pages/
    Dashboard.tsx
    Settings.tsx
```

### Rules

- **`components/`** — React components (`.tsx` files)
- **`hooks/`** — Custom React hooks (start with `use`)
- **`utils/`** — Pure utility functions (no React imports)
- **`types/`** — Shared type definitions
- **`pages/`** — Route-level page components (optional, may be co-located with routing config)

### When to subdivide

If a directory grows past ~20 files, consider grouping by feature domain within the type directory:

```
src/
  components/
    user/
      UserProfile.tsx
      UserList.tsx
    order/
      OrderDetail.tsx
      OrderList.tsx
```

But the primary organization is by type, not by feature. A developer looking for `UserProfile` knows to look in `components/`, not to guess which feature domain it belongs to.

### Cross-References

- Related: [file-naming.md](./file-naming.md)
- TS Skill: `module-flat-by-feature` — Flat directory structure by feature (this rule deliberately differs for React projects)