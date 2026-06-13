import addSourceMutationOptions from "#/data/addSourceMutationOptions";
import moveSourceDownMutationOptions from "#/data/moveSourceDownMutationOptions";
import moveSourceUpMutationOptions from "#/data/moveSourceUpMutationOptions";
import readConfigFile from "#/lib/readConfigFile";
import { useKeyboard } from "@opentui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Source({ active, file }: { file: string; active: boolean }) {
  const { isError } = useQuery({
    queryKey: [file],
    queryFn: async () => await readConfigFile(file),
  });

  if (isError) {
    return (
      <text key={file} fg={active ? "orange" : "yellow"}>
        {file}
      </text>
    );
  }

  return (
    <text key={file} fg={active ? "cyan" : undefined}>
      {file}
    </text>
  );
}

function SourcesPanelKeybinds({
  application,
  configPath,
  source,
  target,
  onNext,
  onPrevious,
  onNew,
  onDelete,
}: {
  configPath: string;
  application: string;
  source?: string;
  target: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
  onDelete?: () => void;
}) {
  const { mutateAsync: moveSourceUpAsync } = useMutation(moveSourceUpMutationOptions(configPath));
  const { mutateAsync: moveSourceDownAsync } = useMutation(moveSourceDownMutationOptions(configPath));

  useKeyboard((key) => {
    if (key.name === "k" || key.name === "up") {
      if (key.shift) {
        if (application !== undefined && target !== undefined && source !== undefined) {
          moveSourceDownAsync?.({ app: application, target, source });
        }
      } else {
        onNext?.();
      }
    }

    if (key.name === "j" || key.name === "down") {
      if (key.shift) {
        if (application !== undefined && target !== undefined && source !== undefined) {
          moveSourceUpAsync?.({ app: application, target, source });
        }
      } else {
        onPrevious?.();
      }
    }

    if (key.name === "n") {
      onNew?.();
    }

    if (key.name === "d") {
      onDelete?.();
    }
  });

  return null;
}

function NewSourceInput({
  app,
  configPath,
  target,
  onSubmit,
  onCancel,
}: {
  app: string;
  configPath: string;
  target: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}) {
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
  sources: string[];
  source?: string;
  target: string;
  onNext?: () => void;
  onPrevious?: () => void;
};

export default function SourcesPanel({
  active,
  application,
  configPath,
  sources,
  source,
  target,
  onNext,
  onPrevious,
}: Readonly<SourcesPanelProps>) {
  const [creating, setCreating] = useState(false);

  return (
    <>
      {sources.map((s) => (
        <Source key={s} file={s} active={source === s} />
      ))}
      {application !== undefined && target !== undefined && creating && (
        <NewSourceInput
          app={application}
          configPath={configPath}
          target={target}
          onSubmit={() => {
            setCreating(false);
          }}
          onCancel={() => {
            setCreating(false);
          }}
        />
      )}
      {active && !creating && (
        <SourcesPanelKeybinds
          application={application}
          target={target}
          source={source}
          configPath={configPath}
          onNext={() => {}}
          onPrevious={() => {}}
          onNew={() => {
            setCreating(true);
          }}
          onDelete={() => {}}
        />
      )}
    </>
  );
}
