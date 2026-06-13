import addApplicationMutationOptions from "#/data/addApplicationMutationOptions";
import deleteApplicationMutationOptions from "#/data/deleteAppMutationOptions";
import { useKeyboard } from "@opentui/react";
import { useMutation } from "@tanstack/react-query";
import { use, useState } from "react";
import { AppContext } from "../App";

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

function Application({ active, application }: { active: boolean; application: { name: string } }) {
  const { configPath } = use(AppContext);

  const [deleting, setDeleting] = useState(false);

  const { mutateAsync } = useMutation(deleteApplicationMutationOptions(configPath));

  const handleDelete = () => {
    setDeleting((d) => {
      if (!d) {
        return true;
      }
      void mutateAsync({ app: application.name });
      return false;
    });
  };

  const handleCancel = () => {
    setDeleting(false);
  };

  return (
    <>
      <text key={application.name} fg={active ? (deleting ? "red" : "cyan") : undefined}>
        {application.name}
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
  applications: { name: string }[];
  configPath: string;
  application?: string;
  onNext?: () => void;
  onPrevious?: () => void;
};

export default function ApplicationsPanel({
  active,
  applications,
  application,
  configPath,
  onNext,
  onPrevious,
}: Readonly<ApplicationsPanelProps>) {
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
        <Application key={a.name} active={application === a.name} application={a} />
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
