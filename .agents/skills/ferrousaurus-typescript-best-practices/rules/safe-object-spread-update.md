---
title: Use Spread for Object Updates
impact: HIGH
impactDescription: Prevents mutation bugs and makes data flow explicit
tags: immutability, object, spread, mutation
---

## Use Spread for Object Updates

**Impact: HIGH (prevents mutation bugs and makes data flow explicit)**

Always use object spread to create updated objects. Never mutate object properties directly, even on objects you created. Return new objects with the spread operator.

**Incorrect (mutating object):**

```typescript
function updateConfig(config: Config, updates: Partial<Config>) {
  config.port = updates.port ?? config.port;
  config.host = updates.host ?? config.host;
  return config;
}
```

**Correct (creating new object with spread):**

```typescript
const updateConfig = (config: Config, updates: Partial<Config>): Config =>
  ({ ...config, ...updates });
```

**Correct (nested updates with deep spread):**

```typescript
const updateUser = (user: User, name: string, email: string): User =>
  ({
    ...user,
    profile: { ...user.profile, name },
    contact: { ...user.contact, email },
  });
```

Spread creates a new reference, which is essential for:
- React state updates (which rely on reference equality)
- Change detection in any mutable-data-averse system
- Predictable data flow in general
- Preventing bugs from shared mutable state