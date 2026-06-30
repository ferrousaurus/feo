# feo

Configuration file manager with a terminal UI. Architectural decisions in [docs/adr/](docs/adr/).

## Toolchain

- **bun** ^1.3.14 is the runtime and package manager (`packageManager` in `package.json`, `bun.lock`, `mise.local.toml`, CI). `pnpm`/`npm` can run scripts but won't manage `bun.lock` — use `bun install`.
- TUI: `@opentui/react` (terminal, not web React).

## Commands (`bun run <name>`)

- `dev` — `bun run --watch src/index.ts` (bun's native watch, not tsx)
- `test` — `vitest run` (colocated `*.test.ts`; single file: `bunx vitest run <path>`, watch: `bunx vitest`)
- `check` — `tsc -b` (the project uses `tsc`, not `tsgo`)
- `lint` / `lint:fix` — `oxlint` / `oxlint --fix`
- `fmt` / `fmt:check` — `oxfmt` / `oxfmt --check`
- `build` — `bun build --compile --outfile=dist/feo src/index.ts`

CI runs in this order (`.github/workflows/ci.yml`): `lint` → `fmt:check` → `check` → `test`.

## Architecture

- CLI: `src/index.ts` (Cliffy). Default action launches the TUI; the only subcommand is `write [--all] [applications...]`.
- TUI: `src/tui.tsx` mounts an OpenTUI renderer + React root inside TanStack Query (`src/data/*`). Four panels (`src/panels/*`) are composed in `src/components/Shell.tsx` — Applications / Targets / Sources / Preview, plus a `LegendPanel` footer.
- Tree-sitter parsers (`.json`/`.yaml`/`.toml`) are downloaded from GitHub at TUI startup in `src/tui.tsx` (`addDefaultParsers`). Offline/airgapped runs of the TUI will fail to syntax-highlight — a network fetch is required.
- Config schema (zod): `src/data/feoConfig.ts`. Source identity is derived, not stored — see `src/lib/source/identity.ts` and `docs/adr/0001-source-identity.md`.
- Per-filetype parse/stringify: `src/lib/config/filetypes.ts` (`.jsonc`, `.json`, `.yaml`, `.yml`, `.toml`, `.md`, `.mdx`). Default config: `~/.config/feo/config.jsonc`; override with `feo -c <path>`.
- `write` deep-merges sources per target and writes the target file; existing files are backed up as `{name}.{sha(content)}.feo-bkup{ext}` before overwrite.

## Conventions

- **Path alias**: `#/*` → `./src/*` (mirrored in `tsconfig.json` and `vitest.config.ts`). NOT `@/*`.
- **JSX runtime**: `@opentui/react` (`tsconfig.json` `jsxImportSource`). Terminal UI.
- **Zod**: import from `zod`, not `zod/mini`.
- **JSR packages**: `@jsr/*` requires the registry in `.npmrc` (`@jsr:registry=https://npm.jsr.io`).
- **Module system**: ESM with `verbatimModuleSyntax: true` — use `import type` for type-only imports.
- **tsconfig**: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` enabled. `noUnused*` and `noPropertyAccessFromIndexSignature` disabled.

## Release quirks (`.github/workflows/release.yml`)

- `@opentui/core` ships native bindings; release reinstalls it per target with `bun install --os="*" --cpu="*" "@opentui/core@$VERSION"` (version read from `bun.lock`).
- `src/lib/version.ts` holds the literal `"0.0.0-dev"`; release `sed`s it to the tag version before building.
- Build targets: `bun-linux-x64`, `bun-linux-arm64`, `bun-darwin-x64`, `bun-darwin-arm64`.

## Skills

`skills-lock.json` pins three skills loaded by opencode in this repo: `ferrousaurus-react-best-practices`, `ferrousaurus-typescript-best-practices`, `opentui`.
