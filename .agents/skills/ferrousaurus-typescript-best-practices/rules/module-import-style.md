---
title: Named and Default Imports
impact: LOW
impactDescription: Consistent import style improves readability
tags: module, import, named, default
---

## Named and Default Imports

**Impact: LOW (consistent import style improves readability)**

Use named imports for utilities and types. Use default imports for the primary export of a module. Never use namespace imports (`import * as`).

**Incorrect (namespace import):**

```typescript
import * as Utils from './utils';
import * as React from 'react';
```

**Correct (named and default imports):**

```typescript
import formatName from './formatName';
import type { User } from './types';
import { useState, useEffect } from 'react';
```

Namespace imports:
- Make it unclear what's actually used
- Prevent tree-shaking for the entire module
- Add noise at every usage site (`Utils.formatName` vs `formatName`)
- Are acceptable only when consuming a module with many exports that are all used together