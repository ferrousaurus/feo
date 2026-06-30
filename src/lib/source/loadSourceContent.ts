import npath from "node:path";

import type { FeoSource } from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import mediaTypes from "#/lib/config/mediaTypes";
import readFile from "#/lib/io/readFile";
import type { Serializable } from "#/lib/serialization/util";

import liquid from "../templating/liquid";

async function applyTemplate(source: FeoSource, text: string) {
  if ("data" in source) {
    return text;
  }
  switch (source.templatingLanguage) {
    case "liquid": {
      return liquid(text, source.vars);
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
    const text = await readFile(source.url).then((f) => f.text());
    const ext = supportedExtensionSchema.parse(npath.parse(source.url).ext);
    const templated = await applyTemplate(source, text);
    return mediaTypes[filetypes[ext].mediaType].parse(templated);
  }
  return source.data;
}
