---
title: Never Use Non-Null Assertion (!)
impact: CRITICAL
impactDescription: Non-null assertion is a type assertion that bypasses safety
tags: type, assertion, non-null, safety
---

## Never Use Non-Null Assertion (!)

**Impact: CRITICAL (non-null assertion is a type assertion that bypasses safety)**

The non-null assertion operator (`!`) is a type assertion. It tells TypeScript to treat a value as non-null without any runtime verification. This is just as dangerous as `as Type` and is equally banned.

**Incorrect (non-null assertion):**

```typescript
const name = user!.name;
const element = document.querySelector('.box')! as HTMLElement;
const items = data!.items;
```

**Correct (optional chaining + nullish coalescing):**

```typescript
const name = user?.name ?? 'Unknown';
```

**Correct (type guard):**

```typescript
const isHTMLElement = (el: Element | null): el is HTMLElement =>
  el !== null && el instanceof HTMLElement;

const element = document.querySelector('.box');
if (isHTMLElement(element)) {
  // element is now HTMLElement
}
```

**Correct (explicit null check):**

```typescript
if (data === null || data === undefined) {
  throw new NotFoundError('Data not found');
}
// data is now non-null, TypeScript narrows automatically
const items = data.items;
```

If TypeScript says a value might be null, the correct response is to handle that case — not to assert it away.