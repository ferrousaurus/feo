# TypeScript Best Practices

**Version 1.0.0**  
Ferrousaurus  
May 2026

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring TypeScript codebases. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive TypeScript writing conventions, designed for AI agents and LLMs. Contains 70+ rules across 8 categories, prioritized by impact from critical (function declaration conventions) to incremental (formatting and naming). Each rule includes detailed explanations and code examples comparing incorrect vs. correct implementations.

---

## Table of Contents

1. [Function Declarations](#1-function-declarations) — **CRITICAL**
   - 1.1 [Pure Functions Use Arrow Syntax, Side Effects Use Function Declarations](#11-pure-functions-use-arrow-syntax-side-effects-use-function-declarations)
   - 1.2 [Never Use Explicit Return Type Annotations](#12-never-use-explicit-return-type-annotations)
   - 1.3 [Callbacks Follow Pure/Side-Effect Convention](#13-callbacks-follow-pureside-effect-convention)
   - 1.4 [All Function Parameters Must Be Explicitly Typed](#14-all-function-parameters-must-be-explicitly-typed)
   - 1.5 [Never Use Classes — Prefer Functions and Closures](#15-never-use-classes--prefer-functions-and-closures)
   - 1.6 [Required Positional Params Then Options Object](#16-required-positional-params-then-options-object)
   - 1.7 [Default Exports Follow Function Convention](#17-default-exports-follow-function-convention)
   - 1.8 [Inline Callbacks When No Braces Needed](#18-inline-callbacks-when-no-braces-needed)
2. [Type System](#2-type-system) — **HIGH**
   - 2.1 [Never Use Type Assertions (as Type)](#21-never-use-type-assertions-as-type)
   - 2.2 [Never Use Non-Null Assertion (!)](#22-never-use-non-null-assertion-)
   - 2.3 [Use type Alias, Never interface](#23-use-type-alias-never-interface)
   - 2.4 [Never Use TypeScript enum](#24-never-use-typescript-enum)
   - 2.5 [Use User-Defined Type Predicates for Narrowing](#25-use-user-defined-type-predicates-for-narrowing)
   - 2.6 [Const Array with Derived Type for Fixed Value Sets](#26-const-array-with-derived-type-for-fixed-value-sets)
   - 2.7 [Use Intersection for Type Composition](#27-use-intersection-for-type-composition)
   - 2.8 [Use Readonly for Unmutated Parameters](#28-use-readonly-for-unmutated-parameters)
   - 2.9 [Extract Parameter Object Types to Named type](#29-extract-parameter-object-types-to-named-type)
   - 2.10 [Use as const for Literals and Immutable Objects](#210-use-as-const-for-literals-and-immutable-objects)
   - 2.11 [Use satisfies Only for Type Checking Without Widening](#211-use-satisfies-only-for-type-checking-without-widening)
   - 2.12 [Place Generics on Functions, Not Type Aliases](#212-place-generics-on-functions-not-type-aliases)
   - 2.13 [Use Descriptive Generic Names (TInput, Not T)](#213-use-descriptive-generic-names-tinput-not-t)
   - 2.14 [Prefer Built-in Utility Types](#214-prefer-built-in-utility-types)
3. [Immutability & Safety](#3-immutability--safety) — **HIGH**
   - 3.1 [Never Mutate Function Arguments](#31-never-mutate-function-arguments)
   - 3.2 [const by Default, let Only When Reassigned, var Banned](#32-const-by-default-let-only-when-reassigned-var-banned)
   - 3.3 [Use Immutable Array Methods](#33-use-immutable-array-methods)
   - 3.4 [Use Spread for Object Updates](#34-use-spread-for-object-updates)
   - 3.5 [Runtime Validation at Boundaries with Zod or Valibot](#35-runtime-validation-at-boundaries-with-zod-or-valibot)
   - 3.6 [Use const in for...of Loops](#36-use-const-in-forof-loops)
4. [Null & Optionality](#4-null--optionality) — **MEDIUM**
   - 4.1 [Use T | undefined to Signal Failure](#41-use-t--undefined-to-signal-failure)
   - 4.2 [Use Nullish Coalescing (??) Instead of Logical OR (||)](#42-use-nullish-coalescing--instead-of-logical-or-)
   - 4.3 [Use Optional Chaining Wherever Nullable](#43-use-optional-chaining-wherever-nullable)
   - 4.4 [Use ? for Optional Parameters, Not | undefined](#44-use--for-optional-parameters-not--undefined)
   - 4.5 [Use undefined as Default for No Value](#45-use-undefined-as-default-for-no-value)
5. [Control Flow](#5-control-flow) — **MEDIUM**
   - 5.1 [Always Use Early Returns, Avoid Deep Nesting](#51-always-use-early-returns-avoid-deep-nesting)
   - 5.2 [Nested Ternaries Are Banned](#52-nested-ternaries-are-banned)
   - 5.3 [Use Object Map for Simple Lookups](#53-use-object-map-for-simple-lookups)
   - 5.4 [Use Switch with Braces for Complex Branching](#54-use-switch-with-braces-for-complex-branching)
   - 5.5 [Prefer Ternary for Assignment and Return](#55-prefer-ternary-for-assignment-and-return)
6. [Async Patterns](#6-async-patterns) — **MEDIUM**
   - 6.1 [Always Parallelize Independent Async Operations](#61-always-parallelize-independent-async-operations)
   - 6.2 [Use async/await Over .then() Chains](#62-use-asyncawait-over-then-chains)
   - 6.3 [Use .catch() Over try/catch](#63-use-catch-over-trycatch)
   - 6.4 [Use map/filter/reduce for Pure Iteration](#64-use-mapfilterreduce-for-pure-iteration)
   - 6.5 [Use for...of for Side-Effecting Iteration](#65-use-forof-for-side-effecting-iteration)
   - 6.6 [Use Promise.allSettled for Parallel Side Effects](#66-use-promiseallsettled-for-parallel-side-effects)
7. [Module Organization](#7-module-organization) — **MEDIUM**
   - 7.1 [No Barrel Exports — Import Directly from Files](#71-no-barrel-exports--import-directly-from-files)
   - 7.2 [One Primary Export Per File](#72-one-primary-export-per-file)
   - 7.3 [Flat Directory Structure by Feature](#73-flat-directory-structure-by-feature)
   - 7.4 [Inline Exports on Declarations](#74-inline-exports-on-declarations)
   - 7.5 [Types First, Then Functions in Files](#75-types-first-then-functions-in-files)
   - 7.6 [External Imports First, Then Internal](#76-external-imports-first-then-internal)
   - 7.7 [Named and Default Imports](#77-named-and-default-imports)
   - 7.8 [Use camelCase for File Names](#78-use-camelcase-for-file-names)
8. [Style & Naming](#8-style--naming) — **LOW**
   - 8.1 [Prefix Booleans with is/has/should](#81-prefix-booleans-with-ishasshould)
   - 8.2 [Catch Errors as Error Type](#82-catch-errors-as-error-type)
   - 8.3 [Custom Error Classes Extending Error](#83-custom-error-classes-extending-error)
   - 8.4 [Parenthesize Implicit Object Returns](#84-parenthesize-implicit-object-returns)
   - 8.5 [Leading Dot on New Line for Method Chaining](#85-leading-dot-on-new-line-for-method-chaining)
   - 8.6 [Use Rest Parameters and Object Spread](#86-use-rest-parameters-and-object-spread)
   - 8.7 [Use camelCase for Variables and PascalCase for Types](#87-use-camelcase-for-variables-and-pascalcase-for-types)
   - 8.8 [Comments Explain Why, Not What](#88-comments-explain-why-not-what)
   - 8.9 [Always Use Backtick Strings](#89-always-use-backtick-strings)
   - 8.10 [Always Use Semicolons](#810-always-use-semicolons)
   - 8.11 [Always Use Trailing Commas](#811-always-use-trailing-commas)
   - 8.12 [JSDoc Only When Non-Obvious](#812-jsdoc-only-when-non-obvious)
   - 8.13 [Document Thrown Errors with @throws JSDoc](#813-document-thrown-errors-with-throws-jsdoc)
   - 8.14 [No Braces for Simple Arrow Function Bodies](#814-no-braces-for-simple-arrow-function-bodies)
   - 8.15 [Multiline Objects When 2 or More Properties](#815-multiline-objects-when-2-or-more-properties)
   - 8.16 [Use Object Shorthand When Key Matches Variable Name](#816-use-object-shorthand-when-key-matches-variable-name)
   - 8.17 [Use Dot Notation for Property Access](#817-use-dot-notation-for-property-access)
   - 8.18 [Destructure When Using Multiple Properties](#818-destructure-when-using-multiple-properties)
   - 8.19 [Destructure in Function Parameters](#819-destructure-in-function-parameters)
   - 8.20 [Computed Property Keys Are Acceptable](#820-computed-property-keys-are-acceptable)
   - 8.21 [No Underscore Prefix for Internal Variables](#821-no-underscore-prefix-for-internal-variables)
   - 8.22 [No Swap Destructuring](#822-no-swap-destructuring)

---

## 1. Function Declarations

**Impact: CRITICAL**

The foundational convention that distinguishes pure functions from side-effecting functions through syntax. Arrow functions signal purity and referential transparency; function declarations signal side effects and impurity. This single rule creates an immediate visual distinction that makes code intent clear at a glance.

### 1.1 Pure Functions Use Arrow Syntax, Side Effects Use Function Declarations

**Impact: CRITICAL (creates immediate visual distinction between pure and impure code)**

The syntax of a function declaration communicates its behavior. Arrow functions (`const fn = () => ...`) signal purity — no side effects, no I/O, deterministisch output for given input. Function declarations (`function fn() { ... }`) signal side effects — I/O, mutation, network calls, non-deterministic behavior.

A pure function:

- Returns the same output for the same inputs
- Has no side effects (no I/O, no mutation of external state)
- Is referentially transparent (can be replaced by its return value)

A side-effecting function:

- Performs I/O (network, filesystem, database)
- Mutates external state
- Has non-deterministic behavior (randomness, timestamps)
- Throws errors as part of its contract

**Incorrect (arrow function with side effects):**

```typescript
const saveToDatabase = async (record: Record) => {
  await db.insert(record);
};
```

**Incorrect (function declaration for pure logic):**

```typescript
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Correct (arrow for pure, declaration for side effects):**

```typescript
const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0);

async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```

Async functions follow the same rule. An async pure function (data transformation) uses arrow syntax; an async side-effecting function uses a declaration.

**Correct (async pure transformation — arrow):**

```typescript
const toUserDTO = async (user: User): Promise<UserDTO> => ({
  id: user.id,
  name: user.name,
});
```

**Correct (async side effect — declaration):**

```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

This convention creates an immediate visual signal. When you see `const fn = `, you know it's safe to call without side effects. When you see `function fn()`, you know to watch for side effects.

### 1.2 Never Use Explicit Return Type Annotations

**Impact: CRITICAL (return types should be inferred or asserted with satisfies)**

Never write explicit return type annotations on functions. TypeScript can infer return types, and explicit annotations create maintenance burden without benefit — they can drift from the actual implementation and make refactoring harder.

If you need to assert a specific type (e.g., for narrowing or documentation), use `satisfies` on the expression body instead.

**Incorrect (explicit return type annotation):**

```typescript
const add = (a: number, b: number): number => a + b;

function saveToDatabase(record: Record): Promise<void> {
  return db.insert(record);
}
```

**Incorrect (type annotation on const):**

```typescript
const add: (a: number, b: number) => number = (a, b) => a + b;
```

**Correct (inferred return type):**

```typescript
const add = (a: number, b: number) => a + b;

async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```

**Correct (type assertion with satisfies when needed):**

```typescript
const add = (a: number, b: number) => (a + b) satisfies number;
```

Use `satisfies` only when you need the compiler to verify the expression matches a specific type without widening it. For the vast majority of functions, let TypeScript infer the return type.

### 1.3 Callbacks Follow Pure/Side-Effect Convention

**Impact: HIGH (callbacks passed as arguments should use arrow or function declaration based on purity)**

When defining callbacks — whether passed as arguments, stored in variables, or used inline — follow the same pure/side-effect convention. Pure callbacks (data transformations, filtering, mapping) use arrow syntax. Side-effecting callbacks (event handlers, I/O operations) use function declarations.

**Incorrect (function declaration for pure callback):**

```typescript
function isActive(user: User) {
  return user.status === "active";
}
const activeUsers = users.filter(isActive);
```

**Incorrect (arrow function for side-effecting callback):**

```typescript
button.addEventListener("click", (event: MouseEvent) => {
  await saveData(formData);
  logEvent("form-submitted", { timestamp: Date.now() });
});
```

**Correct (arrow for pure callback):**

```typescript
const isActive = (user: User) => user.status === "active";
const activeUsers = users.filter(isActive);
```

**Correct (function declaration for side-effecting callback):**

```typescript
function handleSubmit(event: MouseEvent) {
  await saveData(formData);
  logEvent("form-submitted", { timestamp: Date.now() });
}
button.addEventListener("click", handleSubmit);
```

This applies to all callback contexts: array methods, event handlers, Promise chains, and custom higher-order functions.

### 1.4 All Function Parameters Must Be Explicitly Typed

**Impact: HIGH (explicit types make contracts clear and catch errors at call sites)**

Every parameter in a function declaration must have an explicit type annotation. Never rely on TypeScript to infer parameter types, even in callbacks where inference is possible.

For generic functions, use descriptive generic type parameters (e.g., `TInput`, `TOutput`) rather than single letters.

**Incorrect (inferred callback parameter types):**

```typescript
items.filter((item) => item.active);
```

**Incorrect (untyped parameters):**

```typescript
function process(data) {
  return data.map((x) => x.value);
}
```

**Correct (explicit parameter types):**

```typescript
items.filter((item: Item) => item.active);
```

**Correct (explicit types on standalone functions):**

```typescript
const process = (data: Data[]) => data.map((x: Data) => x.value);
```

**Correct (generic with descriptive names):**

```typescript
const mapItems = <TInput, TOutput>(items: TInput[], transform: (item: TInput) => TOutput) => items.map(transform);
```

### 1.5 Never Use Classes — Prefer Functions and Closures

**Impact: HIGH (eliminates `this` binding issues and favors functional composition)**

Use plain functions and closures instead of classes. Classes introduce `this` binding confusion, implicit mutation, and ceremony that plain functions avoid. Closures naturally encapsulate state without the pitfalls of class-based `this`.

**Incorrect (class with `this` binding issues):**

```typescript
class UserRepository {
  constructor(private db: Database) {}

  async findById(id: string) {
    return this.db.findUnique({ where: { id } });
  }
}

const repo = new UserRepository(db);
const find = repo.findById;
find("123"); // TypeError: cannot read properties of undefined
```

**Correct (closure — no `this`, no binding issues):**

```typescript
const createUserRepository = (db: Database) => ({
  findById: async (id: string) => db.findUnique({ where: { id } }),
});

const repo = createUserRepository(db);
const find = repo.findById;
find("123"); // works correctly
```

Closures also make the pure/side-effect distinction clear. Pure factory functions return objects of pure functions. Side-effecting factory functions (like one that connects to a database) use `function` declarations:

```typescript
async function createUserRepository(connectionString: string) {
  const db = await connect(connectionString);
  return {
    findById: async (id: string) => db.findUnique({ where: { id } }),
  };
}
```

### 1.6 Required Positional Params Then Options Object

**Impact: MEDIUM (makes function signatures scannable and extensible)**

When a function takes multiple parameters, place required positional parameters first, then an options object for optional or configuration parameters. This makes call sites readable and allows adding new options without breaking changes.

Always extract the options object type to a named `type` rather than inlining it.

**Incorrect (many positional parameters):**

```typescript
function saveToDatabase(record: Record, options: SaveOptions, userId: string) {
  // ...
}

saveToDatabase(record, { upsert: true }, "user-123");
```

**Incorrect (inlined options type):**

```typescript
const saveToDatabase = (record: Record, params: { options: SaveOptions; userId: string }) => {
  // ...
};
```

**Correct (required positional, then options object with extracted type):**

```typescript
type SaveToDatabaseParams = {
  options: SaveOptions;
  userId: string;
};

async function saveToDatabase(record: Record, params: SaveToDatabaseParams) {
  // ...
}

saveToDatabase(record, { options: { upsert: true }, userId: "user-123" });
```

This pattern scales well. Adding a new optional parameter only requires updating the type and the implementation, not every call site.

### 1.7 Default Exports Follow Function Convention

**Impact: MEDIUM (consistent export style ensures pure/side-effect distinction is visible at export)**

Default exports follow the same pure/side-effect convention. A pure function uses `const` with arrow syntax and is exported separately. A side-effecting function uses a `function` declaration exported directly.

**Incorrect (arrow function as default for side-effecting code):**

```typescript
export default async (id: string) => {
  await db.delete(id);
};
```

**Incorrect (function declaration for pure logic as default):**

```typescript
export default function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Correct (side-effecting — function declaration):**

```typescript
export default async function deleteUser(id: string) {
  await db.delete(id);
}
```

**Correct (pure — const arrow exported as default):**

```typescript
const calculateTotal = (items: Item[]) => items.reduce((sum, item) => sum + item.price, 0);

export default calculateTotal;
```

Named exports use inline `export` on the declaration, following the same convention:

```typescript
export const add = (a: number, b: number) => a + b;

export async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```

### 1.8 Inline Callbacks When No Braces Needed

**Impact: LOW (keeps code concise for simple expressions)**

When a callback is pure and simple enough that it doesn't need braces (implicit return), pass it inline rather than extracting to a named variable. This reduces indentation and keeps the intent local.

**Incorrect (extracting trivial pure callbacks):**

```typescript
const isActive = (item: Item) => item.active;
items.filter(isActive);
```

**Correct (inline when no braces needed):**

```typescript
items.filter((item: Item) => item.active);
```

**Correct (extract when braces are needed or logic is complex):**

```typescript
const calculateDiscount = (order: Order) => order.items.reduce((sum: number, item: Item) => sum + item.price, 0) * 0.1;

const discountedTotal = orders.map(calculateDiscount);
```

The rule: inline when the callback is a single expression. Extract when it needs multiple statements or would reduce readability.

---

## 2. Type System

**Impact: HIGH**

TypeScript's type system is the primary tool for expressing intent and catching errors. Using `type` exclusively, banning `enum`, leveraging `as const`, and avoiding type assertions ensures types are precise, inferable, and safe. These rules maximize the type system's ability to prevent bugs while keeping code readable.

### 2.1 Never Use Type Assertions (as Type)

**Impact: CRITICAL (type assertions bypass the type system and hide real bugs)**

Never use type assertions (`as Type`). They override TypeScript's type checker, telling the compiler "trust me, I know better" — which is exactly when bugs happen. Type assertions don't perform any runtime check; they silently allow invalid types through.

**Incorrect (type assertion bypasses safety):**

```typescript
const user = data as User;
const value = result as string;
const element = document.querySelector(".box") as HTMLElement;
```

**Correct alternatives:**

Use user-defined type guards for narrowing from `unknown`:

```typescript
const isUser = (value: unknown): value is User => typeof value === "object" && value !== null && "name" in value;

const user = isUser(data) ? data : undefined;
```

Use runtime validation (Zod/valibot) at boundaries:

```typescript
const UserSchema = z.object({ name: z.string(), email: z.string() });
const user = UserSchema.parse(data);
```

Use `satisfies` to verify a value conforms to a type without widening:

```typescript
const config = { port: 3000, host: "localhost" } satisfies Config;
```

Non-null assertion (`!`) is also a type assertion and is equally banned. Use optional chaining and nullish coalescing instead:

```typescript
// Incorrect
const name = user!.name;

// Correct
const name = user?.name ?? "Unknown";
```

There are no exceptions. If TypeScript can't infer the type, fix the types — don't override them.

### 2.2 Never Use Non-Null Assertion (!)

**Impact: CRITICAL (non-null assertion is a type assertion that bypasses safety)**

The non-null assertion operator (`!`) is a type assertion. It tells TypeScript to treat a value as non-null without any runtime verification. This is just as dangerous as `as Type` and is equally banned.

**Incorrect (non-null assertion):**

```typescript
const name = user!.name;
const element = document.querySelector(".box")! as HTMLElement;
const items = data!.items;
```

**Correct (optional chaining + nullish coalescing):**

```typescript
const name = user?.name ?? "Unknown";
```

**Correct (type guard):**

```typescript
const isHTMLElement = (el: Element | null): el is HTMLElement => el !== null && el instanceof HTMLElement;

const element = document.querySelector(".box");
if (isHTMLElement(element)) {
  // element is now HTMLElement
}
```

**Correct (explicit null check):**

```typescript
if (data === null || data === undefined) {
  throw new NotFoundError("Data not found");
}
// data is now non-null, TypeScript narrows automatically
const items = data.items;
```

If TypeScript says a value might be null, the correct response is to handle that case — not to assert it away.

### 2.3 Use type Alias, Never interface

**Impact: HIGH (consistent type definition syntax across the codebase)**

Always use `type` for defining object shapes, unions, intersections, and any other type definition. Never use `interface`. `type` is more flexible (supports unions, intersections, conditional types, mapped types) and eliminates the need to choose between two syntaxes.

**Incorrect (using interface):**

```typescript
interface User {
  name: string;
  email: string;
}
```

**Correct (using type):**

```typescript
type User = {
  name: string;
  email: string;
};
```

`type` handles everything `interface` does, plus unions, intersections, and advanced type operations:

```typescript
type Status = "active" | "inactive" | "pending";
type Admin = User & { role: "admin"; permissions: string[] };
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
```

There is no situation where `interface` is required. Declaration merging — the one feature `interface` has that `type` doesn't — is an anti-pattern that creates hidden coupling.

### 2.4 Never Use TypeScript enum

**Impact: HIGH (avoids runtime bloat and non-standard semantics)**

Never use TypeScript `enum`. Enums generate unnecessary runtime code, have surprising semantics (reverse mapping for numeric enums), and don't align with TypeScript's type-first philosophy. Use union types for simple cases and const arrays with derived types when you need both the values and the type.

**Incorrect (enum):**

```typescript
enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
}
```

**Correct (union type for simple cases):**

```typescript
type Status = "active" | "inactive" | "pending";
```

**Correct (const array + derived type when you need both values and type):**

```typescript
const STATUSES = ["active", "inactive", "pending"] as const;
type Status = (typeof STATUSES)[number];
```

The const array pattern gives you:

- Runtime iteration: `STATUSES.forEach(...)`
- Type safety: `Status` is `'active' | 'inactive' | 'pending'`
- Lookup: `STATUSES.includes(value)`
- No generated JavaScript code for the type

### 2.5 Use User-Defined Type Predicates for Narrowing

**Impact: HIGH (safe narrowing without type assertions)**

When TypeScript can't narrow a type automatically (e.g., from `unknown` to `User`), use user-defined type predicates (`value is Type`) instead of type assertions. Type predicates express the narrowing logic in a runtime-checkable way that TypeScript can verify.

**Incorrect (type assertion for narrowing):**

```typescript
const user = data as User;
```

**Correct (type guard function with predicate):**

```typescript
const isUser = (value: unknown): value is User =>
  typeof value === "object" && value !== null && "name" in value && "email" in value;

if (isUser(data)) {
  // data is now narrowed to User
  console.log(data.name);
}
```

**Common type guards:**

```typescript
const isString = (value: unknown): value is string => typeof value === "string";

const isNonNullable = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined;

const hasProperty = <K extends string>(value: unknown, key: K): value is Record<K, unknown> =>
  typeof value === "object" && value !== null && key in value;
```

For complex validation at API boundaries, use a runtime validation library (Zod, valibot) instead of manual type guards. Type guards are appropriate for narrowing within your application where the runtime check is simple.

### 2.6 Const Array with Derived Type for Fixed Value Sets

**Impact: MEDIUM (provides both runtime values and type safety without enums)**

When you need both the runtime values (for iteration, lookup, mapping) and the type (for type checking), use a `const` array with a derived type. Never use enums.

**Incorrect (enum for iteration and typing):**

```typescript
enum Role {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

// Need runtime iteration
const roles = Object.values(Role);
```

**Incorrect (duplicated values and type):**

```typescript
const roles = ["admin", "editor", "viewer"];
type Role = "admin" | "editor" | "viewer";
```

**Correct (const array + derived type, single source of truth):**

```typescript
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];

// Runtime iteration
ROLES.forEach((role) => {
  console.log(role);
});

// Type checking
const hasRole = (value: string): value is Role => ROLES.includes(value as Role);
```

This pattern keeps values and types in sync automatically. Add a value to `ROLES` and the `Role` type updates immediately.

### 2.7 Use Intersection for Type Composition

**Impact: MEDIUM (creates new types by combining existing ones)**

Use intersection (`&`) to compose types from existing ones. This is the TypeScript-idiomatic way to extend or combine types, replacing class inheritance and interface extension.

**Incorrect (interface extends):**

```typescript
interface Admin extends User {
  role: "admin";
  permissions: string[];
}
```

**Correct (intersection composition):**

```typescript
type Admin = User & { role: "admin"; permissions: string[] };
```

**Correct (composing with utility types):**

```typescript
type AdminWithPermissions = User & { role: "admin"; permissions: string[] };
type AdminPreview = Pick<Admin, "id" | "name" | "role">;
```

Intersection is more flexible than `extends`:

- Works with any type (not just object shapes)
- Can compose unions
- Can be used inline without a separate declaration
- Works with `type` (which we always use)

```typescript
// Composing with unions
type ActiveAdmin = Admin & { status: "active" };

// Composing with Omit
type AdminWithoutRole = Omit<Admin, "role"> & { role: "superadmin" };
```

### 2.8 Use Readonly for Unmutated Parameters

**Impact: MEDIUM (communicates intent and prevents accidental mutation)**

Use `Readonly<T>` for object parameters and `readonly T[]` for array parameters that the function does not mutate. Do not mark individual properties as `readonly` on type definitions — use `Readonly<T>` at the parameter level instead.

**Incorrect (no readonly on parameters):**

```typescript
const processItems = (items: string[]) => {
  return items.toSorted();
};

const updateConfig = (config: Config) => {
  return { ...config, updatedAt: Date.now() };
};
```

**Incorrect (readonly on individual properties):**

```typescript
type Config = {
  readonly port: number;
  readonly host: string;
};
```

**Correct (Readonly and readonly array on parameters):**

```typescript
const processItems = (items: readonly string[]) => {
  return items.toSorted();
};

const updateConfig = (config: Readonly<Config>) => {
  return { ...config, updatedAt: Date.now() };
};
```

This makes the contract clear at the function signature: the caller's data won't be modified. `Readonly<T>` and `readonly T[]` on parameters signal "I won't mutate your data" without cluttering the type definition.

### 2.9 Extract Parameter Object Types to Named type

**Impact: MEDIUM (named types are reusable and self-documenting)**

When a function takes an options/parameter object, extract the object type to a named `type` rather than inlining it in the parameter. Named types are reusable, self-documenting, and can be exported separately.

**Incorrect (inline object type):**

```typescript
async function saveToDatabase(record: Record, params: { options: SaveOptions; userId: string; validate: boolean }) {
  // ...
}
```

**Correct (named extracted type):**

```typescript
type SaveToDatabaseParams = {
  options: SaveOptions;
  userId: string;
  validate: boolean;
};

async function saveToDatabase(record: Record, params: SaveToDatabaseParams) {
  // ...
}
```

Named types can be:

- Exported for use in other modules
- Referenced in JSDoc
- Composed with other types via intersection or union
- Used as type arguments for generic functions

### 2.10 Use as const for Literals and Immutable Objects

**Impact: MEDIUM (narrows types to literal values and prevents mutation)**

Use `as const` when you need TypeScript to infer the narrowest possible literal types from a value. This is essential for creating readonly tuples, literal union types, and immutable configuration objects.

**Incorrect (TypeScript widens to broad types):**

```typescript
const roles = ["admin", "editor", "viewer"];
// typeof roles = string[] — too wide

const config = { port: 3000, host: "localhost" };
// typeof config = { port: number; host: string } — too wide
```

**Correct (as const narrows to literal types):**

```typescript
const roles = ["admin", "editor", "viewer"] as const;
// typeof roles = readonly ['admin', 'editor', 'viewer']

type Role = (typeof roles)[number];
// type Role = 'admin' | 'editor' | 'viewer'

const config = { port: 3000, host: "localhost" } as const;
// typeof config = { readonly port: 3000; readonly host: 'localhost' }
```

Use `as const` for:

- Const arrays that serve as the source for derived union types
- Configuration objects that should be immutable
- Tuple types where order matters
- Any value where you need literal types instead of widened types

Do not use `as const` for simple variable assignments where the type is not used for derivation:

```typescript
// Unnecessary — the type is already correct
const name = "Alice" as const;

// Necessary — the type needs to be narrow
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];
```

### 2.11 Use satisfies Only for Type Checking Without Widening

**Impact: MEDIUM (prefer as const for immutability; use satisfies to verify a type without widening)**

`satisfies` is for type-checking a value against a broader type without widening the value's inferred type. Use it when you need to verify conformance while preserving the narrower inferred type. For immutability and literal types, prefer `as const`.

**Incorrect (using satisfies when you need immutability):**

```typescript
const config = { port: 3000, host: "localhost" } satisfies Config;
// typeof config = { port: number; host: string } — widened, mutable
```

**Correct (as const for immutability and narrow types):**

```typescript
const config = { port: 3000, host: "localhost" } as const;
// typeof config = { readonly port: 3000; readonly host: 'localhost' }
```

**Correct (satisfies for type-checking without widening):**

```typescript
type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
};

const colors = {
  primary: "#007bff",
  secondary: "#6c757d",
  accent: "#28a745",
} satisfies ThemeColors;
// typeof colors = { primary: '#007bff'; secondary: '#6c757d'; accent: '#28a745' }
// Narrow types preserved, but verified against ThemeColors
```

`satisfies` catches errors (missing keys, wrong types) while keeping the value's precise type. Use it for configuration validation and type-checking. Use `as const` when you need readonly and literal types.

### 2.12 Place Generics on Functions, Not Type Aliases

**Impact: MEDIUM (keeps type inference working at call sites)**

When a function's output type depends on its input type, place the generic type parameter on the function itself, not on a separate type alias. This allows TypeScript to infer the generic type at the call site without explicit annotation.

**Incorrect (generic on type alias, requires explicit annotation):**

```typescript
type Mapper<TInput, TOutput> = (items: TInput[], fn: (item: TInput) => TOutput) => TOutput[];
const map: Mapper<number, string> = (items, fn) => items.map(fn);
```

**Correct (generic on function, inferred at call site):**

```typescript
const mapItems = <TInput, TOutput>(items: TInput[], fn: (item: TInput) => TOutput) => items.map(fn);

// TypeScript infers TInput=number, TOutput=string automatically
const result = mapItems([1, 2, 3], (n) => `Item ${n}`);
```

Generic type parameters should use descriptive names: `TInput`, `TOutput`, `TKey`, `TValue` — not single letters like `T`, `U`, `V`.

```typescript
// Incorrect — single letter generics
const first = <T>(items: T[]) => items[0];

// Correct — descriptive generic names
const first = <TItem>(items: TItem[]) => items[0];
```

### 2.13 Use Descriptive Generic Names (TInput, Not T)

**Impact: MEDIUM (self-documenting generics improve readability)**

Generic type parameters should use descriptive names prefixed with `T`: `TInput`, `TOutput`, `TKey`, `TValue`. Never use single letters like `T`, `U`, `V` or `A`, `B`, `C`.

**Incorrect (single-letter generics):**

```typescript
const mapItems = <A, B>(items: A[], fn: (item: A) => B) => items.map(fn);

const first = <T>(items: T[]) => items[0];
```

**Correct (descriptive generic names):**

```typescript
const mapItems = <TInput, TOutput>(items: TInput[], fn: (item: TInput) => TOutput) => items.map(fn);

const first = <TItem>(items: TItem[]) => items[0];
```

Descriptive names make it immediately clear what role each generic plays in the function's contract, especially in functions with multiple type parameters.

### 2.14 Prefer Built-in Utility Types

**Impact: LOW (reduces boilerplate and improves readability)**

Use TypeScript's built-in utility types (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters`, etc.) instead of manually defining equivalent types. They are well-understood, type-safe, and reduce duplication.

**Incorrect (manually defining what a utility type already provides):**

```typescript
type UserUpdate = {
  name?: string;
  email?: string;
  avatar?: string;
};
```

**Correct (using built-in utility types):**

```typescript
type UserUpdate = Partial<Pick<User, "name" | "email" | "avatar">>;
```

**More examples:**

```typescript
// Readonly version of a type
type FrozenConfig = Readonly<Config>;

// Pick specific properties
type UserPreview = Pick<User, "id" | "name" | "avatar">;

// Omit specific properties
type UserWithoutPassword = Omit<User, "password">;

// Function return type
type ApiResponse = ReturnType<typeof fetchUser>;

// Record type for maps
type UserRoleMap = Record<UserRole, Permission[]>;
```

Only define custom types when the built-in utilities can't express what you need.

---

## 3. Immutability & Safety

**Impact: HIGH**

Never mutating arguments, preferring immutable array methods, and using spread for object updates eliminates entire classes of bugs. Combined with const-by-default and runtime validation at boundaries, these rules make data flow predictable and traceable.

### 3.1 Never Mutate Function Arguments

**Impact: CRITICAL (prevents side-effect bugs and makes data flow predictable)**

Never mutate arguments passed to a function. This includes array methods that modify in-place (`.sort()`, `.splice()`, `.push()`), object property assignment, and any direct mutation. Always return new values instead.

**Incorrect (mutating arguments):**

```typescript
const sortUsers = (users: User[]) => {
  users.sort((a, b) => a.name.localeCompare(b.name));
  return users;
};

const updateName = (user: User, name: string) => {
  user.name = name;
  return user;
};
```

**Correct (returning new values):**

```typescript
const sortUsers = (users: readonly User[]) => users.toSorted((a, b) => a.name.localeCompare(b.name));

const updateName = (user: User, name: string): User => ({ ...user, name });
```

Mutation causes bugs that are hard to trace because the caller's data changes unexpectedly. Immutable patterns make data flow explicit and predictable.

### 3.2 const by Default, let Only When Reassigned, var Banned

**Impact: HIGH (prevents accidental reassignment and signals intent)**

Always use `const` for variable declarations. Use `let` only when the variable is actually reassigned. Never use `var`. This makes intent clear: `const` means "this value won't change," and the rare `let` signals "this value changes."

**Incorrect (let when no reassignment):**

```typescript
let items = [1, 2, 3];
let config = { port: 3000 };
let result = processData(input);
```

**Incorrect (var anywhere):**

```typescript
var count = 0;
```

**Correct (const by default, let only for reassignment):**

```typescript
const items = [1, 2, 3];
const config = { port: 3000 };
const result = processData(input);

// let only when the variable is reassigned
let total = 0;
for (const item of items) {
  total += item.price;
}
```

In `for...of` and `for...in` loops, always use `const`:

```typescript
for (const item of items) {
  // ...
}
```

Using `const` by default catches accidental reassignment bugs at compile time and makes code easier to reason about.

### 3.3 Use Immutable Array Methods

**Impact: HIGH (prevents accidental mutation of arrays in React and functional code)**

Always use the immutable versions of array methods: `toSorted()` instead of `sort()`, `toReversed()` instead of `reverse()`, `toSpliced()` instead of `splice()`, and `with()` instead of bracket assignment. These methods return new arrays instead of mutating the original.

**Incorrect (mutating array methods):**

```typescript
items.sort((a, b) => a.name.localeCompare(b.name));
items.reverse();
items.splice(2, 1);
items[0] = newItem;
```

**Correct (immutable array methods):**

```typescript
const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name));
const reversed = items.toReversed();
const spliced = items.toSpliced(2, 1);
const updated = items.with(0, newItem);
```

These methods are available in all modern environments (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). For older environments, use spread:

```typescript
const sorted = [...items].sort(compareFn);
```

Mutation is especially dangerous in React and functional code where data is expected to be treated as read-only. Using immutable methods eliminates an entire class of bugs.

### 3.4 Use Spread for Object Updates

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
const updateConfig = (config: Config, updates: Partial<Config>): Config => ({ ...config, ...updates });
```

**Correct (nested updates with deep spread):**

```typescript
const updateUser = (user: User, name: string, email: string): User => ({
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

### 3.5 Runtime Validation at Boundaries with Zod or Valibot

**Impact: HIGH (prevents untrusted data from bypassing the type system)**

Use a runtime validation library (Zod, Valibot, or equivalent) to validate data at system boundaries — API responses, form inputs, parsed JSON, and any data from untrusted sources. TypeScript's type system is erased at runtime; runtime validation bridges the gap.

**Incorrect (type assertion on untrusted data):**

```typescript
const user = response.data as User;
```

**Incorrect (no validation):**

```typescript
const data = JSON.parse(rawString) as ApiResult;
```

**Correct (Zod schema validation):**

```typescript
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
});

type User = z.infer<typeof UserSchema>;

const user = UserSchema.parse(response.data);
```

**Correct (Valibot validation):**

```typescript
import * as v from "valibot";

const UserSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

type User = v.InferOutput<typeof UserSchema>;

const user = v.parse(UserSchema, response.data);
```

Key boundaries that need validation:

- API responses
- Form submissions
- URL parameters and search params
- localStorage / sessionStorage reads
- File contents
- WebSocket messages
- Any `JSON.parse()` result

### 3.6 Use const in for...of Loops

**Impact: LOW (signals that the loop variable is not reassigned)**

Always use `const` in `for...of` and `for...in` loops. The loop variable is a new binding for each iteration, so `const` is correct and signals that the variable won't be reassigned within the loop body.

**Incorrect (let in for...of):**

```typescript
for (let item of items) {
  console.log(item.name);
}
```

**Correct (const in for...of):**

```typescript
for (const item of items) {
  console.log(item.name);
}
```

This follows the same principle as `const` by default: if you don't reassign, use `const`.

---

## 4. Null & Optionality

**Impact: MEDIUM**

Consistent handling of absence and failure through `undefined`, optional chaining, and nullish coalescing eliminates null-pointer surprises. Using `?` for optional parameters and `T | undefined` for failure signaling creates a uniform pattern that's easy to read and reason about.

### 4.1 Use T | undefined to Signal Failure

**Impact: MEDIUM (consistent failure signaling without exceptions)**

When a function can fail to produce a value (not found, invalid input, etc.), return `T | undefined` rather than throwing an exception. Throw exceptions only for truly exceptional conditions. This makes failure a visible part of the type signature and forces callers to handle it.

**Incorrect (throwing for expected failures):**

```typescript
function findUser(id: string): User {
  const user = db.find(id);
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }
  return user;
}
```

**Correct (returning undefined for expected "not found"):**

```typescript
const findUser = (id: string): User | undefined => db.find(id);
```

**When to throw vs return undefined:**

Return `T | undefined` when:

- The function is a lookup/query that may not find a result
- The failure is an expected, normal outcome
- The caller should decide how to handle the absence

Throw an exception when:

- The failure is truly exceptional and unexpected
- The function is performing a mutation that failed
- The failure should bubble up and be caught at a boundary

```typescript
// Return undefined — "not found" is normal
const findUser = (id: string): User | undefined => db.find(id);

// Throw — "already exists" is exceptional
async function createUser(data: CreateUserDTO): Promise<User> {
  const existing = findUser(data.email);
  if (existing) {
    throw new ConflictError(`User ${data.email} already exists`);
  }
  return db.insert(data);
}
```

### 4.2 Use Nullish Coalescing (??) Instead of Logical OR (||)

**Impact: MEDIUM (prevents falsy value bugs with 0, empty string, and false)**

Always use `??` (nullish coalescing) for default values, not `||` (logical OR). The `||` operator treats `0`, `""`, and `false` as falsy and falls back to the default, which is almost always a bug. `??` only falls back for `null` and `undefined`.

**Incorrect (logical OR treats 0 and '' as falsy):**

```typescript
const count = items.length || 10;
const name = user.name || "Unknown";
const isEnabled = config.enabled || false;
```

When `items.length` is `0`, `user.name` is `""`, or `config.enabled` is `false`, `||` incorrectly falls back to the default.

**Correct (nullish coalescing only falls back for null/undefined):**

```typescript
const count = items.length ?? 10;
const name = user.name ?? "Unknown";
const isEnabled = config.enabled ?? false;
```

`??` only replaces the value when it's `null` or `undefined`, preserving legitimate falsy values like `0`, `""`, and `false`.

### 4.3 Use Optional Chaining Wherever Nullable

**Impact: MEDIUM (concise and safe property access on nullable values)**

Use `?.` (optional chaining) whenever accessing a property on a value that might be `null` or `undefined`. This is more concise and safer than explicit null checks.

**Incorrect (explicit null checks):**

```typescript
if (user && user.address && user.address.city) {
  return user.address.city;
}
return "Unknown";
```

**Correct (optional chaining):**

```typescript
return user?.address?.city ?? "Unknown";
```

**Incorrect (manual array access check):**

```typescript
if (items && items.length > 0 && items[0] && items[0].name) {
  return items[0].name;
}
return undefined;
```

**Correct (optional chaining):**

```typescript
return items?.[0]?.name;
```

Optional chaining is appropriate for any property access where the parent might be nullish. It's clear, concise, and eliminates nested `if` blocks.

### 4.4 Use ? for Optional Parameters, Not | undefined

**Impact: MEDIUM (cleaner signatures and consistent optional parameter style)**

When a parameter is optional, use the `?` modifier instead of making the type a union with `undefined`. The `?` syntax is more concise and clearly signals "this parameter can be omitted."

**Incorrect (explicit undefined union):**

```typescript
function greet(name: string, title: string | undefined) {
  // ...
}

const add = (a: number, b: number, offset: number | undefined) => (offset ? a + b + offset : a + b);
```

**Correct (optional parameter with ?):**

```typescript
function greet(name: string, title?: string) {
  // ...
}

const add = (a: number, b: number, offset?: number) => (offset ? a + b + offset : a + b);
```

The `?` syntax is equivalent to `| undefined` in the parameter type, but it's more readable and makes the intent explicit: the parameter is meant to be omitted, not passed as `undefined`.

### 4.5 Use undefined as Default for No Value

**Impact: MEDIUM (consistent representation of absence across the codebase)**

Use `undefined` as the default way to represent "no value" or "not yet set." Reserve `null` for when something "explicitly does not exist" — a semantic distinction that signals intent. `undefined` integrates naturally with optional parameters and object properties, making it the better default.

**Incorrect (null for missing values):**

```typescript
function findUser(id: string): User | null {
  // ...
}

function greet(name?: string | null) {
  // ...
}
```

**Correct (undefined for missing, null for explicitly empty):**

```typescript
// undefined = "does not exist yet" (most common)
function findUser(id: string): User | undefined {
  // ...
}

// null = "explicitly does not exist" (rare, intentional)
type ConnectionState = "connecting" | "connected" | "disconnected" | null;
// null here means "explicitly no connection", not "connection unknown"
```

`undefined` is the natural choice because:

- Optional parameters default to `undefined`
- Missing object properties are `undefined`
- `??` (nullish coalescing) treats both `null` and `undefined`, so it works either way
- TypeScript's `?` syntax produces `undefined`, not `null`

---

## 5. Control Flow

**Impact: MEDIUM**

Early returns, ternaries for simple conditionals, object maps for lookups, and switch-with-braces for complex branching make control flow predictable and flat. Banning nested ternaries forces extraction, which improves readability and testability.

### 5.1 Always Use Early Returns, Avoid Deep Nesting

**Impact: HIGH (flat control flow is easier to read and reason about)**

Return early when conditions fail. This flattens code, reduces nesting, and makes the "happy path" immediately visible. Never write deeply nested conditionals — guard clauses first, then the main logic.

**Incorrect (deeply nested conditionals):**

```typescript
function process(user: User) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        return transform(user);
      }
      return null;
    }
    return null;
  }
  return null;
}
```

**Correct (early returns, flat structure):**

```typescript
const process = (user: User | undefined) => {
  if (!user) return undefined;
  if (!user.active) return undefined;
  if (!user.verified) return undefined;

  return transform(user);
};
```

Early returns follow the "fail fast" principle. Each guard clause says "here's why we can't proceed." After all guards, the remaining code is the happy path with zero nesting.

### 5.2 Nested Ternaries Are Banned

**Impact: HIGH (nested ternaries are unreadable; extract to a function)**

Never nest ternary expressions. They are difficult to read, hard to debug, and force readers to mentally track multiple branching conditions. When logic requires more than one condition, extract it into a named function with early returns.

**Incorrect (nested ternary):**

```typescript
const label = role === "admin" ? "Admin" : role === "mod" ? "Moderator" : "User";
```

**Correct (extracted function with early returns):**

```typescript
const getLabel = (role: "admin" | "mod" | "user") => {
  if (role === "admin") {
    return "Admin";
  }
  if (role === "mod") {
    return "Moderator";
  }
  return "User";
};

const label = getLabel(role);
```

The extracted function is:

- Testable — you can unit test `getLabel` independently
- Debuggable — you can set breakpoints on each branch
- Readable — each condition gets its own line
- Extensible — adding a new role doesn't make the line longer

### 5.3 Use Object Map for Simple Lookups

**Impact: MEDIUM (object maps are more concise and performant than if/else chains for value mapping)**

When mapping a set of known keys to values (with no complex logic per branch), use an object map or `Record` type instead of `switch`, `if/else`, or ternaries. Object maps are O(1) lookups, more concise, and easier to extend.

**Incorrect (switch for simple value mapping):**

```typescript
switch (status) {
  case "active":
    return "green";
  case "inactive":
    return "red";
  case "pending":
    return "yellow";
  default:
    return "gray";
}
```

**Correct (object map):**

```typescript
const STATUS_COLORS: Record<Status, string> = {
  active: "green",
  inactive: "red",
  pending: "yellow",
};

const color = STATUS_COLORS[status] ?? "gray";
```

Use object maps when:

- Each branch maps a key to a static value
- No complex logic per branch
- The key set is known and finite

Use `switch` with braces when:

- Each branch has complex logic (side effects, multiple statements)
- The mapping depends on more than a simple key

### 5.4 Use Switch with Braces for Complex Branching

**Impact: MEDIUM (switch with braces is explicit and prevents scope bugs)**

When logic per branch is too complex for an object map, use a `switch` statement. Always wrap each `case` in braces `{ }` to create a block scope. This prevents variable name collisions and makes each branch visually distinct.

**Incorrect (switch without braces):**

```typescript
switch (status) {
  case "active":
    const message = "Account active";
    sendNotification(message);
    break;
  case "pending":
    const message = "Pending verification"; // Error: Cannot redeclare block-scoped variable
    sendNotification(message);
    break;
}
```

**Correct (switch with braces):**

```typescript
switch (status) {
  case "active": {
    const message = "Account active";
    sendNotification(message);
    break;
  }
  case "pending": {
    const message = "Pending verification";
    sendNotification(message);
    break;
  }
  default: {
    const message = "Unknown status";
    logWarning(message);
  }
}
```

Braces give each `case` its own scope, preventing variable redeclaration errors and making the code structure explicit. Always include a `default` case.

### 5.5 Prefer Ternary for Assignment and Return

**Impact: MEDIUM (concise conditional expressions for values)**

Use ternary expressions (`?:`) for conditional assignments and return values. Ternaries are expressions — they produce a value — which makes them more composable and concise than `if/else` for value selection.

**Incorrect (if/else for assignment):**

```typescript
let label: string;
if (isActive) {
  label = "Active";
} else {
  label = "Inactive";
}
```

**Correct (ternary for assignment):**

```typescript
const label = isActive ? "Active" : "Inactive";
```

**Correct (ternary in return):**

```typescript
return isActive ? renderActive() : renderInactive();
```

Use ternaries whenever both branches produce a value. Use early returns when only one branch matters (see `control-early-return`).

---

## 6. Async Patterns

**Impact: MEDIUM**

Consistent async/await style, .catch() over try/catch, and always parallelizing independent operations makes asynchronous code readable and correct. Distinguishing pure iteration (map/filter) from side-effecting iteration (for...of) prevents accidental parallelism bugs.

### 6.1 Always Parallelize Independent Async Operations

**Impact: HIGH (sequential awaits for independent operations wastes time)**

When multiple async operations have no dependencies on each other, run them in parallel using `Promise.all()`. Sequential `await` calls for independent operations create unnecessary waterfalls.

**Incorrect (sequential independent operations):**

```typescript
async function loadData(userId: string) {
  const user = await fetchUser(userId);
  const config = await fetchConfig();
  const permissions = await fetchPermissions(userId);
  return { user, config, permissions };
}
```

**Correct (parallel independent operations):**

```typescript
async function loadData(userId: string) {
  const [user, config, permissions] = await Promise.all([fetchUser(userId), fetchConfig(), fetchPermissions(userId)]);
  return { user, config, permissions };
}
```

Only use sequential `await` when an operation depends on the result of the previous one:

```typescript
async function loadUserProfile(userId: string) {
  const user = await fetchUser(userId);
  const profile = await fetchProfile(user.id); // depends on user.id
  return { user, profile };
}
```

### 6.2 Use async/await Over .then() Chains

**Impact: MEDIUM (async/await is more readable and easier to debug than promise chains)**

Always use `async/await` syntax instead of `.then()` chains for asynchronous code. Async/await produces linear, easy-to-read code that follows the same control flow pattern as synchronous code.

**Incorrect (promise chain):**

```typescript
function fetchUserData(id: string) {
  return fetchUser(id)
    .then((user) => fetchProfile(user.id))
    .then((profile) => ({ user, profile }));
}
```

**Correct (async/await):**

```typescript
async function fetchUserData(id: string) {
  const user = await fetchUser(id);
  const profile = await fetchProfile(user.id);
  return { user, profile };
}
```

Async/await benefits:

- Linear control flow — reads top to bottom
- `try/catch` or `.catch()` for error handling (see `async-catch-over-trycatch`)
- Easier to set breakpoints and debug
- Works naturally with `for...of` for sequential async iteration
- Consistent with the side-effecting function declaration convention

### 6.3 Use .catch() Over try/catch

**Impact: MEDIUM (.catch() is more concise and avoids nested blocks)**

When handling errors in async code, prefer `.catch()` over `try/catch`. `.catch()` keeps the happy path flat and avoids a level of nesting.

**Incorrect (try/catch wrapping async call):**

```typescript
try {
  const user = await fetchUser(id);
  return user;
} catch (error: Error) {
  logError(error);
  return undefined;
}
```

**Correct (.catch() on the promise):**

```typescript
const user = await fetchUser(id).catch((error: Error) => {
  logError(error);
  return undefined;
});
```

Prefer `.catch()` when you're handling a single async operation's error and returning a fallback value. Use `try/catch` only when multiple sequential operations need to be wrapped in a single error handler.

```typescript
// try/catch is acceptable when multiple operations share error handling
try {
  const user = await fetchUser(id);
  const profile = await fetchProfile(user.id);
  return { user, profile };
} catch (error: Error) {
  logError(error);
  return undefined;
}
```

### 6.4 Use map/filter/reduce for Pure Iteration

**Impact: MEDIUM (functional methods are more expressive and composable for pure transforms)**

When iterating over collections for data transformation (no side effects), use `map`, `filter`, `reduce`, `flatMap`, and other functional array methods. These methods are composable, declarative, and align with the purity convention — the resulting function is an arrow function.

**Incorrect (for...of for pure transformation):**

```typescript
const names: string[] = [];
for (const user of users) {
  names.push(user.name);
}

const active: User[] = [];
for (const user of users) {
  if (user.active) {
    active.push(user);
  }
}
```

**Correct (functional methods for pure transforms):**

```typescript
const names = users.map((user: User) => user.name);

const active = users.filter((user: User) => user.active);
```

**Correct (chaining for composed transforms):**

```typescript
const sortedActiveNames = users
  .filter((user: User) => user.active)
  .map((user: User) => user.name)
  .toSorted();
```

Use `for...of` only when:

- Iterating with side effects (see `async-iteration-side-effects`)
- Breaking early from a loop (no `break` in `forEach`)
- Sequential async operations that depend on previous results

### 6.5 Use for...of for Side-Effecting Iteration

**Impact: MEDIUM (for...of makes side effects explicit and allows break/continue)**

When iteration involves side effects (I/O, mutations, logging, database writes), use `for...of` instead of `forEach` or `map`. `for...of` makes the side effect explicit (this is not a pure transform), supports `break`/`continue`, and works naturally with `await`.

**Incorrect (forEach with side effects):**

```typescript
users.forEach((user: User) => {
  saveToDatabase(user);
});
```

**Incorrect (map with side effects — ignores return value):**

```typescript
users.map((user: User) => {
  sendEmail(user.email, "Welcome");
  return user;
});
```

**Correct (for...of for side-effecting iteration):**

```typescript
for (const user of users) {
  saveToDatabase(user);
}
```

**Correct (for...of with async side effects):**

```typescript
for (const user of users) {
  await sendEmail(user.email, "Welcome");
}
```

For parallel async side effects, use `Promise.allSettled` (see `async-promise-all-settled`).

The function declaration convention makes this even clearer: a `for...of` loop inside a `function` declaration signals "this code has side effects."

### 6.6 Use Promise.allSettled for Parallel Side Effects

**Impact: MEDIUM (prevents partial failures from killing the entire batch)**

When running multiple side-effecting async operations in parallel (logging, analytics, writes), use `Promise.allSettled()` instead of `Promise.all()`. `Promise.all()` rejects on the first failure, which can abort remaining operations that should still complete.

**Incorrect (Promise.all aborts on first failure):**

```typescript
await Promise.all([
  sendEmail(user.email, "Welcome"),
  logEvent("user_created", { userId: user.id }),
  updateSearchIndex(user.id),
]);
// If sendEmail fails, logEvent and updateSearchIndex are never awaited
```

**Correct (Promise.allSettled runs all to completion):**

```typescript
const results = await Promise.allSettled([
  sendEmail(user.email, "Welcome"),
  logEvent("user_created", { userId: user.id }),
  updateSearchIndex(user.id),
]);

for (const result of results) {
  if (result.status === "rejected") {
    logError(result.reason);
  }
}
```

Use `Promise.all()` when:

- All operations are pure data fetches
- A single failure means the whole batch is invalid
- You want to fail fast

Use `Promise.allSettled()` when:

- Operations are independent side effects
- Each should complete regardless of others
- You need to collect all results, including failures
- You'll handle errors individually

---

## 7. Module Organization

**Impact: MEDIUM**

One primary export per file, no barrel files, inline exports, and consistent import ordering make codebases navigable and bundler-friendly. Flat-by-feature directories and camelCase file naming create predictable file locations.

### 7.1 No Barrel Exports — Import Directly from Files

**Impact: HIGH (barrel files defeat tree-shaking and slow builds)**

Never create barrel files (index.ts files that re-export from other modules). Import directly from the source file. Barrel files force bundlers to include all re-exported modules, defeat tree-shaking, and slow down builds and type-checking.

**Incorrect (barrel file):**

```typescript
// utils/index.ts
export { formatName } from "./formatName";
export { validateEmail } from "./validateEmail";
export { saveUser } from "./saveUser";
export type { User } from "./types";
export type { FormattedName } from "./formatName";
```

```typescript
// consumer.ts
import { formatName, User } from "./utils";
```

**Correct (direct imports):**

```typescript
// consumer.ts
import formatName from "./formatName";
import type { User } from "./types";
```

Barrel files cause:

- Bundlers to include all re-exported modules even if only one is used
- Slower type-checking (TypeScript must resolve the entire barrel)
- Increased module graph complexity
- Hidden circular dependency issues
- Slower development server startup

Import directly from source files. The one-primary-export-per-file rule (see `module-one-export-per-file`) makes this natural.

### 7.2 One Primary Export Per File

**Impact: MEDIUM (makes modules focused and imports predictable)**

Each file should have one primary export (a default export). Additional named exports for types and internal utilities are acceptable, but the file's purpose should be centered on one main thing.

**Incorrect (multiple unrelated exports):**

```typescript
// userUtils.ts
export const formatName = (user: User) => `${user.first} ${user.last}`;
export async function saveUser(user: User) { ... }
export type UserDTO = { ... };
export const validateEmail = (email: string) => ...;
```

**Correct (one primary export per file, types as named exports):**

```typescript
// formatName.ts
export type FormattedName = { full: string; display: string };

export const formatName = (user: User): FormattedName => ({ full: `${user.first} ${user.last}`, display: user.first });

export default formatName;
```

```typescript
// saveUser.ts
export type SaveUserParams = { user: User; validate: boolean };

export default async function saveUser(params: SaveUserParams) {
  await db.insert(params.user);
}
```

This convention makes imports predictable: the file name tells you what the default export is, and named exports provide supporting types.

### 7.3 Flat Directory Structure by Feature

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

### 7.4 Inline Exports on Declarations

**Impact: MEDIUM (exports are visible at the declaration, not hidden at the file bottom)**

Place `export` directly on the declaration. Don't use bottom-of-file export blocks, which force readers to scroll to see what's exported and can drift out of sync with the implementation.

**Incorrect (bottom-of-file exports):**

```typescript
const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;

export { add, subtract };
```

**Correct (inline exports):**

```typescript
export const add = (a: number, b: number) => a + b;
export const subtract = (a: number, b: number) => a - b;
```

This also applies to function declarations:

```typescript
export async function saveToDatabase(record: Record) {
  await db.insert(record);
}
```

And to type exports:

```typescript
export type User = {
  name: string;
  email: string;
};
```

### 7.5 Types First, Then Functions in Files

**Impact: LOW (consistent file structure makes scanning faster)**

Organize files with type definitions at the top, followed by function declarations. This matches TypeScript's top-down resolution and makes the file's contract visible before the implementation.

**Incorrect (functions before types they depend on):**

```typescript
export const formatName = (user: User): FormattedName => ({ full: `${user.first} ${user.last}`, display: user.first });

export type FormattedName = { full: string; display: string };
export type User = { first: string; last: string };
```

**Correct (types first, then functions):**

```typescript
export type User = { first: string; last: string };
export type FormattedName = { full: string; display: string };

export const formatName = (user: User): FormattedName => ({ full: `${user.first} ${user.last}`, display: user.first });

export default formatName;
```

This convention applies at every level: modules, sections within a file, and even test files (types/mocks first, then tests).

### 7.6 External Imports First, Then Internal

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

### 7.7 Named and Default Imports

**Impact: LOW (consistent import style improves readability)**

Use named imports for utilities and types. Use default imports for the primary export of a module. Never use namespace imports (`import * as`).

**Incorrect (namespace import):**

```typescript
import * as Utils from "./utils";
import * as React from "react";
```

**Correct (named and default imports):**

```typescript
import formatName from "./formatName";
import type { User } from "./types";
import { useState, useEffect } from "react";
```

Namespace imports:

- Make it unclear what's actually used
- Prevent tree-shaking for the entire module
- Add noise at every usage site (`Utils.formatName` vs `formatName`)
- Are acceptable only when consuming a module with many exports that are all used together

### 7.8 Use camelCase for File Names

**Impact: LOW (consistent file naming makes files easy to find)**

Use `camelCase` for all TypeScript file names. This matches the variable and function naming convention and avoids cross-platform case-sensitivity issues.

**Incorrect:**

```
UserRepository.ts
user-repository.ts
user_repository.ts
USER_REPOSITORY.ts
```

**Correct:**

```
userRepository.ts
formatName.ts
saveToDatabase.ts
```

Exceptions:

- Directive files that require specific names (e.g., `next.config.ts`, `tsconfig.json`)
- Test files that follow a framework convention (e.g., `user.test.ts`)

---

## 8. Style & Naming

**Impact: LOW**

Consistent formatting and naming conventions—backtick strings, semicolons, trailing commas, camelCase variables, PascalCase types, is/has/should booleans—reduce cognitive overhead and make code scannable. These rules are low impact individually but collectively shape a uniform codebase.

### 8.1 Prefix Booleans with is/has/should

**Impact: MEDIUM (self-documenting boolean names at a glance)**

Boolean variables, parameters, and type properties should be prefixed with `is`, `has`, or `should` to make their boolean nature immediately clear. This eliminates ambiguity about what the value represents.

**Incorrect (ambiguous boolean names):**

```typescript
const active = true;
const admin = false;
const loading = true;
const permission = true;
```

**Correct (self-documenting boolean prefixes):**

```typescript
const isActive = true;
const isAdmin = false;
const isLoading = true;
const hasPermission = true;
```

Prefix guidelines:

- `is` for state/condition: `isActive`, `isVisible`, `isLoading`
- `has` for possession/containment: `hasPermission`, `hasChildren`, `hasError`
- `should` for intent/behavior: `shouldRetry`, `shouldValidate`, `shouldRedirect`

This also applies to type definitions:

```typescript
type User = {
  isActive: boolean;
  hasPermission: boolean;
  shouldResetPassword: boolean;
};
```

### 8.2 Catch Errors as Error Type

**Impact: MEDIUM (typed catch blocks enable proper error handling)**

Always type catch parameter as `Error`, never as `unknown` or `any`. This ensures you have access to `message`, `name`, and `stack` properties and forces consistent error handling.

**Incorrect (untyped or unknown catch):**

```typescript
try {
  await saveData(data);
} catch (error) {
  // untyped — error is unknown by default in strict mode
  console.log(error.message); // Error: Property 'message' does not exist on type 'unknown'
}

try {
  await saveData(data);
} catch (error: any) {
  // any — loses all type safety
  console.log(error);
}
```

**Correct (catch as Error):**

```typescript
try {
  await saveData(data);
} catch (error: Error) {
  if (error instanceof ValidationError) {
    logError(error);
  } else {
    logError(error);
    throw error;
  }
}
```

When using `.catch()` (preferred over try/catch — see `async-catch-over-trycatch`):

```typescript
const user = await fetchUser(id).catch((error: Error) => {
  logError(error);
  return undefined;
});
```

### 8.3 Custom Error Classes Extending Error

**Impact: MEDIUM (structured error handling enables precise catch blocks)**

Create custom error classes that extend `Error` for different error types in your application. This enables precise error handling with `instanceof` checks and adds context (error codes, metadata) to errors.

**Incorrect (plain Error):**

```typescript
throw new Error(`User not found`);
throw new Error(`Invalid input`);
```

**Correct (custom error classes):**

```typescript
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = `NotFoundError`;
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly fields: string[],
  ) {
    super(message);
    this.name = `ValidationError`;
  }
}

async function fetchUser(id: string) {
  const user = await db.find(id);
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }
  return user;
}
```

Custom errors enable type-safe catch blocks:

```typescript
try {
  await saveData(data);
} catch (error: Error) {
  if (error instanceof ValidationError) {
    // Handle validation errors specifically
    logError(error);
  } else {
    throw error;
  }
}
```

Even though we don't use classes for application code (see `function-no-classes`), custom error classes are the one exception — they're a built-in JavaScript pattern and `instanceof` requires the class hierarchy.

### 8.4 Parenthesize Implicit Object Returns

**Impact: MEDIUM (prevents ASI bugs and makes intent clear)**

When an arrow function implicitly returns an object literal, wrap the object in parentheses. This prevents TypeScript from interpreting the braces as a function body rather than an object literal.

**Incorrect (unparenthesized — parsed as function body):**

```typescript
const toDTO = (user: User) => { name: user.name, email: user.email };
// Returns undefined — braces treated as function body
```

**Correct (parenthesized):**

```typescript
const toDTO = (user: User) => ({
  name: user.name,
  email: user.email,
});
```

The parentheses make it unambiguous: the arrow function returns the object, rather than containing a block with a labeled statement. This is one of the most common TypeScript pitfalls for developers transitioning from JavaScript.

### 8.5 Leading Dot on New Line for Method Chaining

**Impact: MEDIUM (cleaner diffs and easier reading for chained calls)**

When chaining method calls across multiple lines, place the dot at the beginning of the next line, not at the end of the previous line. This makes the chain visually clear and produces cleaner git diffs.

**Incorrect (trailing dot):**

```typescript
const result = items
  .filter((item: Item) => item.active)
  .map((item: Item) => item.name)
  .toSorted();
```

**Correct (leading dot on new line):**

```typescript
const result = items
  .filter((item: Item) => item.active)
  .map((item: Item) => item.name)
  .toSorted();
```

Leading dots make it immediately clear that a line is a continuation of a chain, and adding or removing a step only changes one line.

### 8.6 Use Rest Parameters and Object Spread

**Impact: MEDIUM (rest params and spread are more type-safe than alternatives)**

Use rest parameters for variadic functions instead of array arguments. Use object spread for merging objects instead of `Object.assign`.

**Rest parameters (not array argument):**

```typescript
// Incorrect — caller must wrap in array
const log = (messages: string[]) => { ... };
log([`hello`, `world`]);

// Correct — caller passes directly
const log = (...messages: string[]) => { ... };
log(`hello`, `world`);
```

**Object spread (not Object.assign):**

```typescript
// Incorrect — Object.assign mutates the target
const updated = Object.assign({}, user, { name: `New` });

// Correct — spread creates a new object
const updated = { ...user, name: `New` };
```

Object spread:

- Always returns a new object (immutable)
- Is more readable and concise
- Has clearer TypeScript inference
- Doesn't have `Object.assign`'s mutation pitfalls

### 8.7 Use camelCase for Variables and PascalCase for Types

**Impact: MEDIUM (standard TypeScript convention that all codebases follow)**

Variables and functions use `camelCase`. Types and type aliases use `PascalCase`. This is the universal TypeScript convention and distinguishes values from types at a glance.

**Incorrect:**

```typescript
type user_account = { user_name: string };
const UserRecord = { name: `Alice` };
function GetProfile() { ... }
const user_email = `alice@example.com`;
```

**Correct:**

```typescript
type UserAccount = { userName: string };
const userRecord = { name: `Alice` };
function fetchProfile() { ... }
const userEmail = `alice@example.com`;
```

Convention summary:

| Kind      | Convention | Example                          |
| --------- | ---------- | -------------------------------- |
| Variables | camelCase  | `userName`, `isActive`           |
| Functions | camelCase  | `fetchProfile`, `calculateTotal` |
| Types     | PascalCase | `UserAccount`, `ApiResponse`     |
| Constants | camelCase  | `maxRetries`, `apiBaseUrl`       |
| Files     | camelCase  | `userRepository.ts`              |

### 8.8 Comments Explain Why, Not What

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
const data = cached ?? (await fetchFreshData());
```

Good comments explain:

- Why a seemingly wrong approach is correct
- Business rules that aren't obvious from variable names
- Edge cases and non-intuitive behavior
- Links to relevant documentation, issues, or decisions
- Performance considerations that drove a choice

### 8.9 Always Use Backtick Strings

**Impact: LOW (eliminates quote-style decisions and enables interpolation without syntax changes)**

Use backtick strings (template literals) for all strings, including plain strings with no interpolation. This eliminates the need to choose between single and double quotes, makes it easy to add interpolation later without changing delimiters, and provides a consistent style across the codebase.

**Incorrect (single or double quotes):**

```typescript
const name = "Alice";
const greeting = "Hello, " + name + "!";
const path = "/api/users/" + id;
```

**Correct (always backticks):**

```typescript
const name = `Alice`;
const greeting = `Hello, ${name}!`;
const path = `/api/users/${id}`;
```

Backtick strings are always correct:

- Plain strings: `` `Hello` ``
- Interpolated strings: `` `Hello, ${name}!` ``
- Multi-line strings: `` `line 1\nline 2` ``
- No quote escaping needed: `` `It's a test` ``

### 8.10 Always Use Semicolons

**Impact: LOW (prevents ASI-related bugs and makes statements explicit)**

Always terminate statements with semicolons. Relying on Automatic Semicolon Insertion (ASI) is error-prone and can introduce subtle bugs, especially with statements that begin with `(`, `[`, or `/`.

**Incorrect (relying on ASI):**

```typescript
const name = `Alice`
const age = 30
const items = [1, 2, 3]

// ASI bug: (function...) is treated as a function call
const result = compute()
(function() { ... })()
```

**Correct (explicit semicolons):**

```typescript
const name = `Alice`;
const age = 30;
const items = [1, 2, 3];

const result = compute();
(function() { ... })();
```

Semicolons make statement boundaries explicit and prevent a class of bugs that are difficult to diagnose.

### 8.11 Always Use Trailing Commas

**Impact: LOW (cleaner diffs and easier reordering)**

Always include trailing commas in multiline structures: arrays, objects, function parameters, and type definitions. Trailing commas make git diffs cleaner (single-line changes don't affect surrounding lines) and make reordering items easier.

**Incorrect (no trailing commas):**

```typescript
const user = {
  name: `Alice`,
  email: `alice@example.com`,
};

const items = [`first`, `second`];

const add = (a: number, b: number) => a + b;
```

**Correct (trailing commas everywhere):**

```typescript
const user = {
  name: `Alice`,
  email: `alice@example.com`,
};

const items = [`first`, `second`];

const add = (a: number, b: number) => a + b;
```

This applies to:

- Array literals
- Object literals
- Function parameter lists
- Type definitions
- Import/export lists
- Destructuring patterns

### 8.12 JSDoc Only When Non-Obvious

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

### 8.13 Document Thrown Errors with @throws JSDoc

**Impact: LOW (makes error contracts visible in the type system)**

When a function throws an error, document it with `@throws` in JSDoc. TypeScript doesn't have built-in checked exceptions, so `@throws` is the only way to make a function's error contract visible to callers.

**Incorrect (undocumented thrown errors):**

```typescript
async function deleteUser(id: string) {
  const session = await verifySession();
  if (!session) {
    throw new UnauthorizedError(`Must be logged in`);
  }
  await db.user.delete({ where: { id } });
}
```

**Correct (documented with @throws):**

```typescript
/**
 * Deletes a user by ID.
 *
 * @throws {UnauthorizedError} When the user is not authenticated
 * @throws {NotFoundError} When the user ID does not exist
 */
async function deleteUser(id: string) {
  const session = await verifySession();
  if (!session) {
    throw new UnauthorizedError(`Must be logged in`);
  }
  await db.user.delete({ where: { id } });
}
```

`@throws` makes errors discoverable:

- IDE hover shows what errors a function can throw
- Callers know what to handle without reading the implementation
- Error handling can be systematic rather than reactive

### 8.14 No Braces for Simple Arrow Function Bodies

**Impact: LOW (concise and readable for single-expression functions)**

For arrow functions that contain a single expression, use implicit return (no braces, no `return` keyword). When the function needs multiple statements, use braces with explicit `return`.

**Incorrect (unnecessary braces for single expression):**

```typescript
const add = (a: number, b: number) => {
  return a + b;
};

const getName = (user: User) => {
  return user.name;
};
```

**Correct (implicit return for single expressions):**

```typescript
const add = (a: number, b: number) => a + b;
const getName = (user: User) => user.name;
```

**Correct (braces for multi-statement bodies):**

```typescript
const processOrder = (order: Order) => {
  const total = calculateTotal(order);
  const validated = validateOrder(order);
  return submitOrder(validated, total);
};
```

For multi-line expressions, start the expression on the same line as `=>`:

```typescript
const result = (items: Item[]) =>
  items
    .filter((item: Item) => item.active)
    .map((item: Item) => item.name)
    .toSorted();
```

### 8.15 Multiline Objects When 2 or More Properties

**Impact: LOW (consistent formatting for readability)**

Objects with 2 or more properties should be formatted across multiple lines, with each property on its own line. Single-property objects can stay on one line.

**Incorrect (2+ properties on one line):**

```typescript
const user = { name: `Alice`, email: `alice@example.com` };
```

**Correct (2+ properties multiline):**

```typescript
const user = {
  name: `Alice`,
  email: `alice@example.com`,
};
```

**Correct (single property inline):**

```typescript
const result = { value: 42 };
```

This keeps objects scannable — each property gets its own line, adding/removing a property doesn't affect other lines, and trailing commas work naturally.

### 8.16 Use Object Shorthand When Key Matches Variable Name

**Impact: LOW (reduces duplication and makes code more concise)**

Use object shorthand `{ name }` instead of `{ name: name }` when the property key matches the variable name. This reduces duplication and makes the intent clear.

**Incorrect (redundant key-value):**

```typescript
const user = { name: name, email: email };
const params = { record: record, options: options };
```

**Correct (object shorthand):**

```typescript
const user = { name, email };
const params = { record, options };
```

Use shorthand when the key and value share the same name. Keep the full form when they differ:

```typescript
const user = { name, email, isActive: active };
```

### 8.17 Use Dot Notation for Property Access

**Impact: LOW (dot notation is more readable and type-safe)**

Always use dot notation (`obj.property`) to access object properties when the property name is a valid identifier. Only use bracket notation (`obj['property']`) for dynamic property access.

**Incorrect (bracket notation for known properties):**

```typescript
const name = user[`name`];
const email = user[`email`];
```

**Correct (dot notation):**

```typescript
const name = user.name;
const email = user.email;
```

Use bracket notation only for dynamic access:

```typescript
const field = `name`;
const value = user[field];
```

Dot notation is:

- More readable and concise
- Type-checked by TypeScript (bracket access with string literals can fall through)
- Easier for IDEs to provide autocomplete and refactoring support

### 8.18 Destructure When Using Multiple Properties

**Impact: LOW (reduces repetition and makes used properties explicit)**

When you access 2 or more properties from the same object, destructure them into separate variables. This reduces repetition and makes it clear which properties are used.

**Incorrect (repeated dot notation):**

```typescript
const greeting = `Hello, ${user.name}! Your email is ${user.email}.`;
const updated = { ...user, name: user.name.toUpperCase(), email: user.email.toLowerCase() };
```

**Correct (destructuring):**

```typescript
const { name, email } = user;
const greeting = `Hello, ${name}! Your email is ${email}.`;

const { name, email } = user;
const updated = { ...user, name: name.toUpperCase(), email: email.toLowerCase() };
```

For single property access, dot notation is fine:

```typescript
const name = user.name; // only one property — no need to destructure
```

### 8.19 Destructure in Function Parameters

**Impact: LOW (concise and clear parameter access)**

When a function receives an object, destructure its properties directly in the parameter list. This makes the function's contract explicit — you can see exactly which properties it uses without reading the function body.

**Incorrect (accessing properties via dot notation):**

```typescript
const formatName = (user: User) => `${user.first} ${user.last}`;

function saveToDatabase(params: SaveParams) {
  await db.insert({ name: params.name, email: params.email });
}
```

**Correct (destructuring in parameters):**

```typescript
const formatName = ({ first, last }: User) => `${first} ${last}`;

function saveToDatabase({ name, email }: SaveParams) {
  await db.insert({ name, email });
}
```

Destructuring in parameters:

- Makes required properties visible in the signature
- Eliminates the `user.` prefix throughout the function body
- Works naturally with the option object pattern (see `function-option-object-pattern`)

### 8.20 Computed Property Keys Are Acceptable

**Impact: LOW (computed properties enable dynamic, type-safe object creation)**

Computed property keys (`{ [key]: value }`) are acceptable and useful for creating objects with dynamic property names. They are type-safe and more concise than building objects imperatively.

**Incorrect (imperative object building):**

```typescript
const config: Record<string, string> = {};
for (const key of Object.keys(source)) {
  config[key.toUpperCase()] = source[key];
}
```

**Correct (computed property keys):**

```typescript
const config = Object.fromEntries(
  Object.entries(source).map(([key, value]: [string, string]) => [key.toUpperCase(), value]),
);
```

**Correct (computed property in object literal):**

```typescript
const eventType = `click`;
const handler = { [eventType]: (e: Event) => logEvent(e) };
```

Computed properties are a TypeScript feature, not a code smell. Use them when property names are determined at runtime.

### 8.21 No Underscore Prefix for Internal Variables

**Impact: LOW (module scope and non-export are sufficient for privacy)**

Don't use underscore prefixes (`_`) for module-scoped variables that are internal or private. TypeScript and JavaScript have proper privacy mechanisms: `private` class fields (which we don't use — see `function-no-classes`), module scope, and simply not exporting. The underscore prefix is a convention from languages without proper privacy; in TypeScript, it's unnecessary.

**Incorrect (underscore prefix):**

```typescript
const _internalCache = new Map();
const _isValid = (value: string) => value.length > 0;
```

**Correct (no prefix, just don't export):**

```typescript
const internalCache = new Map();
const isValid = (value: string) => value.length > 0;
```

If a variable is internal to a module, it doesn't need a prefix — it's internal by default (not exported). If you need to signal "don't use this outside," don't export it.

### 8.22 No Swap Destructuring

**Impact: LOW (destructuring swaps sacrifice readability for cleverness)**

Don't use array destructuring to swap variables. It's a clever trick that obscures intent. Use a temporary variable instead — it's explicit and obvious.

**Incorrect (swap destructuring):**

```typescript
let a = 1;
let b = 2;
[a, b] = [b, a];
```

**Correct (temporary variable):**

```typescript
let a = 1;
let b = 2;
const temp = a;
a = b;
b = temp;
```

The temporary variable approach:

- Is immediately obvious to any reader
- Doesn't require understanding destructuring assignment
- Works in all languages (not a JS-specific trick)
- Is explicit about what's happening
