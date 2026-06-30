# 0001. Source identity is derived, not stored

## Status

Accepted.

## Context

Each `FeoSource` variant (path / url / data) needs a stable identifier so
that the TUI can key React lists, diff Sources panels, and show a human
label. Storing an `id` field on the source would require every author to
hand-pick a unique value and keep it in sync across edits to the config
and to upstream content.

## Decision

`sourceId` and `sourceLabel` are derived from the source's own fields
(`src/lib/source/identity.ts`):

- `path:*` from `source.path`
- `url:*` from `source.url`
- `data:<sha256>` from a sorted-key JSON digest of `source.data`

No `id` field is added to the schema. Identity follows the source's
intrinsic data; renaming a path or hashing a data payload is enough to
produce a new identity.

## Consequences

- Authors never think about IDs.
- A renamed file is treated as a new source — this is the desired
  behaviour for "where does this config come from?" but may surprise
  callers that want rename-as-edit semantics.
- `data:*` IDs depend on key order, so the digest is computed over a
  key-sorted JSON serialisation to make it stable.
