import Keybinds from "#/components/keybinds/Keybinds";
import configQueryOptions from "#/data/configQueryOptions";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import getMergedConfig from "#/lib/getMergedConfig";
import syntaxStyle from "#/lib/syntaxStyle";
import { ScrollBoxRenderable } from "@opentui/core";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import path from "node:path";
import { useRef } from "react";

export type PreviewPanelProps = {
  application?: string;
  active: boolean;
  configPath: string;
  onCancelWrite?: () => void;
  onWrite?: (opts: { path: string; contents: string }) => void;
  target?: string;
};

export default function PreviewPanel({
  application,
  configPath,
  target,
  active,
  onWrite,
  onCancelWrite,
}: Readonly<PreviewPanelProps>) {
  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));

  const sources =
    application === undefined || target === undefined
      ? []
      : (config.configs[application]?.targets[target]?.sources ?? []);

  const { isPending, isError, error, data } = useQuery(
    queryOptions({
      queryKey: ["COMBINED", { configs: sources }],
      queryFn: async () => {
        return await getMergedConfig({ sources });
      },
    }),
  );

  const ref = useRef<ScrollBoxRenderable>(null);

  if (isPending) {
    return null;
  }

  if (isError) {
    return <text>{error?.message}</text>;
  }

  if (target === undefined) {
    return <text>{target} is not defined</text>;
  }

  const { ext } = path.parse(target);

  const validatedExt = supportedExtensionSchema.safeParse(ext);

  const stringify = validatedExt.success
    ? (filetypes[validatedExt.data].stringify ?? ((obj) => obj.toString()))
    : (obj: Record<string, unknown>) => obj.toString();

  return (
    <>
      <scrollbox ref={ref}>
        <line-number>
          <code
            wrapMode="none"
            content={stringify(data)}
            filetype={validatedExt.success ? filetypes[validatedExt.data].filetype : undefined}
            syntaxStyle={syntaxStyle}
          />
        </line-number>
      </scrollbox>
      {active && (
        <Keybinds
          configPath={configPath}
          onCancel={onCancelWrite}
          onScrollUp={() => { ref.current?.scrollBy(-1); }}
          onScrollDown={() => { ref.current?.scrollBy(1); }}
          onWrite={target !== undefined && target !== "" ? () => { onWrite?.({ path: target, contents: stringify(data) }); } : undefined}
        />
      )}
    </>
  );
}
