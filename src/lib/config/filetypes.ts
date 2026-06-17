import * as TOML from "@std/toml";
import * as YAML from "@std/yaml";
import { z } from "zod/mini";

export const SUPPORTED_EXTENSIONS = [".jsonc", ".json", ".yaml", ".yml", ".toml"] as const;

export const supportedExtensionSchema = z.enum(SUPPORTED_EXTENSIONS);

const recordValidator = z.record(z.string(), z.unknown());

const filetypes: Record<
  (typeof SUPPORTED_EXTENSIONS)[number],
  {
    filetype: string;
    parse: (str: string) => Record<string, unknown>;
    stringify: (obj: Record<string, unknown>) => string;
  }
> = {
  ".jsonc": {
    filetype: "json",
    parse: (str) => recordValidator.parse(JSON.parse(str)),
    stringify: (obj) => JSON.stringify(obj, null, 2),
  },
  ".json": {
    filetype: "json",
    parse: (str) => recordValidator.parse(JSON.parse(str)),
    stringify: (obj) => JSON.stringify(obj, null, 2),
  },
  ".yaml": {
    filetype: "yaml",
    parse: (str) => recordValidator.parse(YAML.parse(str)),
    stringify: YAML.stringify,
  },
  ".yml": {
    filetype: "yaml",
    parse: (str) => recordValidator.parse(YAML.parse(str)),
    stringify: YAML.stringify,
  },
  ".toml": { filetype: "toml", parse: TOML.parse, stringify: TOML.stringify },
};

export default filetypes;
