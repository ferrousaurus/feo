import type { Serializable } from "./util";

export const parse = (str: string): { content: string } => {
  return { content: str };
};

export const stringify = (obj: Serializable): string => {
  const { content } = obj;

  return `${content}`;
};

export default { parse, stringify };
