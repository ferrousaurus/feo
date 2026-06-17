import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type ScrollDownKeybinds = {
  configPath: string;
  onScrollDown?: () => void;
};

export default function ScrollDownKeybinds({ configPath, onScrollDown }: Readonly<ScrollDownKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.scrollDown.includes(key.name)) {
      onScrollDown?.();
    }
  });

  return null;
}