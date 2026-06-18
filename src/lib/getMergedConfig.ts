import { deepMerge } from "@std/collections";

import type { FeoSource } from "#/data/feoConfig";

import readConfigFile from "./config/readConfigFile";

export type GetMergedConfigProps = {
  sources: FeoSource[];
};

export default async function getMergedConfig({ sources }: Readonly<GetMergedConfigProps>) {
  const objs = await Promise.allSettled(sources.map(async (s) => await readConfigFile(s.path)));

  const errors = objs.filter((o) => o.status === "rejected").map((o) => o.reason);

  if (errors.length === 1) {
    throw errors[0];
  }

  if (errors.length > 1) {
    throw new AggregateError(errors);
  }

  const successes = objs.filter((o) => o.status === "fulfilled").map((o) => o.value);

  return successes.reduce((p, c) => deepMerge(c, p), {});
}
