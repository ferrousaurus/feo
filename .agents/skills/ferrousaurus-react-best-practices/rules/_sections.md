# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Component Definition (component)

**Impact:** CRITICAL  
**Description:** The foundational conventions for how React components are defined and exported. Function components over class components, arrow vs. declaration based on hooks, never using React.FC, and metaframework-aware server/client boundaries. These rules establish the visual and structural patterns that make React code immediately scannable.

## 2. State Management (state)

**Impact:** HIGH  
**Description:** Choosing the right state management primitive for each scenario. useReducer for non-trivial state, no Context for runtime-updating data, early escape from prop drilling, key-based state resets, and strict limits on useRef. These rules prevent the most common React state anti-patterns.

## 3. Effects & Lifecycle (effect)

**Impact:** HIGH  
**Description:** Restricting useEffect to its intended purpose: synchronizing with external systems. Derived state is computed during render, data fetching uses TanStack Query, and external store subscriptions use useSyncExternalStore. Following React's "You Might Not Need an Effect" guidance eliminates cascading renders, race conditions, and stale data bugs.

## 4. Data Fetching (data)

**Impact:** HIGH  
**Description:** All server state flows through TanStack Query. No useEffect+useState fetching patterns, ever. Components call data-fetching hooks directly where the data is needed, relying on TanStack Query's deduplication by queryKey.

## 5. Composition & Props (composition)

**Impact:** MEDIUM  
**Description:** Component composition patterns: slot props over compound components, React.ReactNode for children, controlled inputs by default (aligned with Mantine and TanStack Form), error boundaries at route and feature boundaries, and Fragment conventions. These rules create consistent, predictable component APIs.

## 6. Hooks (hook)

**Impact:** MEDIUM  
**Description:** Custom hook conventions (use prefix, return shape, single-purpose, no JSX) and strict memoization policy (useMemo, useCallback, React.memo only with measured evidence). Hooks are the primary extension point for React logic, so consistent conventions are essential.

## 7. Conditional Rendering (render)

**Impact:** MEDIUM  
**Description:** Early returns for null/error states, banned nested ternaries in JSX, and clear patterns for && vs. ternary. Aligned with the TypeScript skill's control flow rules, adapted for JSX rendering.

## 8. File Organization (file)

**Impact:** LOW  
**Description:** Type-based directories (components/, hooks/, utils/) and PascalCase component filenames matching their exports. A deliberate departure from the TypeScript skill's flat-by-feature convention, optimized for React project structure.