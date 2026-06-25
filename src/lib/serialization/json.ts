import * as JSONC from "@std/jsonc";

import { serializableValidator } from "./util";
import type { Serializable } from "./util";

export const parse = (str: string) => serializableValidator.parse(JSONC.parse(str));

export const stringify = (obj: Serializable) => JSON.stringify(obj, null, 2);

export default { parse, stringify };
