import configQueryOptions from "#/data/configQueryOptions";
import fileQueryOptions from "#/data/fileQueryOptions";
import configMutationOptions from "#/data/writeConfigMutationOptions";
import syntaxStyle from "#/lib/style/syntaxStyle";
import { RGBA, ScrollBoxRenderable, SyntaxStyle } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import * as TOML from "@std/toml";
import * as YAML from "@std/yaml";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, type RefObject } from "react";

const stringifiers = {
  ".jsonc": (obj: Record<string, unknown>) => JSON.stringify(obj, null, 2),
  ".json": (obj: Record<string, unknown>) => JSON.stringify(obj, null, 2),
  ".yaml": YAML.stringify,
  ".yml": YAML.stringify,
  ".toml": TOML.stringify,
};

const filetypes = {
  ".jsonc": "jsonc",
  ".json": "json",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
};

function CodePanelKeybinds({
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

export type DefinedCodePanelProps = {
  active: boolean;
  configPath: string;
  format: keyof typeof filetypes;
  path: string;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
};

function DefinedCodePanel({
  path,
  format,
  active,
  configPath,
  onWrite,
  onCancelWrite,
}: Readonly<DefinedCodePanelProps>) {
  const { isPending, isError, error, data: config } = useQuery(fileQueryOptions(path));

  const ref = useRef<ScrollBoxRenderable>(null);

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
        <CodePanelKeybinds
          scrollRef={ref}
          contents={contents}
          configPath={configPath}
          path={path}
          onWrite={onWrite}
          onCancelWrite={onCancelWrite}
        />
      )}
    </>
  );
}

export type CodePanelProps = Omit<DefinedCodePanelProps, "path"> & {
  path?: string;
};

export default function CodePanel({ path, ...props }: Readonly<CodePanelProps>) {
  if (path === undefined) {
    return null;
  }

  return <DefinedCodePanel path={path} {...props} />;
}
