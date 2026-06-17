import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type CancelKeybinds = {
  configPath: string;
  onCancel?: () => void;
};

export default function CancelKeybinds({ configPath, onCancel }: Readonly<CancelKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.cancel.includes(key.name)) {
      onCancel?.();
    }
  });

  return null;
}
