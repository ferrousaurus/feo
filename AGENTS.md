# feo

Configuration file manager with a terminal UI.

## Commands

- `pnpm dev` — Run dev server (`tsx --experimental-ffi --watch src/index.ts`)
- `pnpm check` — Type-check (`tsgo -b`, NOT `tsc`)
- `pnpm test` — Run tests (`vitest run`)

## Architecture

- CLI entrypoint: `src/index.ts` (Cliffy commands)
- Default action launches TUI: `src/tui.tsx` (OpenTUI renderer + React)
- `exec` subcommand spawns processes with symlinked config
- Config files: `.jsonc`, `.json`, `.yaml`, `.yml`, `.toml` (defined in `src/lib/config/filetypes.ts`)

## Conventions

- **JSX runtime**: `@opentui/react` (set in tsconfig `jsxImportSource`). This is NOT a web React app — it is a terminal UI.
- **Path alias**: `#/*` maps to `./src/*` (not `@/*`). Mirrored in both `tsconfig.json` and `vitest.config.ts`.
- **Zod**: Import from `zod/mini`, not `zod`.
- **JSR packages**: `@jsr/*` imports require the `.npmrc` registry.
- **Type checker**: `tsgo` (TypeScript native/Go implementation), invoked via `pnpm check`. Do NOT use `tsc`.
- **Module system**: ESM with `verbatimModuleSyntax` — use `import type` for type-only imports.

## tsconfig strictness

Enabled: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`
Disabled: `noUnusedLocals`, `noUnusedParameters`, `noPropertyAccessFromIndexSignature`

## Required versions

- Node ^26.3.0, pnpm ^11.5.2