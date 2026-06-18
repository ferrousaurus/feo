import * as YAML from "@std/yaml";
import { serializableValidator } from "./util";

export const parseYaml = (str: string) => serializableValidator.parse(YAML.parse(str));
