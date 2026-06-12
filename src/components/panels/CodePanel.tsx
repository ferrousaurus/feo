import { RGBA, ScrollBoxRenderable, SyntaxStyle } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import * as TOML from "@std/toml";
import * as YAML from "@std/yaml";
import { useMutation, useQuery } from "@tanstack/react-query";
import { use, useRef, type RefObject } from "react";
import type { FeoConfig } from "#/data/feoConfig";
import feoConfigValidator from "#/data/feoConfig";
import writeFile from "#/lib/io/writeFile";
import readConfigFile from "#/lib/readConfigFile";
import resolveAbsolutePath from "#/lib/resolveAbsolutePath";
import configMutationOptions from "#/data/configMutationOptions";
import configQueryOptions from "#/data/configQueryOptions";
import { AppContext } from "../App";

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

export type CodePanelProps = {
  active: boolean;
  format: keyof typeof filetypes;
  path?: string;
  config: Record<string, unknown>;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
};

const syntaxStyle = SyntaxStyle.fromStyles({
  string: { fg: RGBA.fromIndex(13) },
  "string.special.key": { fg: RGBA.fromIndex(14) },
  "string.special": { fg: RGBA.fromIndex(5) },
  number: { fg: RGBA.fromIndex(3) },
  "constant.builtin": { fg: RGBA.fromIndex(5) },
  boolean: { fg: RGBA.fromIndex(5) },
  escape: { fg: RGBA.fromIndex(5) },
  comment: { fg: RGBA.fromIndex(4) },
  label: { fg: RGBA.fromIndex(13) },
  type: { fg: RGBA.fromIndex(2), bold: true },
  attribute: { fg: RGBA.fromIndex(5) },
  property: { fg: RGBA.fromIndex(14) },
  "punctuation.delimiter": {},
  "punctuation.bracket": {},
  "punctuation.special": { fg: RGBA.fromIndex(5) },
  operator: {},
});

function CodePanelKeybinds({
  contents,
  path,
  onWrite,
  onCancelWrite,
  scrollRef,
}: {
  contents: string;
  path?: string;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
}) {
  const appContext = use(AppContext);

  const { isSuccess, data } = useQuery(configQueryOptions(appContext.configPath));

  const { mutateAsync } = useMutation(configMutationOptions(appContext.configPath));

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

export default function CodePanel({ path, format, active, config, onWrite, onCancelWrite }: Readonly<CodePanelProps>) {
  const ref = useRef<ScrollBoxRenderable>(null);

  const stringify = stringifiers[format];

  const contents = stringify(config);

  const filetype = filetypes[format];

  return (
    <>
      <scrollbox ref={ref}>
        <code content={contents} filetype={filetype} syntaxStyle={syntaxStyle} />
      </scrollbox>
      {active && (
        <CodePanelKeybinds
          scrollRef={ref}
          contents={contents}
          path={path}
          onWrite={onWrite}
          onCancelWrite={onCancelWrite}
        />
      )}
    </>
  );
}
