import type { Serializable } from "./util";

export const stringifyJson = (obj: Serializable) => JSON.stringify(obj, null, 2);
