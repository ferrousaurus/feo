---
title: Function Components Only, Never Class Components
impact: CRITICAL
impactDescription: Eliminates this binding issues, favors functional composition
tags: react, component, class, function
---

## Function Components Only, Never Class Components

**Impact: CRITICAL (eliminates `this` binding issues and favors functional composition)**

Never use class components. Function components are the standard React pattern. Class components introduce `this` binding confusion, lifecycle method complexity, and ceremony that function components with hooks avoid entirely. This aligns with the TypeScript skill's `function-no-classes` rule — prefer functions and closures over classes.

**Incorrect (class component):**

```tsx
class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.state = { isLoading: true };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ isLoading: false });
  }

  render() {
    return <button onClick={this.handleClick}>{this.state.isLoading ? "Loading" : "Done"}</button>;
  }
}
```

**Correct (function component):**

```tsx
type UserProfileProps = {
  userId: string;
};

function UserProfile({ userId }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => setIsLoading(false);

  return <button onClick={handleClick}>{isLoading ? "Loading" : "Done"}</button>;
}
```

Function components have no `this` binding issues, no constructor boilerplate, and can use all React hooks. Class components cannot use hooks, making them incompatible with the state management and data fetching patterns in this guide.

### Cross-References

- Related: [component-arrow-vs-declaration.md](./component-arrow-vs-declaration.md)
- Related: [component-no-react-fc.md](./component-no-react-fc.md)
- TS Skill: `function-no-classes` — Never use classes, prefer functions and closures
