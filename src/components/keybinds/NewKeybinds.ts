import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type NewKeybinds = {
  configPath: string;
  onNew?: () => void;
};

export default function NewKeybinds({ configPath, onNew }: Readonly<NewKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.new.includes(key.name)) {
      onNew?.();
    }
  });

  return null;
}