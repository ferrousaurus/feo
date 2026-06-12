---
title: Always Use Backtick Strings
impact: LOW
impactDescription: Eliminates quote-style decisions and enables interpolation without syntax changes
tags: style, string, quotes, backtick, template
---

## Always Use Backtick Strings

**Impact: LOW (eliminates quote-style decisions and enables interpolation without syntax changes)**

Use backtick strings (template literals) for all strings, including plain strings with no interpolation. This eliminates the need to choose between single and double quotes, makes it easy to add interpolation later without changing delimiters, and provides a consistent style across the codebase.

**Incorrect (single or double quotes):**

```typescript
const name = 'Alice';
const greeting = 'Hello, ' + name + '!';
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