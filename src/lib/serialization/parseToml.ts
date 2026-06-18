import * as TOML from "@std/toml";

export const parseToml = (str: string) => TOML.parse(str);
