---
title: External Imports First, Then Internal
impact: LOW
impactDescription: Consistent import order makes dependencies scannable
tags: module, import, order, organization
---

## External Imports First, Then Internal

**Impact: LOW (consistent import order makes dependencies scannable)**

Group imports with external/third-party packages first, then a blank line, then internal/project imports. This makes it immediately clear which dependencies are external vs internal.

**Incorrect (mixed import order):**

```typescript
import formatName from "./formatName";
import { useState } from "react";
import type { User } from "./types";
import { z } from "zod";
import { validateEmail } from "./validateEmail";
```

**Correct (external first, then internal):**

```typescript
import { useState } from "react";
import { z } from "zod";

import formatName from "./formatName";
import type { User } from "./types";
import { validateEmail } from "./validateEmail";
```

Some teams also separate type imports, but the minimum convention is: external packages first, then internal modules. Within each group, alphabetize or group by related functionality.
