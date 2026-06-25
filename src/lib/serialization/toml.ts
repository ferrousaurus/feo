import * as TOML from "@std/toml";

import { serializableValidator, type Serializable } from "./util";

export const parse = (str: string) => serializableValidator.parse(TOML.parse(str));

export const stringify = (obj: Serializable) => TOML.stringify(obj);

export default { parse, stringify };
