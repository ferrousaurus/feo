import { queryOptions, useQueries } from "@tanstack/react-query";
import Preview, { type PreviewProps } from "./Preview";
import resolveAbsolutePath from "../lib/resolveAbsolutePath";
import getProtocol from "../lib/getProtocol";
import readConfigFile from "../lib/readConfigFile";
import { deepMerge } from "@std/collections";

export type PreviewLoaderProps = Omit<PreviewProps, "config"> & {
  configs: string[];
};

export default function PreviewLoader({ configs, ...props }: Readonly<PreviewLoaderProps>) {
  const { isPending, isError, error, data } = useQueries({
    queries: configs.map((c) =>
      queryOptions({
        queryKey: [c],
        queryFn: async () => await readConfigFile(c),
      }),
    ),
    combine: (rs) => ({
      isPending: rs.some((r) => r.isPending),
      isError: rs.some((r) => r.isError),
      error: rs.some((r) => r.isError)
        ? new AggregateError(rs.flatMap((r) => (r.isError ? [r.error] : [])))
        : undefined,
      data: rs.every((r) => r.isSuccess) ? rs.reduce((p, c) => deepMerge(p, c.data), {}) : undefined,
    }),
  });

  if (isPending) {
    return <></>;
  }

  if (isError) {
    return <text>{error?.message}</text>;
  }

  return <Preview config={data ?? {}} {...props} />;
}
