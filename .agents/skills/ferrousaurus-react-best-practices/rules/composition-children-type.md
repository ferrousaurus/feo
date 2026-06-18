---
title: Type children as React.ReactNode
impact: MEDIUM
impactDescription: React.ReactNode covers all renderable output including null, fragments, strings, and numbers
tags: react, composition, children, types
---

## Type children as React.ReactNode

**Impact: MEDIUM (React.ReactNode covers all renderable output)**

When a component accepts `children`, type it as `React.ReactNode`. This is the broadest correct type for React's `children` prop, covering all renderable output: `null`, `undefined`, `string`, `number`, `ReactElement`, `Fragment`, and arrays of these.

Never use `React.ReactElement`, `JSX.Element`, or `string` for `children` — they are too narrow and reject valid React content.

**Incorrect (too narrow):**

```tsx
type LayoutProps = {
  children: React.ReactElement; // ❌ Rejects strings, numbers, fragments, null
};

type CardProps = {
  children: JSX.Element; // ❌ Same problem
};

type WrapperProps = {
  children: string; // ❌ Only accepts strings
};
```

**Correct (React.ReactNode):**

```tsx
export type LayoutProps = {
  children: React.ReactNode;
};

export type CardProps = {
  children: React.ReactNode;
};
```

`React.ReactNode` is the type that matches what React actually allows as children. Using narrower types creates false type errors when consumers pass valid content like strings, numbers, fragments, or conditionally rendered slots.

### When not to use children

If a component doesn't use `children`, don't include it in the props type at all. Omit it entirely rather than typing it as `undefined` or `null`.

```tsx
export type IconProps = {
  name: string;
  size?: number;
};

const Icon = ({ name, size }: IconProps) => <i className={`icon icon-${name}`} style={{ fontSize: size }} />;
```

### Cross-References

- Related: [composition-slots-over-compound.md](./composition-slots-over-compound.md)
- TS Skill: `type-type-over-interface` — Use `type` alias, never `interface`
