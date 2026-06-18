import keys from "#/lib/object/keys";
import { parseIni } from "#/lib/serialization/parseIni";
import { parseJson } from "#/lib/serialization/parseJson";
import { parseMd } from "#/lib/serialization/parseMd";
import { parseToml } from "#/lib/serialization/parseToml";
import { parseYaml } from "#/lib/serialization/parseYaml";
import { stringifyIni } from "#/lib/serialization/stringifyIni";
import { stringifyJson } from "#/lib/serialization/stringifyJson";
import { stringifyMd } from "#/lib/serialization/stringifyMd";
import { stringifyToml } from "#/lib/serialization/stringifyToml";
import { stringifyYaml } from "#/lib/serialization/stringifyYaml";
import { z } from "zod/mini";

export type Filetype = {
  filetype: string;
  parse: (str: string) => Record<string, unknown>;
  stringify: (obj: Record<string, unknown>) => string;
};

const filetypes = {
  ".ini": {
    filetype: "ini",
    parse: parseIni,
    stringify: stringifyIni,
  } satisfies Filetype,
  ".jsonc": {
    filetype: "json",
    parse: parseJson,
    stringify: stringifyJson,
  } satisfies Filetype,
  ".json": {
    filetype: "json",
    parse: parseJson,
    stringify: stringifyJson,
  } satisfies Filetype,
  ".yaml": {
    filetype: "yaml",
    parse: parseYaml,
    stringify: stringifyYaml,
  } satisfies Filetype,
  ".yml": {
    filetype: "yaml",
    parse: parseYaml,
    stringify: stringifyYaml,
  } satisfies Filetype,
  ".toml": {
    filetype: "toml",
    parse: parseToml,
    stringify: stringifyToml,
  } satisfies Filetype,
  ".md": {
    filetype: "md",
    parse: parseMd,
    stringify: stringifyMd,
  } satisfies Filetype,
  ".mdx": {
    filetype: "md",
    parse: parseMd,
    stringify: stringifyMd,
  } satisfies Filetype,
} as const;

export const SUPPORTED_EXTENSIONS = keys(filetypes);

export const supportedExtensionSchema = z.enum(SUPPORTED_EXTENSIONS);

export default filetypes;
