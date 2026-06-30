import mediaTypes from "#/lib/config/mediaTypes";
import { z } from "zod/mini";

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
    return handleMatch(yamlMatch, mediaTypes["application/yaml"].parse);
  }
  const tomlMatch = str.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n([\s\S]*)$/);
  if (tomlMatch !== null) {
    return handleMatch(tomlMatch, mediaTypes["application/toml"].parse);
  }
  const jsonMatch = str.match(/^;;;\n([\s\S]*?)\n;;;\n([\s\S]*)$/);
  if (jsonMatch !== null) {
    return handleMatch(jsonMatch, mediaTypes["application/json"].parse);
  }
  return { content: str };
};

export const stringify = (obj: Serializable): string => {
  const { content, frontmatter } = obj;
  if (frontmatter === undefined) {
    return `${content}`;
  }
  return `---\n${mediaTypes["application/yaml"].stringify(z.record(z.string(), z.json()).parse(frontmatter))}---\n${content}`;
};

export default { parse, stringify };
