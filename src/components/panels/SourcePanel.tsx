import configQueryOptions from "#/data/configQueryOptions";
import configMutationOptions from "#/data/writeConfigMutationOptions";
import fileQueryOptions from "#/data/fileQueryOptions";
import filetypes from "#/lib/filetypes";
import stringifiers from "#/lib/stringifiers";
import syntaxStyle from "#/lib/style/syntaxStyle";
import { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import path from "node:path";
import { type RefObject, useRef } from "react";
import { z } from "zod/mini";

export type SourcePanelProps = {
  active: boolean;
  configPath: string;
  onCancelWrite?: () => void;
  onWrite?: (opts: { path: string; contents: string }) => void;
  source?: string;
};

function SourceCodeKeybinds({
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

export default function SourcePanel({ source, ...props }: Readonly<SourcePanelProps>) {
  if (source === undefined) {
    return null;
  }

  return <SourcePanelContent source={source} {...props} />;
}

function SourcePanelContent({ source, configPath, active, onWrite, onCancelWrite }: Readonly<Omit<SourcePanelProps, "source"> & { source: string }>) {
  const { ext } = path.parse(source);
  const validatedExt = z.enum([".jsonc", ".json", ".yaml", ".yml", ".toml"]).safeParse(ext);
  const format = validatedExt.success ? validatedExt.data : null;

  const { isPending, isError, error, data: config } = useQuery(fileQueryOptions(source));
  const ref = useRef<ScrollBoxRenderable>(null);

  if (!format) {
    return null;
  }

  if (isPending) {
    return <scrollbox ref={ref} />;
  }

  if (isError) {
    return (
      <scrollbox ref={ref}>
        <text>{error.message}</text>
      </scrollbox>
    );
  }

  const stringify = stringifiers[format];
  const contents = stringify(config);

  return (
    <>
      <scrollbox ref={ref}>
        <code content={contents} filetype={filetypes[format]} syntaxStyle={syntaxStyle} />
      </scrollbox>
      {active && (
        <SourceCodeKeybinds
          scrollRef={ref}
          contents={contents}
          configPath={configPath}
          path={source}
          onWrite={onWrite}
          onCancelWrite={onCancelWrite}
        />
      )}
    </>
  );
}