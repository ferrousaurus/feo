import * as YAML from "@std/yaml";
import type { Serializable } from "./util";

export const stringifyYaml = (obj: Serializable) => YAML.stringify(obj);
