import configQueryOptions from "#/data/configQueryOptions";
import configMutationOptions from "#/data/writeConfigMutationOptions";
import filetypes from "feo-utils/config/filetypes";
import readConfigFile from "feo-utils/config/readConfigFile";
import stringifiers from "feo-utils/config/stringifiers";
import syntaxStyle from "#/lib/syntaxStyle";
import { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { deepMerge } from "@std/collections";
import { queryOptions, useMutation, useQueries, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import path from "node:path";
import { type RefObject, useRef } from "react";

type PreviewCodeKeybindsProps = {
  configPath: string;
  contents: string;
  path?: string;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
};

function PreviewCodeKeybinds({
  contents,
  path,
  onWrite,
  onCancelWrite,
  scrollRef,
}: Readonly<PreviewCodeKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "]") {
      scrollRef.current?.scrollBy(1);
    }

    if (key.name === "[") {
      scrollRef.current?.scrollBy(-1);
    }

    if (key.name === "escape") {
      onCancelWrite?.();
    }

    if (path !== undefined && path !== "") {
      if (key.name === "w") {
        onWrite?.({ path, contents });
      }
    }
  });

  return null;
}

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
  const { data: configs } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => {
      if (application === undefined || target === undefined) {
        return [];
      }

      return d.configs[application]?.targets[target]?.sources.map((s) => s.path) ?? [];
    },
  });

  const { isPending, isError, error, data } = useQueries({
    queries: configs.map((c) =>
      queryOptions({
        queryKey: [c],
        queryFn: async () => await readConfigFile(c),
      }),
    ),
    combine: (rs) => {
      const errors = rs.filter((r) => r.isError).map((r) => r.error);

      return {
        isPending: rs.some((r) => r.isPending),
        isError: errors.length > 0,
        error: errors.length === 0 ? undefined : errors.length === 1 ? errors[0] : new AggregateError(errors),
        data: rs.every((r) => r.isSuccess) ? rs.reduce((p, c) => deepMerge(p, c.data), {}) : undefined,
      };
    },
  });

  const ref = useRef<ScrollBoxRenderable>(null);

  if (isPending) {
    return null;
  }

  if (isError) {
    return <text>{error?.message}</text>;
  }

  if (data === undefined) {
    return null;
  }

  if (target === undefined) {
    return <text>{target} is not defined</text>;
  }

  const { ext } = path.parse(target);

  const stringify = stringifiers[ext] ?? ((obj) => obj.toString());

  return (
    <>
      <scrollbox ref={ref}>
        <line-number>
          <code
            wrapMode="none"
            content={stringify(data)}
            filetype={ext === undefined ? undefined : filetypes[ext]}
            syntaxStyle={syntaxStyle}
          />
        </line-number>
      </scrollbox>
      {active && (
        <PreviewCodeKeybinds
          scrollRef={ref}
          contents={stringify(data)}
          configPath={configPath}
          path={target}
          onWrite={onWrite}
          onCancelWrite={onCancelWrite}
        />
      )}
    </>
  );
}
