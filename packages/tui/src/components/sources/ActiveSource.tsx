import deleteSourceMutationOptions from "#/data/deleteSourceMutationOptions";
import type { Source as SourceData } from "#/data/feoConfig";
import textFileQueryOptions from "#/data/textFileQueryOptions";
import syntaxStyle from "#/lib/syntaxStyle";
import ActiveSourceKeybinds from "#/components/sources/ActiveSourceKeybinds";
import filetypes from "feo-utils/config/filetypes";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import path from "node:path";
import { useRef, useState } from "react";
import { z } from "zod/mini";

export type ActiveSourceProps = {
  enableKeybinds: boolean;
  configPath: string;
  application: string;
  target: string;
  source: SourceData;
};

export default function ActiveSource({ enableKeybinds, configPath, application, target, source }: Readonly<ActiveSourceProps>) {
  const [deleting, setDeleting] = useState(false);

  const { ext } = path.parse(source.path);
  const validatedExt = z.enum([".jsonc", ".json", ".yaml", ".yml", ".toml"]).safeParse(ext);
  const format = validatedExt.success ? validatedExt.data : null;

  const { isPending, isError, error, data } = useQuery(textFileQueryOptions(source.path));
  const ref = useRef<ScrollBoxRenderable>(null);

  const { mutateAsync } = useMutation(deleteSourceMutationOptions(configPath));

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

  const handleDelete = () => {
    setDeleting(true);
  };

  const handleCancel = () => {
    setDeleting(false);
  };

  const handleConfirm = () => {
    setDeleting((d) => {
      if (d) {
        void mutateAsync({ app: application, target, source: source.path });
      }
      return false;
    });
  };

  return (
    <>
      <scrollbox ref={ref}>
        <line-number>
          <code
            wrapMode="none"
            content={data ?? ""}
            filetype={format === null ? "txt" : filetypes[format]}
            syntaxStyle={syntaxStyle}
          />
        </line-number>
      </scrollbox>
      {enableKeybinds && (
        <ActiveSourceKeybinds
          onDelete={() => {
            handleDelete();
          }}
          onCancel={() => {
            handleCancel();
          }}
          onConfirm={() => {
            handleConfirm();
          }}
          onUp={() => {
            ref.current?.scrollBy(-1);
          }}
          onDown={() => {
            ref.current?.scrollBy(1);
          }}
        />
      )}
    </>
  );
}