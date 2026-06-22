import { deepMerge } from "@std/collections";

import type { FeoSource } from "#/data/feoConfig";
import loadSourceContent from "#/lib/source/loadSourceContent";

export type GetMergedConfigProps = {
  sources: FeoSource[];
};

export default async function getMergedConfig({ sources }: Readonly<GetMergedConfigProps>) {
  const objs = await Promise.allSettled(sources.map(async (s) => loadSourceContent(s)));

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
