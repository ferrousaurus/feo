import { z } from "zod";

import json from "#/lib/serialization/json";
import toml from "#/lib/serialization/toml";
import yaml from "#/lib/serialization/yaml";

import type { Serializable } from "./util";

const handleMatch = (matched: Exclude<RegExpMatchArray, null>, parse: (frontmatter: string) => z.JSONType) => {
  const [, frontmatter, content] = matched;
  if (frontmatter === undefined) {
    return { content: content ?? "" };
  }
  return { content: content ?? "", frontmatter: z.json().parse(parse(frontmatter)) };
};

export const parse = (str: string): { frontmatter?: z.JSONType; content: string } => {
  const yamlMatch = str.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (yamlMatch !== null) {
    return handleMatch(yamlMatch, yaml.parse);
  }
  const tomlMatch = str.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n([\s\S]*)$/);
  if (tomlMatch !== null) {
    return handleMatch(tomlMatch, toml.parse);
  }
  const jsonMatch = str.match(/^;;;\n([\s\S]*?)\n;;;\n([\s\S]*)$/);
  if (jsonMatch !== null) {
    return handleMatch(jsonMatch, json.parse);
  }
  return { content: str };
};

export const stringify = (obj: Serializable): string => {
  const { content, frontmatter } = obj;
  const frontmatterAsRecord = z.record(z.string(), z.unknown()).safeParse(frontmatter);
  if (!frontmatterAsRecord.success || Object.keys(frontmatterAsRecord.data).length === 0) {
    return `${content}`;
  }
  return `---\n${yaml.stringify(z.record(z.string(), z.json()).parse(frontmatter))}---\n${content}`;
};

export default { parse, stringify };
