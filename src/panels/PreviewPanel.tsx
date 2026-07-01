import { ScrollBoxRenderable } from "@opentui/core";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";

import Keybinds from "#/components/Keybinds";
import configQueryOptions from "#/data/configQueryOptions";
import mediaTypes from "#/lib/config/mediaTypes";
import getMergedConfig from "#/lib/getMergedConfig";
import syntaxStyle from "#/lib/syntaxStyle";

export type PreviewPanelProps = {
  application?: string;
  active: boolean;
  mutating?: boolean;
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
  mutating = false,
  onWrite,
  onCancelWrite,
}: Readonly<PreviewPanelProps>) {
  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));

  const sources =
    application === undefined || target === undefined
      ? []
      : (config.applications[application]?.targets[target]?.sources ?? []);

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

  if (application === undefined || target === undefined) {
    return <text>{target} is not defined</text>;
  }

  const targetPath = config.applications[application]?.targets[target]?.path ?? "";

  const mediaType = config.applications[application]?.targets[target]?.mediaType

  const stringify = mediaType !== undefined
    ? (mediaTypes[mediaType].stringify)
    : (obj: Record<string, unknown>) => obj.toString();

  return (
    <>
      <scrollbox ref={ref}>
        <line-number>
          <code
            wrapMode="none"
            content={stringify(data)}
            filetype={mediaType !== undefined ? mediaTypes[mediaType].filetype : undefined}
            syntaxStyle={syntaxStyle}
          />
        </line-number>
      </scrollbox>
      {active && (
        <Keybinds
          configPath={configPath}
          onCancel={onCancelWrite}
          onScrollUp={() => {
            ref.current?.scrollBy(-1);
          }}
          onScrollDown={() => {
            ref.current?.scrollBy(1);
          }}
          onConfirm={
            mutating && target !== undefined && target !== ""
              ? () => {
                  onWrite?.({ path: targetPath, contents: stringify(data) });
                }
              : undefined
          }
          onWrite={
            !mutating && target !== undefined && target !== ""
              ? () => {
                  onWrite?.({ path: targetPath, contents: stringify(data) });
                }
              : undefined
          }
        />
      )}
    </>
  );
}
