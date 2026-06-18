---
title: Prefer Short Fragment Syntax
impact: MEDIUM
impactDescription: Consistent fragment style reduces noise; keyed fragments are the explicit exception
tags: react, composition, fragment, jsx
---

## Prefer Short Fragment Syntax

**Impact: MEDIUM (consistent fragment style reduces noise)**

Use the short fragment syntax `<></>` for wrapping multiple elements without adding a DOM node. Only use `<Fragment key={...}>` when you need keyed fragments (e.g., in a list where Fragments are the root elements).

**Incorrect (Fragment when key is not needed):**

```tsx
function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl>
      {items.map((item) => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Wait, that's actually correct — that's keyed Fragments which are needed.

**Incorrect (Fragment when short syntax works):**

```tsx
function Card({ title, description }: CardProps) {
  return (
    <Fragment>
      <h2>{title}</h2>
      <p>{description}</p>
    </Fragment>
  );
}
```

**Correct (short syntax for unkeyed fragments):**

```tsx
function Card({ title, description }: CardProps) {
  return (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
    </>
  );
}
```

**Correct (Fragment with key when needed):**

```tsx
function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl>
      {items.map((item) => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Never use `<React.Fragment>` — import `Fragment` if you need the keyed form, or use `<></>` for unkeyed fragments.

### Cross-References

- Related: [render-conditional-patterns.md](./render-conditional-patterns.md)
