import { queryOptions } from "@tanstack/react-query";
import readConfigFile from "../lib/readConfigFile";
import resolveAbsolutePath from "../lib/resolveAbsolutePath";
import feoConfigValidator from "./feoConfig";

const configQueryOptions = queryOptions({
  queryKey: ["~/.config/feo/config.toml"],
  queryFn: async () => {
    const contents = await readConfigFile(resolveAbsolutePath("~/.config/feo/config.toml"));

    return feoConfigValidator.parse(contents);
  },
});

export default configQueryOptions;
