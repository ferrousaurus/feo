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
