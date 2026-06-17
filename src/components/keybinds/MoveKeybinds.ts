import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type MoveKeybinds = {
  configPath: string;
  onMove?: () => void;
};

export default function MoveKeybinds({ configPath, onMove }: Readonly<MoveKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.move.includes(key.name)) {
      onMove?.();
    }
  });

  return null;
}