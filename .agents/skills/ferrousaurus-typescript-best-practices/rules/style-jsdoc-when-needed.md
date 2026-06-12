---
title: JSDoc Only When Non-Obvious
impact: LOW
impactDescription: Excessive JSDoc adds noise without value
tags: style, jsdoc, documentation, comments
---

## JSDoc Only When Non-Obvious

**Impact: LOW (excessive JSDoc adds noise without value)**

Only write JSDoc comments when the function's purpose, parameters, or behavior are not obvious from its name and type signature. Well-named, well-typed functions are self-documenting. JSDoc that repeats what the types already say adds noise.

**Incorrect (obvious JSDoc):**

```typescript
/**
 * Adds two numbers together
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 */
const add = (a: number, b: number) => a + b;
```

**Correct (non-obvious JSDoc):**

```typescript
/**
 * Calculates the discount by applying jurisdiction-specific tax rules.
 * Uses the destination-based sourcing method for interstate transactions.
 *
 * @throws {TaxError} When the jurisdiction code is not recognized
 */
const calculateTax = (amount: number, jurisdiction: Jurisdiction) =>
  ...
```

Write JSDoc when:
- The function has non-obvious side effects
- The function throws errors (use `@throws`)
- Parameter meanings are not clear from names alone
- The function has complex business logic that needs context
- Behavior differs from what a developer might expect

Don't write JSDoc when:
- The function name and types fully describe the behavior
- The comment would just repeat the function signature