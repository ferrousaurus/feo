import parsers from "#/config/parsers";
import { z } from "zod/mini";
import readFile from "feo-utils/io/readFile";
import keys from "feo-utils/object/keys";

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
