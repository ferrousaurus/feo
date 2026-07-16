import * as YAML from "@std/yaml";

import type { Serializable } from "./util";
import { serializableValidator } from "./util";

export const parse = (str: string) => serializableValidator.parse(YAML.parse(str));

export const stringify = (obj: Serializable) => YAML.stringify(obj);

export default { parse, stringify };
