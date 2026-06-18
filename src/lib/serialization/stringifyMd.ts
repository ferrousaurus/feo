import * as YAML from "@std/yaml";
import keys from "../object/keys";
import type { Serializable } from "./util";

export const stringifyMd = (obj: Serializable) => {
  const { content, ...frontmatter } = obj;
  if (keys(frontmatter).length === 0) {
    return `${content}`;
  }
  return `---\n${YAML.stringify(frontmatter)}---\n${content}`;
};
