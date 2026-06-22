import npath from "node:path";

import type { FeoSource } from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import readFile from "#/lib/io/readFile";
import type { Serializable } from "#/lib/serialization/util";

export default async function loadSourceContent(source: FeoSource): Promise<Serializable> {
  if ("path" in source) {
    const text = await readFile(source.path).then((f) => f.text());
    const ext = supportedExtensionSchema.parse(npath.parse(source.path).ext);
    return filetypes[ext].parse(text);
  }
  if ("url" in source) {
    const text = await readFile(source.url).then((f) => f.text());
    const ext = supportedExtensionSchema.parse(npath.parse(source.url).ext);
    return filetypes[ext].parse(text);
  }
  return source.data;
}
