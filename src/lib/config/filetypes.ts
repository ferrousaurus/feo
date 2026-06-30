import { z } from "zod";

import keys from "#/lib/object/keys";

import mediaTypes from "./mediaTypes";

export type Filetype = {
  mediaType: keyof typeof mediaTypes;
};

const filetypes = {
  ".jsonc": {
    mediaType: "application/json",
  },
  ".json": {
    mediaType: "application/json",
  },
  ".yaml": {
    mediaType: "application/yaml",
  },
  ".yml": {
    mediaType: "application/yaml",
  },
  ".toml": {
    mediaType: "application/toml",
  },
  ".md": {
    mediaType: "text/markdown",
  },
  ".mdx": {
    mediaType: "text/markdown",
  },
} as const;

export const SUPPORTED_EXTENSIONS = keys(filetypes);

export const supportedExtensionSchema = z.enum(SUPPORTED_EXTENSIONS);

export default filetypes;
