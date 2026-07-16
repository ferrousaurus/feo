import { queryOptions } from "@tanstack/react-query";

import loadSourceContent from "#/lib/source/loadSourceContent";

import type { FeoSource } from "./feoConfig";

const sourceContentQueryOptions = (source: FeoSource, configPath: string) =>
  queryOptions({
    queryKey: [{ configPath, source }],
    queryFn: () => loadSourceContent(source, configPath),
  });

export default sourceContentQueryOptions;
