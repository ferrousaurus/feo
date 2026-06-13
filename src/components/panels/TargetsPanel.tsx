import addTargetMutationOptions from "#/data/addTargetMutationOptions";
import { useKeyboard } from "@opentui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function Target({ active, target }: { active: boolean; target: string }) {
  return (
    <text key={target} fg={active ? "cyan" : undefined}>
      {target}
    </text>
  );
}

function TargetsPanelKeybinds({
  onNext,
  onPrevious,
  onNew,
}: {
  onNext: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
}) {
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

function NewTargetInput({
  app,
  configPath,
  onSubmit,
  onCancel,
}: {
  app: string;
  configPath: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}) {
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
  targets: string[];
  target?: string;
  onNext?: () => void;
  onPrevious?: () => void;
};

export default function TargetsPanel({
  active,
  application,
  configPath,
  targets,
  target,
  onNext,
  onPrevious,
}: Readonly<TargetFilesProps>) {
  const [creating, setCreating] = useState(false);

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
            setCreating(false);
          }}
          onCancel={() => {
            setCreating(false);
          }}
        />
      )}
      {active && !creating && (
        <TargetsPanelKeybinds
          onNew={() => {
            setCreating(true);
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
