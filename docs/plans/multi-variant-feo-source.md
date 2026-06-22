# Plan: Multi-variant `FeoSource` support

## Context

`FeoSource` in `src/data/feoConfig.ts` was changed to a discriminated union of three variants:

- `{ path: string }` — local file
- `{ url: string }` — remote URL
- `{ data: object }` — inline data

Everything in the codebase still assumes `{ path: string }`. This plan makes the codebase work with all three variants without changing the schema for existing `{ path }` configs (they keep the same behavior, just with a `path:`-prefixed internal identity string).

## Decisions (resolved by interview)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Identity model | **Derived** (no `id` field added to schema) |
| 2 | ID format | **Discriminated prefix**: `path:…`, `url:…`, `data:<sha>` |
| 3 | Inline-data hash | **Sort keys** before `JSON.stringify` for order-independence |
| 4 | Display label | `sourceLabel`: unprefixed for path/url, prefixed for data |
| 5 | Source creation | `new URL()` + protocol check inside `addSource` mutation; no inline from TUI |
| 6 | Loading | Extract shared `loadSourceContent`; all three call sites delegate |
| 7 | Type safety | **Tighten** `data: z.json()` → `z.record(z.string(), z.json())` in schema |
| 8 | Dead code | **Delete** `src/commands/write.ts` |
| 9 | Tests | Unit-test `sourceId`/`sourceLabel`/`loadSourceContent` |
| 10 | Docs | Create `CONTEXT.md` + `docs/adr/0001-source-identity.md` |

### Rationale for non-obvious decisions

- **Derived vs assigned identity**: Adding an explicit `id` field to `FeoSource` would require a schema migration for existing configs and force users to hand-write IDs. Derived identity (computed from whichever field the variant has) needs no migration and no user-facing IDs. Collisions only happen on exact-duplicate sources, which are no-ops under deep-merge anyway.
- **Discriminated prefix vs pure hash**: Behavior is identical (collisions and stability are the same since each variant has exactly one identifying field). The prefixed form is human-readable in React DevTools, logs, and mutation payloads (`path:~/dotfiles/starship/base.toml` vs opaque `a1b2c3d4e5f67890`).
- **Sort keys before hashing `data`**: `data` is an object that flows through `deepMerge` (`@std/collections`) on every config mutation. If key order ever changes across a merge, the hash changes → React key changes → component remounts (loses scroll/local state) and Shell's selected-source state loses its match. Sorting makes the hash key-order-independent at the cost of one `.sort()` call.
- **Tighten schema from `z.json()` to `z.record(z.string(), z.json())`**: All consumers (`getMergedConfig`, the write command, etc.) do `deepMerge(c, p)` with `{} as Serializable` where `Serializable = Record<string, unknown>`. A non-object `data` (bare string, array, number) is meaningless for deep-merge and would compile fine then crash at runtime with an opaque error. Rejecting at parse time gives the earliest, clearest failure and makes types honest with zero casts.
- **Delete `src/commands/write.ts`**: Dead code — not imported anywhere. WIP (write logic commented out, just `console.log`s), AND has a separate bug (merges raw `FeoSource` objects instead of loading content). The live write command is inline in `src/index.ts:27-86`.

## Blast radius (every site that currently assumes `.path`)

These are the only sites that need changes beyond the new modules. All other files either don't touch source identity or already discriminate correctly.

### Will be replaced by `loadSourceContent` (Phase 5)

- `src/data/sourceContentQueryOptions.ts:12-24` — queryFn body, will delegate
- `src/lib/getMergedConfig.ts:12` — `sources.map(async (s) => await readConfigFile(s.path))`
- `src/index.ts:51-58` — `sourcePaths.map(async ({ path }) => …)`

### Will change `s.path === vars.source` to `sourceId(s) === vars.source` (Phase 4)

- `src/data/deleteSourceMutationOptions.ts:31`
- `src/data/moveSourceUpMutationOptions.ts:23, 26`
- `src/data/moveSourceDownMutationOptions.ts:23, 26`

### Will use `sourceId` / `sourceLabel` (Phase 6)

- `src/panels/SourcesPanel.tsx:38, 50, 55, 56, 57, 82`
- `src/components/sources/Source.tsx:39, 66`
- `src/components/Shell.tsx:309, 340`

### Already correct, no change needed

- `src/components/sources/ActiveSource.tsx:36` — already discriminates `"path" in source ? … : "url" in source ? … : ".json"` for syntax-highlighting ext
- `src/data/configQueryOptions.ts` — wraps `sourceContentQueryOptions({ path })`, still a valid `FeoSource`
- `src/tui.tsx:65-72` — maps over `t.sources` calling `sourceContentQueryOptions(s)`, discrimination handled internally
- `src/components/Shell.tsx:357, 363` — `path` here refers to write-state file paths, not source identity

## Implementation phases

### Phase 1 — Schema tightening

**File**: `src/data/feoConfig.ts`

Change line 4 from `data: z.json(),` to `data: z.record(z.string(), z.json()),`.

This makes `FeoSource`'s `data` variant typed `{ data: Record<string, unknown> }` = `Serializable`. No other change to the file.

### Phase 2 — New modules in `src/lib/source/`

**`src/lib/source/identity.ts`** (new file):

```ts
import sha from "#/lib/crypto/hash";
import type { FeoSource } from "#/data/feoConfig";

function dataHash(data: Record<string, unknown>): string {
  return sha(JSON.stringify(data, Object.keys(data).sort()));
}

export function sourceId(source: FeoSource): string {
  if ("path" in source) return `path:${source.path}`;
  if ("url" in source) return `url:${source.url}`;
  return `data:${dataHash(source.data)}`;
}

export function sourceLabel(source: FeoSource): string {
  if ("path" in source) return source.path;
  if ("url" in source) return source.url;
  return `data:${dataHash(source.data)}`;
}
```

**`src/lib/source/loadSourceContent.ts`** (new file):

```ts
import npath from "node:path";
import readFile from "#/lib/io/readFile";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import type { Serializable } from "#/lib/serialization/util";
import type { FeoSource } from "#/data/feoConfig";

export default async function loadSourceContent(source: FeoSource): Promise<Serializable> {
  if ("path" in source) {
    const text = await readFile(source.path).then((f) => f.text());
    const ext = supportedExtensionSchema.parse(npath.parse(source.path).ext);
    return filetypes[ext].parse(text);
  }
  if ("url" in source) {
    const text = await readFile(source.url).then((f) => f.text());
    const ext = supportedExtensionSchema.parse(npath.parse(source.url).ext);
    return filetypes[ext].parse(text);
  }
  return source.data;
}
```

No cast needed — `source.data` is `Record<string, unknown>` = `Serializable` after Phase 1.

**`src/lib/source/identity.test.ts`** (new file) — test cases:

- `sourceId` for `{ path: "foo" }` returns `"path:foo"`
- `sourceId` for `{ url: "https://x/y" }` returns `"url:https://x/y"`
- `sourceId` for `{ data: { a: 1, b: 2 } }` returns `"data:<16-hex-char-sha>"`
- `sourceId` for `{ data: { b: 2, a: 1 } }` returns the same hash as `{ data: { a: 1, b: 2 } }` (key-order independence)
- `sourceLabel` for path/url returns the raw field; for data returns the `"data:<sha>"` form

**`src/lib/source/loadSourceContent.test.ts`** (new file) — test cases:

- Path branch reads file and parses by extension (mock `readFile`)
- URL branch reads URL and parses by extension (mock `readFile`)
- Data branch returns `source.data` directly (no I/O)

Follow the existing colocated `*.test.ts` convention (see `src/lib/fs/resolveAbsolutePath.test.ts` for the pattern). Use `vitest` with `vi.mock` for `readFile`.

### Phase 3 — Fix `addSourceMutationOptions.ts`

**File**: `src/data/addSourceMutationOptions.ts`

Replace lines 24-26 (the deadlocking `new Promise(...)` block) with inline `try/catch` + protocol check:

```ts
let source: FeoSource;
try {
  const { protocol } = new URL(vars.source);
  source = protocol === "http:" || protocol === "https:" ? { url: vars.source } : { path: vars.source };
} catch {
  source = { path: vars.source };
}
```

Add at top:

```ts
import type { FeoSource } from "#/data/feoConfig";
```

**Why this matters**: the current line 24 `await new Promise(() => new URL(vars.source))` never resolves (executor doesn't call resolve/reject), so `addSource` would deadlock. Even fixed, `new URL("file:///x")` and `new URL("mailto:…")` succeed and would be misclassified as remote. Only `http:`/`https:` should become `{url}`.

**Test note**: the inline try/catch is harder to unit-test in isolation. The mutation as a whole can be tested, but a focused unit test for the detection rule is not in scope. The rule matches the pattern in `src/lib/fs/getProtocol.ts:1-11`.

### Phase 4 — Update mutations to compare by `sourceId`

In each of these three files, replace `s.path === vars.source` (or `!==` for delete) with `sourceId(s) === vars.source`. Add `import { sourceId } from "#/lib/source/identity"` to each.

| File | Lines | Current | Replacement |
|------|-------|---------|-------------|
| `src/data/deleteSourceMutationOptions.ts` | 31 | `(s) => s.path !== vars.source` | `(s) => sourceId(s) !== vars.source` |
| `src/data/moveSourceUpMutationOptions.ts` | 23 | `sources.some((s) => s.path === vars.source)` | `sources.some((s) => sourceId(s) === vars.source)` |
| `src/data/moveSourceUpMutationOptions.ts` | 26 | `sources.findIndex((s) => s.path === vars.source)` | `sources.findIndex((s) => sourceId(s) === vars.source)` |
| `src/data/moveSourceDownMutationOptions.ts` | 23 | same as moveSourceUp:23 | same |
| `src/data/moveSourceDownMutationOptions.ts` | 26 | same as moveSourceUp:26 | same |

The mutation var type stays `source: string` — the string is now a `sourceId` instead of a `.path`. Callers in Phase 6 will pass `sourceId(source)` rather than `source.path`.

### Phase 5 — Delegate loading to `loadSourceContent`

**`src/data/sourceContentQueryOptions.ts`** — replace the entire `queryFn` body (lines 12-24) with `() => loadSourceContent(source)`. Remove now-unused imports: `npath`, `readFile`, `filetypes`, `supportedExtensionSchema`. Add `import loadSourceContent from "#/lib/source/loadSourceContent"`. Keep the `queryKey: [source]` as-is — react-query serializes the whole `FeoSource` for the key.

**`src/lib/getMergedConfig.ts`** — replace line 12:

```ts
// before
const objs = await Promise.allSettled(sources.map(async (s) => await readConfigFile(s.path)));
// after
const objs = await Promise.allSettled(sources.map(async (s) => loadSourceContent(s)));
```

Remove `import readConfigFile from "./config/readConfigFile"`. Add `import loadSourceContent from "#/lib/source/loadSourceContent"`.

**`src/index.ts`** — replace lines 51-58:

```ts
// before
const sources = (
  await Promise.allSettled(
    sourcePaths.map(async ({ path }) => {
      const { ext: sourceExt } = npath.parse(path);
      const validatedSourceExt = supportedExtensionSchema.parse(sourceExt);
      const text = await readFile(path).then((r) => r.text());
      return filetypes[validatedSourceExt].parse(text);
    }),
  )
)
// after
const sources = (
  await Promise.allSettled(
    sourcePaths.map(async (s) => loadSourceContent(s)),
  )
)
```

Add `import loadSourceContent from "#/lib/source/loadSourceContent"` at the top. The `npath`, `readFile`, `filetypes`, `supportedExtensionSchema` imports may now be unused — check and remove if so. (The `index.ts` file still uses `npath.parse` and `filetypes`/`supportedExtensionSchema` for the config file itself on line 37 and 77, so keep those imports as needed for the remaining usage.)

### Phase 6 — Update components (identity + display)

**`src/panels/SourcesPanel.tsx`** — add `import { sourceId } from "#/lib/source/identity"` at top. Changes:

| Line | Current | Replacement |
|------|---------|-------------|
| 50 | `key={s.path}` | `key={sourceId(s)}` |
| 55 | `active={source?.path === s.path}` | `active={source !== undefined && sourceId(source) === sourceId(s)}` |
| 56 | `enableKeybinds={active && source?.path === s.path && !creating}` | `enableKeybinds={active && source !== undefined && sourceId(source) === sourceId(s) && !creating}` |
| 57 | `moving={moving === s.path}` | `moving={moving === sourceId(s)}` |
| 82 | `setMoving((m) => (m === undefined ? source?.path : undefined));` | `setMoving((m) => (m === undefined ? (source !== undefined ? sourceId(source) : undefined) : undefined));` |

Line 38 `useState<string \| undefined>(undefined)` stays — the string is now a `sourceId`. Type is unchanged.

**`src/components/sources/Source.tsx`** — add imports:

```ts
import { sourceId, sourceLabel } from "#/lib/source/identity";
```

Changes:

| Line | Current | Replacement |
|------|---------|-------------|
| 39 | `const title = useTitle(source.path, 0.35, {` | `const title = useTitle(sourceLabel(source), 0.35, {` |
| 66 | `void mutateAsync({ app: application, target, source: source.path });` | `void mutateAsync({ app: application, target, source: sourceId(source) });` |

**`src/components/Shell.tsx`** — add `import { sourceId } from "#/lib/source/identity"`. Changes:

| Line | Current | Replacement |
|------|---------|-------------|
| 309 | `const i = sources.findIndex((src) => src.path === s.source?.path);` | `const i = sources.findIndex((src) => s.source !== undefined && sourceId(src) === sourceId(s.source));` |
| 340 | `const i = sources.findIndex((src) => src.path === s.source?.path);` | same |

**No change**: `src/components/sources/ActiveSource.tsx:36` — already discriminates correctly with `"path" in source ? source.path : "url" in source ? source.url : ".json"`. This is for syntax-highlighting ext, not identity/display.

### Phase 7 — Delete dead code

Delete `src/commands/write.ts`. It is not imported anywhere (verified by grep — `writeCommand` is only referenced within its own file). The live write command is inline in `src/index.ts:27-86`.

If the `src/commands/` directory is empty after deletion, leave the empty directory or remove it — not material.

### Phase 8 — Docs

**`CONTEXT.md`** (new file at repo root):

```md
# feo

A configuration file manager that deep-merges layered config sources into a single output per target.

## Language

**Source**:
A config fragment that contributes to a target's merged output. One of three variants: local (file path), remote (URL), or inline (embedded object).
_Avoid_: file, layer

**Source Identity**:
A derived string that uniquely identifies a source within a target, formatted as `path:<path>`, `url:<url>`, or `data:<sha>`. Used for React keys, mutation targeting, and navigation. Not stored in the config.
_Avoid_: id, key, hash

**Target**:
An output config file path. Sources under a target are deep-merged in order.
_Avoid_: destination, output

**Application**:
A logical grouping of targets (e.g. `starship`, `vscode`).
_Avoid_: app, profile
```

**`docs/adr/0001-source-identity.md`** (new file — create `docs/adr/` lazily):

```md
# Source identity is derived, not assigned

Sources have three variants (local path, remote URL, inline data) with no shared field, so identity is derived as a discriminated-prefix string (`path:…` / `url:…` / `data:<sha>`) rather than an explicit `id` field in the schema. This avoids a migration and user-facing IDs, at the cost of identity changing when the identifying field is edited. For inline data, keys are sorted before hashing so identity is robust against deep-merge reordering.
```

## File summary

**New (6)**:
- `src/lib/source/identity.ts`
- `src/lib/source/loadSourceContent.ts`
- `src/lib/source/identity.test.ts`
- `src/lib/source/loadSourceContent.test.ts`
- `CONTEXT.md`
- `docs/adr/0001-source-identity.md`

**Edited (10)**:
- `src/data/feoConfig.ts` (Phase 1)
- `src/data/addSourceMutationOptions.ts` (Phase 3)
- `src/data/deleteSourceMutationOptions.ts` (Phase 4)
- `src/data/moveSourceUpMutationOptions.ts` (Phase 4)
- `src/data/moveSourceDownMutationOptions.ts` (Phase 4)
- `src/data/sourceContentQueryOptions.ts` (Phase 5)
- `src/lib/getMergedConfig.ts` (Phase 5)
- `src/index.ts` (Phase 5)
- `src/panels/SourcesPanel.tsx` (Phase 6)
- `src/components/sources/Source.tsx` (Phase 6)
- `src/components/Shell.tsx` (Phase 6)

(That's 11 edits, not 10 — table above has 11 rows.)

**Deleted (1)**:
- `src/commands/write.ts`

## Verification

```bash
pnpm check   # tsgo type-check
pnpm test    # vitest run (includes new tests)
```

After `pnpm check` passes, do a quick smoke test:

1. Launch the TUI with a config containing only `{path: "..."}` sources — confirm sources list, navigate, move up/down, delete.
2. Hand-edit a config to add a `{url: "https://..."}` source — confirm it appears, can be navigated, and displays.
3. Hand-edit a config to add a `{data: {"key": "value"}}` source — confirm merge in preview panel works and the inline source is rendered.

## Notes for the implementer

- **`noUncheckedIndexedAccess` is on** (per `AGENTS.md`). Array accesses like `sources[0]` return `T | undefined`. The existing code already handles this; the new code in Phase 6 must too.
- **ESM with `verbatimModuleSyntax`**: use `import type` for type-only imports. `FeoSource` is imported as a type in `identity.ts`, `loadSourceContent.ts`, and `addSourceMutationOptions.ts`.
- **Zod from `zod/mini`**, not `zod`. The existing `feoConfig.ts` uses `zod/mini`; follow the same import.
- **`@opentui/react` JSX runtime**: `Source.tsx` and `SourcesPanel.tsx` use OpenTUI components (`<box>`, `<input>`, etc.), not web React. No HTML elements.
- **Do not use `tsc`** — use `tsgo` via `pnpm check`.
- **The `sourceId` and `sourceLabel` functions share the `dataHash` helper** — keep it private to `identity.ts` unless another file needs it.
- **The `loadSourceContent` function is async** — it's used inside `Promise.allSettled` in `getMergedConfig` and `index.ts`, which is fine.
- **The `data` branch in `loadSourceContent` cannot fail** (no I/O), so the `Promise.allSettled` rejection handling in callers only ever surfaces path/url errors. No special handling needed.
- **React keys use `sourceId`** which is stable as long as the source's identifying field doesn't change. There is no "edit source" mutation, so keys are stable in practice. The hash-sorting for `data` is belt-and-suspenders against merge reordering.
- **The mutation var `source: string` is now a `sourceId`** at the type level — both at the call site (you pass `sourceId(source)`) and at the comparison site (you compare against `sourceId(s)`). The type is still `string`; the semantic changed.
