import CodePanel, { type CodePanelProps } from "#/components/panels/CodePanel";
import configQueryOptions from "#/data/configQueryOptions";
import readConfigFile from "#/lib/readConfigFile";
import { deepMerge } from "@std/collections";
import { queryOptions, useQueries, useSuspenseQuery } from "@tanstack/react-query";

export type PreviewPanelProps = Omit<CodePanelProps, "format" | "path"> & {
  configs: string[];
  target?: string;
};

export default function PreviewPanel({ configPath, configs, target, ...props }: Readonly<PreviewPanelProps>) {
  const { data: format } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => d.settings.previewFormat,
  });

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
    return null;
  }

  if (isError) {
    return <text>{error?.message}</text>;
  }

  return <CodePanel configPath={configPath} path={target} format={format} {...props} />;
}
