import addApplicationMutationOptions from "#/data/addApplicationMutationOptions";
import configQueryOptions from "#/data/configQueryOptions";
import deleteApplicationMutationOptions from "#/data/deleteAppMutationOptions";
import keys from "#/util/object/keys";
import { useKeyboard } from "@opentui/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

type ApplicationKeybindsProps = {
  onDelete?: () => void;
  onCancel?: () => void;
};

function ApplicationKeybinds({ onDelete, onCancel }: Readonly<ApplicationKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "d") {
      onDelete?.();
    }
    if (key.name === "escape") {
      onCancel?.();
    }
  });

  return null;
}

type ApplicationProps = {
  active: boolean;
  application: string;
  configPath: string;
  enableKeybinds: boolean;
};

function Application({ active, application, configPath, enableKeybinds }: Readonly<ApplicationProps>) {
  const [deleting, setDeleting] = useState(false);

  const { mutateAsync } = useMutation(deleteApplicationMutationOptions(configPath));

  const handleDelete = () => {
    setDeleting((d) => {
      if (!d) {
        return true;
      }
      void mutateAsync({ app: application });
      return false;
    });
  };

  const handleCancel = () => {
    setDeleting(false);
  };

  return (
    <>
      <text key={application} fg={active ? (deleting ? "red" : "cyan") : undefined}>
        {application}
      </text>
      {active && enableKeybinds && <ApplicationKeybinds onDelete={handleDelete} onCancel={handleCancel} />}
    </>
  );
}

type ApplicationsPanelKeybindsProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
};

function ApplicationsPanelKeybinds({ onNext, onPrevious, onNew }: Readonly<ApplicationsPanelKeybindsProps>) {
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

type NewApplicationInputProps = { configPath: string; onSubmit?: () => void; onCancel?: () => void };

function NewApplicationInput({ configPath, onSubmit, onCancel }: Readonly<NewApplicationInputProps>) {
  const [name, setName] = useState("");

  const { mutateAsync } = useMutation(addApplicationMutationOptions(configPath));

  const handleSubmit = () => {
    mutateAsync({ name })
      .then(() => {
        onSubmit?.();
      })
      .catch(() => {
        onSubmit?.();
      });
  };

  const handleCancel = () => {
    onCancel?.();
  };

  useKeyboard((key) => {
    if (key.name === "escape") {
      handleCancel();
    }
  });

  return <input placeholder="New Application" focused onInput={setName} onSubmit={handleSubmit} />;
}

export type ApplicationsPanelProps = {
  active: boolean;
  configPath: string;
  application?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  creating: boolean;
  onEnableCreate?: () => void;
  onDisableCreate?: () => void;
};

export default function ApplicationsPanel({
  active,
  application,
  configPath,
  onNext,
  onPrevious,
  creating,
  onEnableCreate,
  onDisableCreate,
}: Readonly<ApplicationsPanelProps>) {
  const { data: applications } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => keys(d.configs),
  });

  const handleNext = () => {
    onNext?.();
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  const handleNew = () => {
    onEnableCreate?.();
  };

  return (
    <>
      {applications.map((a) => (
        <Application
          key={a}
          active={application === a}
          application={a}
          configPath={configPath}
          enableKeybinds={!creating}
        />
      ))}
      {creating && (
        <NewApplicationInput
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
        <ApplicationsPanelKeybinds onNext={handleNext} onPrevious={handlePrevious} onNew={handleNew} />
      )}
    </>
  );
}
