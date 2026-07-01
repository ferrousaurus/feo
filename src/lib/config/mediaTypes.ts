import type { CodeProps } from "@opentui/react";
import { z } from "zod";

import json from "#/lib/serialization/json";
import md from "#/lib/serialization/md";
import toml from "#/lib/serialization/toml";
import txt from "#/lib/serialization/txt";
import yaml from "#/lib/serialization/yaml";

import keys from "../object/keys";
import type { Serializable } from "../serialization/util";

export type MediaType = {
  filetype: CodeProps["filetype"];
  parse: (str: string) => Serializable;
  stringify: (obj: Serializable) => string;
};

const mediaTypes = {
  "application/json": {
    filetype: "json",
    parse: json.parse,
    stringify: json.stringify,
  } satisfies MediaType,
  "application/yaml": {
    filetype: "yaml",
    parse: yaml.parse,
    stringify: yaml.stringify,
  } satisfies MediaType,
  "application/toml": {
    filetype: "toml",
    parse: toml.parse,
    stringify: toml.stringify,
  } satisfies MediaType,
  "text/markdown": {
    filetype: "markdown",
    parse: md.parse,
    stringify: md.stringify,
  } satisfies MediaType,
  "text/plain": {
    filetype: "text",
    parse: txt.parse,
    stringify: txt.stringify,
  } satisfies MediaType,
} as const;

export const SUPPORTED_MEDIA_TYPES = keys(mediaTypes);

export const supportedMediaTypeSchema = z.enum(SUPPORTED_MEDIA_TYPES);

export default mediaTypes;
