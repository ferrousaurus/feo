import addTargetMutationOptions from "#/data/addTargetMutationOptions";
import configQueryOptions from "#/data/configQueryOptions";
import keys from "#/util/object/keys";
import { useKeyboard } from "@opentui/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import COLORS from "#/lib/colors";

type TargetProps = { active: boolean; target: string };

export function Target({ active, target }: Readonly<TargetProps>) {
  return (
    <text key={target} fg={active ? COLORS.active : COLORS.inactive}>
      {target}
    </text>
  );
}

type TargetPanelKeybindsProps = {
  onNext: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
};

function TargetsPanelKeybinds({ onNext, onPrevious, onNew }: Readonly<TargetPanelKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "j" || key.name === "down") {
      onNext?.();
    }

    if (key.name === "k" || key.name === "up") {
      onPrevious?.();
    }

    if (key.name === "n") {
      onNew?.();
    }
  });

  return null;
}

type NewTargetInputProps = {
  app: string;
  configPath: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

function NewTargetInput({ app, configPath, onSubmit, onCancel }: Readonly<NewTargetInputProps>) {
  const [name, setName] = useState("");

  const { mutateAsync } = useMutation(addTargetMutationOptions(configPath));

  useKeyboard((key) => {
    if (key.name === "escape") {
      onCancel?.();
    }
  });

  function handleSubmit() {
    mutateAsync({
      application: app,
      target: name,
    })
      .then(() => {
        onSubmit?.();
      })
      .catch(() => {
        onSubmit?.();
      });
  }

  return <input placeholder="New Target" focused onInput={setName} onSubmit={handleSubmit} />;
}

export type TargetFilesProps = {
  active: boolean;
  application: string;
  configPath: string;
  target?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  creating: boolean;
  onEnableCreate?: () => void;
  onDisableCreate?: () => void;
};

export default function TargetsPanel({
  active,
  application,
  configPath,
  target,
  onNext,
  onPrevious,
  creating,
  onEnableCreate,
  onDisableCreate,
}: Readonly<TargetFilesProps>) {
  const { data: targets } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => {
      const ts = d.configs[application]?.targets;
      if (ts === undefined) {
        return [];
      }
      return keys(ts);
    },
  });

  return (
    <>
      {targets.map((t) => (
        <Target key={t} target={t} active={target === t} />
      ))}
      {application !== undefined && creating && (
        <NewTargetInput
          app={application}
          configPath={configPath}
          onSubmit={() => {
            onDisableCreate?.();
          }}
          onCancel={() => {
            onDisableCreate?.();
          }}
        />
      )}
      {active && !creating && (
        <TargetsPanelKeybinds
          onNew={() => {
            onEnableCreate?.();
          }}
          onNext={() => {
            onNext?.();
          }}
          onPrevious={() => {
            onPrevious?.();
          }}
        />
      )}
    </>
  );
}
