import * as TOML from "@std/toml";
import * as YAML from "@std/yaml";

const stringifiers: Record<string, (obj: Record<string, unknown>) => string> = {
  ".jsonc": (obj: Record<string, unknown>) => JSON.stringify(obj, null, 2),
  ".json": (obj: Record<string, unknown>) => JSON.stringify(obj, null, 2),
  ".yaml": (obj: Record<string, unknown>) => YAML.stringify(obj),
  ".yml": (obj: Record<string, unknown>) => YAML.stringify(obj),
  ".toml": (obj: Record<string, unknown>) => TOML.stringify(obj),
};

export default stringifiers;