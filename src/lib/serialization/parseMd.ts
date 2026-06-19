import * as YAML from "@std/yaml";
import { serializableValidator } from "./util";

export const parseMd = (str: string) => {
  const match = str.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match === null) {
    return { content: str };
  }
  const [, frontmatter, content] = match;
  if (frontmatter === undefined) {
    return { content: content ?? "" };
  }
  return { content: content ?? "", frontmatter: serializableValidator.parse(YAML.parse(frontmatter)) };
};
