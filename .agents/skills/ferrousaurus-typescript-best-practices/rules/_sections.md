# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Function Declarations (function)

**Impact:** CRITICAL  
**Description:** The foundational convention that distinguishes pure functions from side-effecting functions through syntax. Arrow functions signal purity and referential transparency; function declarations signal side effects and impurity. This single rule creates an immediate visual distinction that makes code intent clear at a glance.

## 2. Type System (type)

**Impact:** HIGH  
**Description:** TypeScript's type system is the primary tool for expressing intent and catching errors. Using `type` exclusively, banning `enum`, leveraging `as const`, and avoiding type assertions ensures types are precise, inferable, and safe. These rules maximize the type system's ability to prevent bugs while keeping code readable.

## 3. Immutability & Safety (safe)

**Impact:** HIGH  
**Description:** Never mutating arguments, preferring immutable array methods, and using spread for object updates eliminates entire classes of bugs. Combined with const-by-default and runtime validation at boundaries, these rules make data flow predictable and traceable.

## 4. Null & Optionality (nullability)

**Impact:** MEDIUM  
**Description:** Consistent handling of absence and failure through `undefined`, optional chaining, and nullish coalescing eliminates null-pointer surprises. Using `?` for optional parameters and `T | undefined` for failure signaling creates a uniform pattern that's easy to read and reason about.

## 5. Control Flow (control)

**Impact:** MEDIUM  
**Description:** Early returns, ternaries for simple conditionals, object maps for lookups, and switch-with-braces for complex branching make control flow predictable and flat. Banning nested ternaries forces extraction, which improves readability and testability.

## 6. Async Patterns (async)

**Impact:** MEDIUM  
**Description:** Consistent async/await style, .catch() over try/catch, and always parallelizing independent operations makes asynchronous code readable and correct. Distinguishing pure iteration (map/filter) from side-effecting iteration (for...of) prevents accidental parallelism bugs.

## 7. Module Organization (module)

**Impact:** MEDIUM  
**Description:** One primary export per file, no barrel files, inline exports, and consistent import ordering make codebases navigable and bundler-friendly. Flat-by-feature directories and camelCase file naming create predictable file locations.

## 8. Style & Naming (style)

**Impact:** LOW  
**Description:** Consistent formatting and naming conventions—backtick strings, semicolons, trailing commas, camelCase variables, PascalCase types, is/has/should booleans—reduce cognitive overhead and make code scannable. These rules are low impact individually but collectively shape a uniform codebase.