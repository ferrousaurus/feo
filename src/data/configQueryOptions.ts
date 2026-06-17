import feoConfigValidator from "#/data/feoConfig";
import { queryOptions } from "@tanstack/react-query";
import readConfigFile from "#/lib/config/readConfigFile";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";

const configQueryOptions = (path: string) =>
  queryOptions({
    queryKey: [{ path, kind: "object" }],
    queryFn: async () => {
      const contents = await readConfigFile(resolveAbsolutePath(path));

      return feoConfigValidator.parse(contents);
    },
  });

export default configQueryOptions;
