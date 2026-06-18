---
title: Slot Props Over Compound Components
impact: MEDIUM
impactDescription: Explicit slot props make data flow visible and components easy to compose
tags: react, composition, slots, compound components, render props
---

## Slot Props Over Compound Components

**Impact: MEDIUM (explicit slot props make data flow visible and components easy to compose)**

Prefer explicit slot props for component composition. Compound component patterns (where sub-components implicitly share state via context) make data flow invisible and harder to trace. Render props are acceptable when they're clearly the right tool (giving the consumer full control over rendering while the parent manages data).

### Slot props (preferred)

Pass components or JSX as named props. Data flow is explicit and traceable.

```tsx
<Tabs
  list={
    <Tabs.List>
      <Tab>Profile</Tab>
      <Tab>Settings</Tab>
    </Tabs.List>
  }
  panels={
    <Tabs.Panels>
      <TabPanel>
        <Profile />
      </TabPanel>
      <TabPanel>
        <Settings />
      </TabPanel>
    </Tabs.Panels>
  }
/>
```

The parent `Tabs` component is responsible for managing active tab state, but the consumer controls what's rendered in each slot. Data flow is explicit: props go in, slots come out.

### Compound components (avoid by default)

```tsx
// ❌ Avoid: Implicit state sharing via context — hard to trace
<Tabs>
  <TabList>
    <Tab>Profile</Tab>
    <Tab>Settings</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Profile />
    </TabPanel>
    <TabPanel>
      <Settings />
    </TabPanel>
  </TabPanels>
</Tabs>
```

Compound components share state implicitly through context. This makes it hard to know where state comes from, hard to compose differently, and creates invisible coupling between parent and children.

### Render props (acceptable when clearly needed)

Render props are acceptable when the consumer needs full control over rendering while the parent manages the data or logic. Use them sparingly — only for genuinely dynamic rendering patterns.

```tsx
<DataList query={usersQuery} renderItem={(user) => <UserRow user={user} />} />
```

This is acceptable because `DataList` manages fetching logic while the consumer controls rendering. This isn't the default pattern — prefer slot props when the structure is known at composition time.

### When compound components may be acceptable

- Third-party libraries that mandate the pattern (e.g., Mantine's `Tabs` uses compound components)
- Deeply nested structures where slot props become unwieldy
- When the component API is defined by a design system you don't control

If you must use compound components, document the implicit state sharing clearly.

### Cross-References

- Related: [composition-children-type.md](./composition-children-type.md)
- Related: [state-no-prop-drilling.md](./state-no-prop-drilling.md)
