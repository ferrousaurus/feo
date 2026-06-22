import path from "node:path";

import type { ScrollBoxRenderable } from "@opentui/core";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

import Keybinds from "#/components/Keybinds";
import type { FeoSource as SourceData } from "#/data/feoConfig";
import sourceContentQueryOptions from "#/data/sourceContentQueryOptions";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import syntaxStyle from "#/lib/syntaxStyle";

export type ActiveSourceProps = {
  enableKeybinds: boolean;
  configPath: string;
  source: SourceData;
};

export default function ActiveSource({ enableKeybinds, configPath, source }: Readonly<ActiveSourceProps>) {
  const { isPending, isError, error, data } = useQuery(sourceContentQueryOptions(source));
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

  const { ext } = path.parse("path" in source ? source.path : "url" in source ? source.url : ".json");
  const validatedExt = supportedExtensionSchema.safeParse(ext);
  const format = validatedExt.success ? validatedExt.data : null;

  return (
    <>
      <scrollbox ref={ref}>
        <line-number>
          <code
            wrapMode="none"
            content={data === undefined ? "" : filetypes[format ?? ".json"].stringify(data)}
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
        />
      )}
    </>
  );
}
