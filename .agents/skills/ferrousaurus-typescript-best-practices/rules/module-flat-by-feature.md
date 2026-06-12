---
title: Flat Directory Structure by Feature
impact: MEDIUM
impactDescription: Flat structure is navigable and avoids deep nesting
tags: module, directory, feature, organization
---

## Flat Directory Structure by Feature

**Impact: MEDIUM (flat structure is navigable and avoids deep nesting)**

Organize code in flat directories grouped by feature, not by technical layer. Avoid deep nesting — each feature directory should contain its files directly, not nested subdirectories that add no value.

**Incorrect (deep nesting by technical layer):**

```
src/
  components/
    user/
      UserProfile.tsx
      UserList.tsx
    order/
      OrderDetail.tsx
  hooks/
    user/
      useUser.ts
    order/
      useOrder.ts
  utils/
    user/
      formatName.ts
    order/
      calculateTotal.ts
```

**Correct (flat by feature):**

```
src/
  user/
    formatName.ts
    useUser.ts
    UserProfile.tsx
    UserList.tsx
  order/
    calculateTotal.ts
    useOrder.ts
    OrderDetail.tsx
```

Flat-by-feature means:
- All files related to a feature live in one directory
- No more than 1-2 levels of nesting
- Easy to find: the feature name tells you the directory
- No barrel files (see `module-no-barrel-exports`)