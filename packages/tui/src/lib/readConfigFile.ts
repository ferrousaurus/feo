import keys from "feo-utils/object/keys";
import * as JSONC from "@std/jsonc";
import * as TOML from "@std/toml";
import * as YAML from "@std/yaml";
import { z } from "zod/mini";
import readFile from "feo-utils/io/readFile";

const parsers = {
  ".json": JSON.parse,
  ".yaml": YAML.parse,
  ".yml": YAML.parse,
  ".toml": TOML.parse,
  ".jsonc": JSONC.parse,
} as const;

export class UnsupportedExtentionError extends Error {
  ext: string;
  constructor(ext: string) {
    super(`The ${ext} file type is not supported`);
    this.ext = ext;
  }
}

export default async function readConfigFile(path: string) {
  const contents = await readFile(path).then((f) => f.text());

  if (contents === null) {
    return null;
  }

  const { ext } = (await import("node:path")).parse(path);

  const supportedExt = z.enum(keys(parsers)).safeParse(ext);

  if (!supportedExt.success) {
    throw new UnsupportedExtentionError(ext);
  }

  return parsers[supportedExt.data](contents);
}
