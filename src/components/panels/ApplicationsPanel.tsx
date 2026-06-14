import addApplicationMutationOptions from "#/data/addApplicationMutationOptions";
import configQueryOptions from "#/data/configQueryOptions";
import deleteApplicationMutationOptions from "#/data/deleteAppMutationOptions";
import keys from "#/util/object/keys";
import { useKeyboard } from "@opentui/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

function ApplicationKeybinds({ onDelete, onCancel }: { onDelete?: () => void; onCancel?: () => void }) {
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

function Application({
  active,
  application,
  configPath,
}: {
  active: boolean;
  application: string;
  configPath: string;
}) {
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
      {active && <ApplicationKeybinds onDelete={handleDelete} onCancel={handleCancel} />}
    </>
  );
}

function ApplicationsPanelKeybinds({
  onNext,
  onPrevious,
  onNew,
}: {
  onNext?: () => void;
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

function NewApplicationInput({
  configPath,
  onSubmit,
  onCancel,
}: {
  configPath: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}) {
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
};

export default function ApplicationsPanel({
  active,
  application,
  configPath,
  onNext,
  onPrevious,
}: Readonly<ApplicationsPanelProps>) {
  const { data: applications } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => keys(d.configs),
  });

  const [creating, setCreating] = useState(false);

  const handleNext = () => {
    onNext?.();
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  const handleNew = () => {
    setCreating(true);
  };

  return (
    <>
      {applications.map((a) => (
        <Application key={a} active={application === a} application={a} configPath={configPath} />
      ))}
      {creating && (
        <NewApplicationInput
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
        <ApplicationsPanelKeybinds onNext={handleNext} onPrevious={handlePrevious} onNew={handleNew} />
      )}
    </>
  );
}
