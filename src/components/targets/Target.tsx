import configQueryOptions from "#/data/configQueryOptions";
import deleteTargetMutationOptions from "#/data/deleteTargetMutationOptions";
import TargetKeybinds from "#/components/targets/TargetKeybinds";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export type TargetProps = { active: boolean; configPath: string; target: string; application: string; enableKeybinds: boolean };

export function Target({ active, configPath, target, application, enableKeybinds }: Readonly<TargetProps>) {
  const [deleting, setDeleting] = useState(false);

  const { data: theme } = useSuspenseQuery({ ...configQueryOptions(configPath), select: (d) => d.settings.theme });

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
        <TargetKeybinds configPath={configPath} onDelete={handleDelete} onCancel={handleCancel} onConfirm={handleConfirm} />
      )}
    </>
  );
}