import CodePanel, { type CodePanelProps } from "#/components/panels/CodePanel";
import readConfigFile from "#/lib/readConfigFile";
import { useQuery } from "@tanstack/react-query";
import path from "node:path";
import { z } from "zod/mini";

export type SourcePanelProps = Omit<CodePanelProps, "config" | "path" | "format"> & {
  source?: string;
};

export default function SourcePanel({ source, ...props }: Readonly<SourcePanelProps>) {
  if (source === undefined) {
    return null;
  }

  return <SourcePanelContent source={source} {...props} />;
}

function SourcePanelContent({ source, ...props }: Readonly<SourcePanelProps & { source: string }>) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: [source],
    queryFn: async () => await readConfigFile(source ?? ""),
  });

  if (isPending) {
    return null;
  }

  if (isError) {
    return <text>{error?.message}</text>;
  }

  const { ext } = path.parse(source);

  const validatedExt = z.enum([".jsonc", ".json", ".yaml", ".yml", ".toml"]).safeParse(ext);

  if (!validatedExt.success) {
    return null;
  }

  return <CodePanel config={data ?? {}} path={source} format={validatedExt.data} {...props} />;
}
