---
name: ferrousaurus-typescript-best-practices
description: TypeScript writing conventions that enforce functional programming principles and consistent code style. Contains 70+ rules across 8 categories covering function declarations, type system, immutability, nullability, control flow, async patterns, module organization, and style. Triggers on writing, reviewing, or refactoring TypeScript code.
license: MIT
metadata:
  author: ferrousaurus
  version: "1.0.0"
---

# Ferrousaurus TypeScript Best Practices

Comprehensive TypeScript writing conventions, designed for AI agents and LLMs. Contains 70+ rules across 8 categories, prioritized by impact from critical (function declaration conventions) to incremental (formatting and naming).

## When to Apply

Reference these guidelines when:

- Writing new TypeScript code
- Reviewing TypeScript for style consistency
- Refactoring TypeScript code
- Setting up a new TypeScript project
- Configuring linters and formatters

## Core Principle

The central convention is **pure functions use arrow syntax, side-effecting functions use `function` declarations**. This single rule makes code intent visible at a glance and shapes every other decision in this guide.

## Rule Categories by Priority

| Priority | Category              | Impact   | Prefix         |
| -------- | --------------------- | -------- | -------------- |
| 1        | Function Declarations | CRITICAL | `function-`    |
| 2        | Type System           | HIGH     | `type-`        |
| 3        | Immutability & Safety | HIGH     | `safe-`        |
| 4        | Null & Optionality    | MEDIUM   | `nullability-` |
| 5        | Control Flow          | MEDIUM   | `control-`     |
| 6        | Async Patterns        | MEDIUM   | `async-`       |
| 7        | Module Organization   | MEDIUM   | `module-`      |
| 8        | Style & Naming        | LOW      | `style-`       |

## Quick Reference

### 1. Function Declarations (CRITICAL)

- `function-pure-arrow` — Pure functions = arrow, side effects = `function` declaration
- `function-no-explicit-return-type` — Never use explicit return type annotations; infer or `satisfies`
- `function-parameters-always-typed` — All parameters explicitly typed
- `function-default-exports` — Default exports follow convention
- `function-callback-convention` — Callbacks follow pure/side-effect convention
- `function-inline-callbacks` — Inline callbacks when no braces needed
- `function-no-classes` — Never classes — prefer functions and closures
- `function-option-object-pattern` — Required positional + options object

### 2. Type System (HIGH)

- `type-type-over-interface` — Only `type`, never `interface`
- `type-enum-ban` — Never use `enum`
- `type-const-array-enum` — Const array + derived type for fixed value sets
- `type-as-const` — `as const` for literals and immutable objects
- `type-satisfies-usage` — `satisfies` for type-checking without widening
- `type-assertion-ban` — Never use type assertions (`as Type`)
- `type-non-null-assertion-ban` — Never use non-null assertion (`!`)
- `type-generic-on-function` — Generics on function, not type alias
- `type-generic-descriptive-names` — `TInput` style, not `A` or `T`
- `type-extract-named-types` — Extract parameter object types to named `type`
- `type-readonly-params` — `Readonly<T>` / `readonly T[]` for unmutated params
- `type-utility-preference` — Prefer built-in utility types
- `type-composition-intersection` — Intersection `&` for type composition
- `type-guard-functions` — User-defined type predicates for narrowing

### 3. Immutability & Safety (HIGH)

- `safe-never-mutate-arguments` — Never mutate function arguments
- `safe-immutable-array-methods` — `toSorted`, `toReversed`, `toSpliced`, `with`
- `safe-object-spread-update` — Spread for object updates
- `safe-const-let-var` — `const` default, `let` only when reassigned, `var` banned
- `safe-for-of-const` — `const` in `for...of` loops
- `safe-runtime-validation` — Zod/valibot at boundaries

### 4. Null & Optionality (MEDIUM)

- `nullability-undefined-default` — `undefined` as default for no value
- `nullability-failure-type` — `T | undefined` to signal failure
- `nullability-optional-params` — `?` syntax, not `| undefined`
- `nullability-optional-chaining` — `?.` everywhere nullable
- `nullability-nullish-coalescing` — `??` not `||`

### 5. Control Flow (MEDIUM)

- `control-early-return` — Always early return, avoid deep nesting
- `control-ternary` — Prefer ternary for assignment/return
- `control-nested-ternary-ban` — Banned; extract to function
- `control-object-map` — Object map for simple lookups
- `control-switch-braces` — `switch` with braces for complex logic

### 6. Async Patterns (MEDIUM)

- `async-await-style` — `async/await` over `.then()` chains
- `async-catch-over-trycatch` — `.catch()` over `try/catch`
- `async-parallelize-independent` — Always `Promise.all` for independent ops
- `async-promise-all-settled` — `Promise.allSettled` for parallel side effects
- `async-iteration-pure` — `map`/`filter`/`reduce` for pure transforms
- `async-iteration-side-effects` — `for...of` for side-effecting iteration

### 7. Module Organization (MEDIUM)

- `module-inline-exports` — `export` on declaration, not at file bottom
- `module-one-export-per-file` — One primary export per file
- `module-no-barrel-exports` — Import directly, no barrel files
- `module-file-organization` — Types first, then functions
- `module-import-style` — Named + default imports
- `module-import-order` — External first, then internal
- `module-file-naming` — `camelCase` file names
- `module-flat-by-feature` — Flat directory structure by feature

### 8. Style & Naming (LOW)

- `style-backtick-strings` — Always backticks
- `style-semicolon-always` — Always semicolons
- `style-trailing-commas` — Always trailing commas
- `style-object-shorthand` — `{ name }` not `{ name: name }`
- `style-method-chaining` — Leading dot on new line
- `style-implicit-return` — No braces for simple arrow bodies
- `style-parenthesized-object-return` — `=> ({ ... })` for implicit object return
- `style-multiline-objects` — 2+ properties → multiline
- `style-naming-conventions` — `camelCase` vars, `PascalCase` types
- `style-boolean-prefix` — `is/has/should` prefix
- `style-no-private-prefix` — No underscore prefix for internal
- `style-destructuring-params` — Destructure in function params
- `style-destructuring-multi` — Destructure when using multiple properties
- `style-no-swap-destructuring` — No `[a, b] = [b, a]`
- `style-dot-notation` — Dot notation for property access
- `style-computed-properties` — Computed property keys acceptable
- `style-rest-spread` — Rest params, object spread for merging
- `style-jsdoc-when-needed` — JSDoc only when non-obvious
- `style-comments-why-not-what` — Comments explain why, not what
- `style-error-classes` — Custom error classes extending `Error`
- `style-catch-typed` — `catch (error: Error)`
- `style-throw-docs` — `@throws` in JSDoc

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/function-pure-arrow.md
rules/type-type-over-interface.md
rules/safe-never-mutate-arguments.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example
- Correct code example
- Additional context

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
