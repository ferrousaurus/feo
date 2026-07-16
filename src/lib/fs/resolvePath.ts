export default function resolvePath(path: string) {
  const expanded = path.startsWith("~") ? "${HOME}" + path.slice(1) : path;

  return expanded
    .replace(
      /\$\{([A-Za-z_][A-Za-z0-9_]*)(:-|-)([^}]*)\}/g,
      (_match, varName: string, op: string, fallback: string) => {
        const value = process.env[varName];
        if (op === ":-") {
          return value !== undefined && value !== "" ? value : fallback;
        }
        return value !== undefined ? value : fallback;
      },
    )
    .replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_match, varName: string) => {
      return process.env[varName] ?? "";
    });
}
