import configQueryOptions from "#/data/configQueryOptions";
import deleteApplicationMutationOptions from "#/data/deleteAppMutationOptions";
import ApplicationKeybinds from "#/components/applications/ApplicationKeybinds";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export type ApplicationProps = {
  active: boolean;
  application: string;
  configPath: string;
  enableKeybinds: boolean;
};

export default function Application({ active, application, configPath, enableKeybinds }: Readonly<ApplicationProps>) {
  const [deleting, setDeleting] = useState(false);

  const { data: theme } = useSuspenseQuery({ ...configQueryOptions(configPath), select: (d) => d.settings.theme });

  const { mutateAsync } = useMutation(deleteApplicationMutationOptions(configPath));

  const handleDelete = () => {
    setDeleting(true);
  };

  const handleCancel = () => {
    setDeleting(false);
  };

  const handleConfirm = () => {
    setDeleting((d) => {
      if (d) {
        void mutateAsync({ app: application });
      }
      return false;
    });
  };

  return (
    <>
      <text key={application} fg={active ? (deleting ? theme.error : theme.active) : theme.inactive}>
        {application}
      </text>
      {active && enableKeybinds && (
        <ApplicationKeybinds configPath={configPath} onDelete={handleDelete} onCancel={handleCancel} onConfirm={handleConfirm} />
      )}
    </>
  );
}