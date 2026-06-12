---
title: No Barrel Exports — Import Directly from Files
impact: HIGH
impactDescription: Barrel files defeat tree-shaking and slow builds
tags: module, barrel, import, bundling, tree-shaking
---

## No Barrel Exports — Import Directly from Files

**Impact: HIGH (barrel files defeat tree-shaking and slow builds)**

Never create barrel files (index.ts files that re-export from other modules). Import directly from the source file. Barrel files force bundlers to include all re-exported modules, defeat tree-shaking, and slow down builds and type-checking.

**Incorrect (barrel file):**

```typescript
// utils/index.ts
export { formatName } from './formatName';
export { validateEmail } from './validateEmail';
export { saveUser } from './saveUser';
export type { User } from './types';
export type { FormattedName } from './formatName';
```

```typescript
// consumer.ts
import { formatName, User } from './utils';
```

**Correct (direct imports):**

```typescript
// consumer.ts
import formatName from './formatName';
import type { User } from './types';
```

Barrel files cause:
- Bundlers to include all re-exported modules even if only one is used
- Slower type-checking (TypeScript must resolve the entire barrel)
- Increased module graph complexity
- Hidden circular dependency issues
- Slower development server startup

Import directly from source files. The one-primary-export-per-file rule (see `module-one-export-per-file`) makes this natural.