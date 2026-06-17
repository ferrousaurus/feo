import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type WriteKeybinds = {
  configPath: string;
  onWrite?: () => void;
};

export default function WriteKeybinds({ configPath, onWrite }: Readonly<WriteKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.write.includes(key.name)) {
      onWrite?.();
    }
  });

  return null;
}