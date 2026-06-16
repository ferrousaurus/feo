import feoConfigValidator from "#/data/feoConfig";
import readConfigFile from "#/lib/readConfigFile";
import resolveAbsolutePath from "feo-utils/fs/resolveAbsolutePath";
import { queryOptions } from "@tanstack/react-query";

const configQueryOptions = (path: string) =>
  queryOptions({
    queryKey: [{ path, kind: "object" }],
    queryFn: async () => {
      const contents = await readConfigFile(resolveAbsolutePath(path));

      return feoConfigValidator.parse(contents);
    },
  });

export default configQueryOptions;
