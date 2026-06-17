import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type DeleteKeybinds = {
  configPath: string;
  onDelete?: () => void;
};

export default function DeleteKeybinds({ configPath, onDelete }: Readonly<DeleteKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.delete.includes(key.name)) {
      onDelete?.();
    }
  });

  return null;
}