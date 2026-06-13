import CodePanel, { type CodePanelProps } from "#/components/panels/CodePanel";
import readConfigFile from "#/lib/readConfigFile";
import { deepMerge } from "@std/collections";
import { queryOptions, useQueries } from "@tanstack/react-query";

export type PreviewPanelProps = Omit<CodePanelProps, "config" | "path"> & {
  configs: string[];
  target?: string;
};

export default function PreviewPanel({ configs, target, ...props }: Readonly<PreviewPanelProps>) {
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

  return <CodePanel config={data ?? {}} path={target} {...props} />;
}
