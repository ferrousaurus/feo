import addSourceMutationOptions from "#/data/addSourceMutationOptions";
import configQueryOptions from "#/data/configQueryOptions";
import deleteSourceMutationOptions from "#/data/deleteSourceMutationOptions";
import type { Source } from "#/data/feoConfig";
import moveSourceDownMutationOptions from "#/data/moveSourceDownMutationOptions";
import moveSourceUpMutationOptions from "#/data/moveSourceUpMutationOptions";
import textFileQueryOptions from "#/data/textFileQueryOptions";
import useTitle from "#/hooks/useTitle";
import COLORS from "#/lib/colors";
import filetypes from "feo-utils/config/filetypes";
import syntaxStyle from "#/lib/syntaxStyle";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import path from "node:path";
import { useRef, useState } from "react";
import { z } from "zod/mini";

type ActiveSourceKeybindsProps = {
  onDelete?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onUp?: () => void;
  onDown?: () => void;
};

function ActiveSourceKeybinds({ onDelete, onCancel, onConfirm, onUp, onDown }: Readonly<ActiveSourceKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "d") {
      onDelete?.();
    }

    if (key.name === "escape") {
      onCancel?.();
    }

    if (key.name === "enter") {
      onConfirm?.();
    }

    if (key.name === "]") {
      onDown?.();
    }

    if (key.name === "[") {
      onUp?.();
    }
  });

  return null;
}

type ActiveSourceProps = {
  enableKeybinds: boolean;
  configPath: string;
  application: string;
  target: string;
  source: Source;
};

function ActiveSource({ enableKeybinds, configPath, application, target, source }: Readonly<ActiveSourceProps>) {
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

type SourceProps = {
  configPath: string;
  application: string;
  target: string;
  source: Source;
  active: boolean;
  enableKeybinds: boolean;
  moving: boolean;
};

function Source({ active, enableKeybinds, application, target, source, configPath, moving }: Readonly<SourceProps>) {
  const { isError } = useQuery(textFileQueryOptions(source.path));
  const { data: theme } = useSuspenseQuery({ ...configQueryOptions(configPath), select: (d) => d.settings.theme });

  const title = useTitle(source.path, 0.35, {
    buffer: 8,
    stringify: (title: string) => `┤${title}├`,
  });

  if (isError) {
    return <box borderColor={active ? theme.warning : theme.error} title={title} />;
  }

  if (active) {
    return (
      <box borderColor={theme.active} borderStyle={moving ? "double" : undefined} title={title}>
        <ActiveSource
          application={application}
          target={target}
          source={source}
          configPath={configPath}
          enableKeybinds={enableKeybinds}
        />
      </box>
    );
  }

  return <box borderColor={theme.primary} title={title} />;
}

type SourcesPanelKeybindsProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
  onMove?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

function SourcesPanelKeybinds({
  onNext,
  onPrevious,
  onNew,
  onMove,
  onConfirm,
  onCancel,
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

    if (key.name === "m") {
      onMove?.();
    }

    if (key.name === "escape") {
      onCancel?.();
    }

    if (key.name === "return") {
      onConfirm?.();
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
  source?: Source;
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
    select: (d) => d.configs[application]?.targets[target]?.sources ?? [],
  });

  const { mutateAsync: moveSourceUpAsync } = useMutation(moveSourceUpMutationOptions(configPath));
  const { mutateAsync: moveSourceDownAsync } = useMutation(moveSourceDownMutationOptions(configPath));

  return (
    <>
      {sources.toReversed().map((s) => (
        <Source
          key={s.path}
          configPath={configPath}
          application={application}
          target={target}
          source={s}
          active={source?.path === s.path}
          enableKeybinds={active && source?.path === s.path && !creating}
          moving={moving === s.path}
        />
      ))}
      {creating && (
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
            if (moving === undefined) {
              onEnableCreate?.();
            }
          }}
          onMove={() => {
            setMoving((m) => (m === undefined ? source?.path : undefined));
          }}
          onCancel={() => {}}
          onConfirm={() => {
            setMoving((m) => (m === undefined ? source?.path : undefined));
          }}
        />
      )}
    </>
  );
}
