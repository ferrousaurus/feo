import { queryOptions } from "@tanstack/react-query";

import feoConfigValidator from "#/data/feoConfig";

import sourceContentQueryOptions from "./sourceContentQueryOptions";

const configQueryOptions = (path: string) =>
  queryOptions({
    ...sourceContentQueryOptions({ path }),
    select: (data) => feoConfigValidator.parse(data),
  });

export default configQueryOptions;
