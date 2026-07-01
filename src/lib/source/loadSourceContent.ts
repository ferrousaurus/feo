import npath from "node:path";

import type { FeoSource } from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import mediaTypes, { supportedMediaTypeSchema } from "#/lib/config/mediaTypes";
import readFile, { readHttpFile } from "#/lib/io/readFile";
import type { Serializable } from "#/lib/serialization/util";

import liquid from "../templating/liquid";

async function applyTemplate(source: FeoSource, text: string) {
  if ("data" in source) {
    return text;
  }
  switch (source.template?.language) {
    case "liquid": {
      return liquid(text, source.template.vars ?? {});
    }
    default: {
      return text;
    }
  }
}

export default async function loadSourceContent(source: FeoSource): Promise<Serializable> {
  if ("path" in source) {
    const text = await readFile(source.path).then((f) => f.text());
    const ext = supportedExtensionSchema.parse(npath.parse(source.path).ext);
    const templated = await applyTemplate(source, text);
    return mediaTypes[filetypes[ext].mediaType].parse(templated);
  }
  if ("url" in source) {
    const response = await readHttpFile(source.url)
    const text = await response.text();
    const contentType = supportedMediaTypeSchema.safeParse(response.headers.get("Content-Type")?.split(";")[0]);
    const mediaType = source.mediaType !== undefined ? mediaTypes[source.mediaType] : (contentType.success ? mediaTypes[contentType.data] :  mediaTypes[filetypes[supportedExtensionSchema.parse(npath.parse(source.url).ext)].mediaType]);
    const templated = await applyTemplate(source, text);
    return mediaType.parse(templated);
  }
  return source.data;
}
