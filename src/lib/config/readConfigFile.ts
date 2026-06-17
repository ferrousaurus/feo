import filetypes from "#/lib/config/filetypes";
import readFile from "#/lib/io/readFile";
import keys from "#/lib/object/keys";
import { z } from "zod/mini";

export class UnsupportedExtentionError extends Error {
  ext: string;
  constructor(ext: string) {
    super(`The ${ext} file type is not supported`);
    this.ext = ext;
  }
}

export default async function readConfigFile(path: string) {
  const contents = await readFile(path).then((f) => f.text());

  const { ext } = (await import("node:path")).parse(path);

  const supportedExt = z.enum(keys(filetypes)).safeParse(ext);

  if (!supportedExt.success) {
    throw new UnsupportedExtentionError(ext);
  }

  return filetypes[supportedExt.data]?.parse(contents);
}
