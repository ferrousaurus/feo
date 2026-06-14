import readConfigFile from "#/lib/readConfigFile";
import { queryOptions } from "@tanstack/react-query";

const fileQueryOptions = (path: string) =>
  queryOptions({
    queryKey: [path],
    queryFn: async () => await readConfigFile(path),
  });

export default fileQueryOptions;
