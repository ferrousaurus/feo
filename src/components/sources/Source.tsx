import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import Keybinds from "#/components/Keybinds";

import ActiveSource from "#/components/sources/ActiveSource";
import configQueryOptions from "#/data/configQueryOptions";
import deleteSourceMutationOptions from "#/data/deleteSourceMutationOptions";
import type { FeoSource as SourceData } from "#/data/feoConfig";
import sourceContentQueryOptions from "#/data/sourceContentQueryOptions";
import useTitle from "#/hooks/useTitle";

export type SourceProps = {
  configPath: string;
  application: string;
  target: string;
  source: SourceData;
  active: boolean;
  enableKeybinds: boolean;
  moving: boolean;
};

export default function Source({
  active,
  enableKeybinds,
  application,
  target,
  source,
  configPath,
  moving,
}: Readonly<SourceProps>) {
  const [deleting, setDeleting] = useState(false);
  const { mutateAsync } = useMutation(deleteSourceMutationOptions(configPath));

  const { isError } = useQuery(sourceContentQueryOptions(source));
  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const theme = config.settings.theme;

  const title = useTitle(source.path, 0.35, {
    buffer: 8,
    stringify: (title: string) => `┤${title}├`,
  });

  if (isError) {
    return (
      <box
        borderColor={active ? theme.warning : theme.error}
        borderStyle={moving ? "double" : undefined}
        title={title}
      />
    );
  }

  if (active) {
    const handleDelete = () => {
      setDeleting(true);
    };

    const handleCancel = () => {
      setDeleting(false);
    };

    const handleConfirm = () => {
      setDeleting((d) => {
        if (d) {
          void mutateAsync({ app: application, target, source: source.path });
        }
        return false;
      });
    };

    return (
      <>
        <box
          borderColor={deleting ? theme.error : theme.active}
          borderStyle={moving ? "double" : undefined}
          title={title}
        >
          <ActiveSource source={source} configPath={configPath} enableKeybinds={enableKeybinds} />
        </box>
        {enableKeybinds && (
          <Keybinds configPath={configPath} onCancel={handleCancel} onConfirm={handleConfirm} onDelete={handleDelete} />
        )}
      </>
    );
  }

  return <box borderColor={theme.inactive} title={title} />;
}
