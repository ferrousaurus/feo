import keys from "#/lib/object/keys";
import json from "#/lib/serialization/json";
import md from "#/lib/serialization/md";
import toml from "#/lib/serialization/toml";
import yaml from "#/lib/serialization/yaml";
import { z } from "zod/mini";
import type { Serializable } from "../serialization/util";

export type Filetype = {
  filetype: string;
  parse: (str: string) => Serializable;
  stringify: (obj: Serializable) => string;
};

const filetypes = {
  ".jsonc": {
    filetype: "json",
    parse: json.parse,
    stringify: json.stringify,
  } satisfies Filetype,
  ".json": {
    filetype: "json",
    parse: json.parse,
    stringify: json.stringify,
  } satisfies Filetype,
  ".yaml": {
    filetype: "yaml",
    parse: yaml.parse,
    stringify: yaml.stringify,
  } satisfies Filetype,
  ".yml": {
    filetype: "yaml",
    parse: yaml.parse,
    stringify: yaml.stringify,
  } satisfies Filetype,
  ".toml": {
    filetype: "toml",
    parse: toml.parse,
    stringify: toml.stringify,
  } satisfies Filetype,
  ".md": {
    filetype: "md",
    parse: md.parse,
    stringify: md.stringify,
  } satisfies Filetype,
  ".mdx": {
    filetype: "md",
    parse: md.parse,
    stringify: md.stringify,
  } satisfies Filetype,
} as const;

export const SUPPORTED_EXTENSIONS = keys(filetypes);

export const supportedExtensionSchema = z.enum(SUPPORTED_EXTENSIONS);

export default filetypes;
