import { queryOptions } from "@tanstack/react-query";

import feoConfigValidator, { sourceValidator } from "#/data/feoConfig";

import sourceContentQueryOptions from "./sourceContentQueryOptions";

const configQueryOptions = (path: string) =>
  queryOptions({
    ...sourceContentQueryOptions(sourceValidator.parse({ path })),
    select: (data) => feoConfigValidator.parse(data),
  });

export default configQueryOptions;
