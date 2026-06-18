import readFile from "#/lib/io/readFile";
import { queryOptions } from "@tanstack/react-query";
import type { FeoSource } from "./feoConfig";

const sourceContentQueryOptions = (source: FeoSource) =>
  queryOptions({
    queryKey: [source],
    queryFn: async () => await readFile(source.path).then((f) => f.text()),
  });

export default sourceContentQueryOptions;
