import * as JSONC from "@std/jsonc";
import { serializableValidator } from "./util";

export const parseJson = (str: string) => serializableValidator.parse(JSONC.parse(str));
