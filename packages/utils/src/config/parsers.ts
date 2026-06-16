import * as JSONC from "@std/jsonc";
import * as TOML from "@std/toml";
import * as YAML from "@std/yaml";

const parsers = {
  ".json": JSON.parse,
  ".yaml": YAML.parse,
  ".yml": YAML.parse,
  ".toml": TOML.parse,
  ".jsonc": JSONC.parse,
} as const;

export default parsers;