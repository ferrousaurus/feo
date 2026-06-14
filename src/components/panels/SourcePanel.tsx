import CodePanel, { type CodePanelProps } from "#/components/panels/CodePanel";
import path from "node:path";
import { z } from "zod/mini";

export type SourcePanelProps = Omit<CodePanelProps, "format" | "path"> & {
  source?: string;
};

export default function SourcePanel({ source, ...props }: Readonly<SourcePanelProps>) {
  if (source === undefined) {
    return null;
  }

  return <SourcePanelContent source={source} {...props} />;
}

function SourcePanelContent({ source, ...props }: Readonly<SourcePanelProps & { source: string }>) {
  const { ext } = path.parse(source);

  const validatedExt = z.enum([".jsonc", ".json", ".yaml", ".yml", ".toml"]).safeParse(ext);

  if (!validatedExt.success) {
    return null;
  }

  return <CodePanel path={source} format={validatedExt.data} {...props} />;
}
