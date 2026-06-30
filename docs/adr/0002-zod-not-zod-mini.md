# 0002. Use full `zod`, not `zod/mini`

## Status

Accepted. Reverses an earlier informal convention recorded only in
`AGENTS.md`.

## Context

`AGENTS.md` previously required importing the schema builder from
`zod/mini` rather than `zod`. The rationale was tree-shaking: `zod/mini`
ships the same v4 core engine with a smaller public surface, and the
thinking was that a smaller import would matter for a CLI binary.

`feo` is a terminal application distributed as a `bun build --compile`
binary. It is not served over the web, so the browser-style bundle-size
argument for `zod/mini` does not apply. Meanwhile `zod/mini` carries
real DX costs in this codebase:

- The user-facing `ZodError` class (with `.issues`, `.format()`, `.flatten()`)
  is not exported. Tests therefore reach into `zod/v4/core` for the
  raw `$ZodError`, which is an internal core type.
- Polished error messages and the public error API are only available
  on the full `zod` entry point.
- Authoring schemas in `zod/mini` is a near-identical API to full
  `zod`, so the saving is mostly about the import path and bundle
  output, neither of which is a constraint here.

## Decision

Import the schema builder from `zod` across the codebase. Concretely:

- Replace `import { z } from "zod/mini";` with `import { z } from "zod";`
  in all source files.
- Continue to import `$ZodError` from `zod/v4/core` in tests where the
  raw core error class is asserted; switching to the public `ZodError`
  wrapper would change `toThrow` semantics, so we keep the core
  import deliberately.

No `package.json` change is required: the umbrella `zod` package
already provides both entry points.

## Consequences

- Errors thrown by `parse` remain `$ZodError` (the core type) at
  runtime — both `zod` and `zod/mini` wrap the same core, so the
  existing tests' `toThrow($ZodError)` assertions continue to pass.
- Application code can now use the full `zod` surface (e.g. the
  user-facing `ZodError`, refined error formatting) if it ever wants
  to, without changing the import path.
- The `package.json` `zod` dependency is unchanged; the lockfile does
  not need to be regenerated.
