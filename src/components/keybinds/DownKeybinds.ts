import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type DownKeybinds = {
  configPath: string;
  onDown?: () => void;
};

export default function DownKeybinds({ configPath, onDown }: Readonly<DownKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.down.includes(key.name)) {
      onDown?.();
    }
  });

  return null;
}