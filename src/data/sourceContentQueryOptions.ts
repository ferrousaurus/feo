import { queryOptions } from "@tanstack/react-query";

import loadSourceContent from "#/lib/source/loadSourceContent";

import type { FeoSource } from "./feoConfig";

const sourceContentQueryOptions = (source: FeoSource) =>
  queryOptions({
    queryKey: [source],
    queryFn: () => loadSourceContent(source),
  });

export default sourceContentQueryOptions;
