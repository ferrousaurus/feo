---
title: Destructure When Using Multiple Properties
impact: LOW
impactDescription: Reduces repetition and makes used properties explicit
tags: style, destructuring, variables, properties
---

## Destructure When Using Multiple Properties

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