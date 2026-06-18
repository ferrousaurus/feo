import Keybinds from "#/components/keybinds/Keybinds";
import type { FeoSource as SourceData } from "#/data/feoConfig";
import sourceContentQueryOptions from "#/data/sourceContentQueryOptions";
import filetypes from "#/lib/config/filetypes";
import syntaxStyle from "#/lib/syntaxStyle";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useQuery } from "@tanstack/react-query";
import path from "node:path";
import { useRef } from "react";
import { z } from "zod/mini";

export type ActiveSourceProps = {
  enableKeybinds: boolean;
  configPath: string;
  source: SourceData;
};

export default function ActiveSource({ enableKeybinds, configPath, source }: Readonly<ActiveSourceProps>) {
  const { ext } = path.parse(source.path);
  const validatedExt = z.enum([".jsonc", ".json", ".yaml", ".yml", ".toml"]).safeParse(ext);
  const format = validatedExt.success ? validatedExt.data : null;

  const { isPending, isError, error, data, refetch } = useQuery(sourceContentQueryOptions(source));
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

  return (
    <>
      <scrollbox ref={ref}>
        <line-number>
          <code
            wrapMode="none"
            content={data ?? ""}
            filetype={format === null ? "txt" : filetypes[format].filetype}
            syntaxStyle={syntaxStyle}
          />
        </line-number>
      </scrollbox>
      {enableKeybinds && (
        <Keybinds
          configPath={configPath}
          onScrollUp={() => {
            ref.current?.scrollBy(-1);
          }}
          onScrollDown={() => {
            ref.current?.scrollBy(1);
          }}
          onRefresh={() => {
            void refetch();
          }}
        />
      )}
    </>
  );
}
