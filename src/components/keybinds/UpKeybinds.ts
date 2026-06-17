import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type UpKeybinds = {
  configPath: string;
  onUp?: () => void;
};

export default function UpKeybinds({ configPath, onUp }: Readonly<UpKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.up.includes(key.name)) {
      onUp?.();
    }
  });

  return null;
}