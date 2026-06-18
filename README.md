# feo

A configuration file manager with a terminal UI.

## Overview

feo manages configuration files as layered **sources** that deep-merge into a unified config per **target**. Sources are organized under **applications → targets → sources**, letting you split config into composable fragments and preview the merged result before writing.

## Install

Requires Node ^26.3.0 and pnpm ^11.7.0.

```bash
pnpm install
```

## Usage

```bash
feo                # launch the TUI
feo -c <path>      # launch with a custom config file
```

During development:

```bash
pnpm dev           # run with hot-reload
```

## TUI

The TUI has four panels, switchable by their shortcut key:

| Key | Panel | Description |
|-----|-------|-------------|
| `a` | Applications | List of apps. `n` to create, `d` to delete. |
| `t` | Targets | Targets for the selected app. `n` to create, `d` to delete. |
| `s` | Sources | Source files for the selected target. `m` to reorder, `r` to refresh. |
| `p` | Preview | Merged config for the selected target. `w` to write to the target path. |

Navigate within lists with `j`/`k` or `↑`/`↓`. Scroll content with `[`/`]`. Press `q` to quit.

When writing, feo backs up the existing file as `{name}.{hash}.feo-bkup{ext}` before overwriting.

## Configuration

Default config location: `~/.config/feo/config.jsonc`

```jsonc
{
  "settings": {
    "keymap": {
      // customizable key bindings
    },
    "theme": {
      // customizable colors
    }
  },
  "configs": {
    "starship": {
      "targets": {
        "~/.config/starship.toml": {
          "sources": [
            { "path": "~/dotfiles/starship/base.toml" },
            { "path": "~/dotfiles/starship/work.toml" }
          ]
        }
      }
    },
    "vscode": {
      "targets": {
        "~/.config/Code/User/settings.jsonc": {
          "sources": [
            { "path": "~/dotfiles/vscode/base.jsonc" },
            { "path": "~/dotfiles/vscode/extensions.jsonc" }
          ]
        }
      }
    }
  }
}
```

- **Application** — a logical grouping (e.g. `starship`, `vscode`)
- **Target** — an output config file path
- **Source** — a config fragment; multiple sources under one target are deep-merged (later sources override earlier ones)

Paths support `~`, `${VAR}`, and `${VAR:-fallback}` expansion. Remote sources via `http://` and `https://` URLs are also supported.

## Keybinds

| Action | Default |
|--------|---------|
| cancel | `escape` |
| confirm | `return` |
| down / up | `j` / `k` (or `↓` / `↑`) |
| delete | `d` |
| move | `m` |
| new | `n` |
| refresh | `r` |
| scroll up | `[` |
| scroll down | `]` |
| write | `w` |
| quit | `q` |

## Supported file types

`.jsonc` · `.json` · `.yaml` · `.yml` · `.toml`

## Development

```bash
pnpm dev           # run dev server with hot-reload
pnpm test          # run tests
pnpm check         # type-check (tsgo)
```