import resolveAbsolutePath from "./resolveAbsolutePath";

import { z } from "zod/mini";
import keys from "../util/object/keys";
import getProtocol from "./getProtocol";

const getParser = {
  ".json": () => JSON.parse,
  ".yaml": async () => import("@std/yaml").then(({ parse }) => parse),
  ".yml": async () => import("@std/yaml").then(({ parse }) => parse),
  ".toml": async () => import("@std/toml").then(({ parse }) => parse),
  ".jsonc": async () => import("@std/jsonc").then(({ parse }) => parse),
} as const;

export class UnsupportedExtention extends Error {
  ext: string;
  constructor(ext: string) {
    super(`The ${ext} file type is not supported`);
    this.ext = ext;
  }
}

export class UnsupportedProtocol extends Error {
  protocol: string;
  constructor(protocol: string) {
    super(`The ${protocol} protocol is not supported`);
    this.protocol = protocol;
  }
}

export default async function readConfigFile(path: string) {
  const absolutePath = resolveAbsolutePath(path);

  const { ext } = (await import("node:path")).parse(path);

  const supportedExt = z.enum(keys(getParser)).safeParse(ext);

  if (!supportedExt.success) {
    throw new UnsupportedExtention(ext);
  }

  const parse = await getParser[supportedExt.data]();

  const protocol = getProtocol(absolutePath);
  const validatedProtocol = z.enum(["file:", "http:", "https:"]).safeParse(protocol);
  if (!validatedProtocol.success) {
    throw new UnsupportedProtocol(protocol);
  }
  const contents =
    protocol === "file:"
      ? await Bun.file(absolutePath).text()
      : await fetch(absolutePath)
          .then((r) => (r.ok ? r : Promise.reject(r)))
          .then((r) => r.text());

  return parse(contents);
}
