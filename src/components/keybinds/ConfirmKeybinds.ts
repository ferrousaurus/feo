import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type ConfirmKeybinds = {
  configPath: string;
  onConfirm?: () => void;
};

export default function ConfirmKeybinds({ configPath, onConfirm }: Readonly<ConfirmKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.confirm.includes(key.name)) {
      onConfirm?.();
    }
  });

  return null;
}