---
title: Comments Explain Why, Not What
impact: MEDIUM
impactDescription: Why-comments capture intent; what-comments are noise
tags: style, comments, documentation, intent
---

## Comments Explain Why, Not What

**Impact: MEDIUM (why-comments capture intent; what-comments are noise)**

Comments should explain why a decision was made or why something works a certain way, not what the code does. The code itself should explain "what" through clear naming and types. Comments that describe what the code does are noise — they add maintenance burden without adding information.

**Incorrect (what-comment — restates the code):**

```typescript
// Check if the user is active
if (user.isActive) {
  // Return the user's name
  return user.name;
}
```

**Correct (why-comment — explains intent):**

```typescript
// CA state sales tax, not local — applies to all interstate shipments
const TAX_RATE = 0.0875;

// Fall back to cached data when API is rate-limited (happens every ~1000 req/min)
const data = cached ?? await fetchFreshData();
```

Good comments explain:
- Why a seemingly wrong approach is correct
- Business rules that aren't obvious from variable names
- Edge cases and non-intuitive behavior
- Links to relevant documentation, issues, or decisions
- Performance considerations that drove a choice