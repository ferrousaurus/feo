import * as INI from "@std/ini";
import { serializableValidator } from "./util";

export const parseIni = (str: string) => serializableValidator.parse(INI.parse(str));
