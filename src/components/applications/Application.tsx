import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import Keybinds from "#/components/Keybinds";
import configQueryOptions from "#/data/configQueryOptions";
import deleteApplicationMutationOptions from "#/data/deleteAppMutationOptions";

export type ApplicationProps = {
  active: boolean;
  application: string;
  configPath: string;
  enableKeybinds: boolean;
};

export default function Application({ active, application, configPath, enableKeybinds }: Readonly<ApplicationProps>) {
  const [deleting, setDeleting] = useState(false);

  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const theme = config.settings.theme;

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
        <Keybinds configPath={configPath} onCancel={handleCancel} onConfirm={handleConfirm} onDelete={handleDelete} />
      )}
    </>
  );
}
