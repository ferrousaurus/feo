import addSourceMutationOptions from "#/data/addSourceMutationOptions";
import configQueryOptions from "#/data/configQueryOptions";
import fileQueryOptions from "#/data/fileQueryOptions";
import moveSourceDownMutationOptions from "#/data/moveSourceDownMutationOptions";
import moveSourceUpMutationOptions from "#/data/moveSourceUpMutationOptions";
import filetypes from "#/lib/filetypes";
import stringifiers from "#/lib/stringifiers";
import syntaxStyle from "#/lib/style/syntaxStyle";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import path from "node:path";
import { useRef, useState } from "react";
import { z } from "zod/mini";

type ActiveSourceKeybindsProps = { onUp?: () => void; onDown?: () => void };

function ActiveSourceKeybinds({ onUp, onDown }: Readonly<ActiveSourceKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "]") {
      onDown?.();
    }

    if (key.name === "[") {
      onUp?.();
    }
  });

  return null;
}

type ActiveSourceProps = { enableKeybinds: boolean; file: string };

function ActiveSource({ enableKeybinds, file }: Readonly<ActiveSourceProps>) {
  const { ext } = path.parse(file);
  const validatedExt = z.enum([".jsonc", ".json", ".yaml", ".yml", ".toml"]).safeParse(ext);
  const format = validatedExt.success ? validatedExt.data : null;

  const { isPending, isError, error, data: config } = useQuery(fileQueryOptions(file));
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
      {enableKeybinds && (
        <ActiveSourceKeybinds
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

type SourceProps = {
  file: string;
  active: boolean;
  enableKeybinds: boolean;
  moving: boolean;
};

function Source({ active, enableKeybinds, file, moving }: Readonly<SourceProps>) {
  const { isError } = useQuery(fileQueryOptions(file));

  if (isError) {
    return <box borderColor="red" title={file} />;
  }

  if (active) {
    return (
      <box borderColor="cyan" borderStyle={moving ? "double" : undefined} title={file}>
        <ActiveSource file={file} enableKeybinds={enableKeybinds} />
      </box>
    );
  }

  return <box borderColor="orange" title={file} />;
}

type SourcesPanelKeybindsProps = {
  configPath: string;
  application: string;
  source?: string;
  target: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
};

function SourcesPanelKeybinds({
  application,
  configPath,
  source,
  target,
  onNext,
  onPrevious,
  onNew,
  onDelete,
  onMove,
}: Readonly<SourcesPanelKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "k" || key.name === "up") {
      onNext?.();
    }

    if (key.name === "j" || key.name === "down") {
      onPrevious?.();
    }

    if (key.name === "n") {
      onNew?.();
    }

    if (key.name === "d") {
      onDelete?.();
    }

    if (key.name === "m") {
      onMove?.();
    }
  });

  return null;
}

type NewSourceInputProps = {
  app: string;
  configPath: string;
  target: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

function NewSourceInput({ app, configPath, target, onSubmit, onCancel }: Readonly<NewSourceInputProps>) {
  const [name, setName] = useState("");

  const { mutateAsync } = useMutation(addSourceMutationOptions(configPath));

  useKeyboard((key) => {
    if (key.name === "escape") {
      onCancel?.();
    }
  });

  function handleSubmit() {
    mutateAsync({
      application: app,
      target,
      source: name,
    })
      .then(() => {
        onSubmit?.();
      })
      .catch(() => {
        onSubmit?.();
      });
  }

  return <input placeholder="New Source" focused onInput={setName} onSubmit={handleSubmit} />;
}

export type SourcesPanelProps = {
  active: boolean;
  application: string;
  configPath: string;
  source?: string;
  target: string;
  onNext?: () => void;
  onPrevious?: () => void;
  creating: boolean;
  onEnableCreate?: () => void;
  onDisableCreate?: () => void;
};

export default function SourcesPanel({
  active,
  application,
  configPath,
  source,
  target,
  onNext,
  onPrevious,
  creating,
  onEnableCreate,
  onDisableCreate,
}: Readonly<SourcesPanelProps>) {
  const [moving, setMoving] = useState<string | undefined>(undefined);

  const { data: sources } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => {
      const ss = d.configs[application]?.targets[target]?.sources;
      if (ss === undefined) {
        return [];
      }
      return ss;
    },
  });

  const { mutateAsync: moveSourceUpAsync } = useMutation(moveSourceUpMutationOptions(configPath));
  const { mutateAsync: moveSourceDownAsync } = useMutation(moveSourceDownMutationOptions(configPath));

  return (
    <>
      {sources.toReversed().map((s) => (
        <Source
          key={s}
          file={s}
          active={source === s}
          enableKeybinds={active && source === s && !creating}
          moving={moving !== undefined}
        />
      ))}
      {application !== undefined && target !== undefined && creating && (
        <NewSourceInput
          app={application}
          configPath={configPath}
          target={target}
          onSubmit={() => {
            onDisableCreate?.();
          }}
          onCancel={() => {
            onDisableCreate?.();
          }}
        />
      )}
      {active && !creating && (
        <SourcesPanelKeybinds
          application={application}
          target={target}
          source={source}
          configPath={configPath}
          onNext={() => {
            if (moving !== undefined) {
              moveSourceDownAsync({ app: application, target, source: moving });
            } else {
              onNext?.();
            }
          }}
          onPrevious={() => {
            if (moving !== undefined) {
              moveSourceUpAsync({ app: application, target, source: moving });
            } else {
              onPrevious?.();
            }
          }}
          onNew={() => {
            onEnableCreate?.();
          }}
          onDelete={() => {}}
          onMove={() => {
            setMoving((m) => (m === undefined ? source : undefined));
          }}
        />
      )}
    </>
  );
}
