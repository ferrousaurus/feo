import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import Keybinds from "#/components/keybinds/Keybinds";
import configQueryOptions from "#/data/configQueryOptions";
import deleteTargetMutationOptions from "#/data/deleteTargetMutationOptions";

export type TargetProps = {
  active: boolean;
  configPath: string;
  target: string;
  application: string;
  enableKeybinds: boolean;
};

export function Target({ active, configPath, target, application, enableKeybinds }: Readonly<TargetProps>) {
  const [deleting, setDeleting] = useState(false);

  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const theme = config.settings.theme;

  const { mutateAsync } = useMutation(deleteTargetMutationOptions(configPath));

  const handleDelete = () => {
    setDeleting(true);
  };

  const handleCancel = () => {
    setDeleting(false);
  };

  const handleConfirm = () => {
    setDeleting((d) => {
      if (d) {
        void mutateAsync({ app: application, target, source: "" });
      }
      return false;
    });
  };

  return (
    <>
      <text key={target} fg={active ? (deleting ? theme.error : theme.active) : theme.inactive}>
        {target}
      </text>
      {active && enableKeybinds && (
        <Keybinds configPath={configPath} onCancel={handleCancel} onConfirm={handleConfirm} onDelete={handleDelete} />
      )}
    </>
  );
}
