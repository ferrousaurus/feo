import configQueryOptions from "#/data/configQueryOptions";
import configMutationOptions from "#/data/writeConfigMutationOptions";
import fileQueryOptions from "#/data/fileQueryOptions";
import filetypes from "#/lib/filetypes";
import readConfigFile from "#/lib/readConfigFile";
import stringifiers from "#/lib/stringifiers";
import syntaxStyle from "#/lib/style/syntaxStyle";
import { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { deepMerge } from "@std/collections";
import { queryOptions, useMutation, useQueries, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { type RefObject, useRef } from "react";

export type PreviewPanelProps = {
  application?: string;
  active: boolean;
  configPath: string;
  onCancelWrite?: () => void;
  onWrite?: (opts: { path: string; contents: string }) => void;
  target?: string;
};

function PreviewCodeKeybinds({
  configPath,
  contents,
  path,
  onWrite,
  onCancelWrite,
  scrollRef,
}: {
  configPath: string;
  contents: string;
  path?: string;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
}) {
  const { isSuccess, data } = useQuery(configQueryOptions(configPath));
  const { mutateAsync } = useMutation(configMutationOptions(configPath));

  useKeyboard((key) => {
    if (isSuccess && key.name === "space") {
      void mutateAsync({
        ...data,
        settings: {
          ...data.settings,
          previewFormat:
            data.settings.previewFormat === ".json"
              ? ".yaml"
              : data.settings.previewFormat === ".yaml"
                ? ".toml"
                : ".json",
        },
      });
    }

    if (key.name === "j" || key.name === "down") {
      scrollRef.current?.scrollBy(1);
    }

    if (key.name === "k" || key.name === "up") {
      scrollRef.current?.scrollBy(-1);
    }

    if (key.name === "escape") {
      onCancelWrite?.();
    }

    if (path !== undefined && path !== "") {
      if (key.name === "return") {
        onWrite?.({ path, contents });
      }
    }
  });

  return null;
}

export default function PreviewPanel({
  application,
  configPath,
  target,
  active,
  onWrite,
  onCancelWrite,
}: Readonly<PreviewPanelProps>) {
  const { data: format } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => d.settings.previewFormat,
  });

  const { data: configs } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => {
      const applicationData = application === undefined ? { targets: {} } : d.configs[application];

      return (application === undefined || target === undefined ? [] : applicationData?.targets[target]?.sources) ?? [];
    },
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

  const stringify = stringifiers[format];

  return (
    <>
      <scrollbox ref={ref}>
        <code content={stringify(data)} filetype={filetypes[format]} syntaxStyle={syntaxStyle} />
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
