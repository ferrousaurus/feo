import * as YAML from "@std/yaml";
import { z, type JSONType } from "zod/mini";

import type { Serializable } from "./util";

export const parse = (str: string): { content: string; frontmatter?: JSONType } => {
  const match = str.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match === null) {
    return { content: str };
  }
  const [, frontmatter, content] = match;
  if (frontmatter === undefined) {
    return { content: content ?? "" };
  }
  return { content: content ?? "", frontmatter: z.json().parse(YAML.parse(frontmatter)) };
};

export const stringify = (obj: Serializable) => {
  const { content, frontmatter } = obj;
  if (frontmatter === undefined) {
    return `${content}`;
  }
  return `---\n${YAML.stringify(frontmatter)}---\n${content}`;
};

export default { parse, stringify };
