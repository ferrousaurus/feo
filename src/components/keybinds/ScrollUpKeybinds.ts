import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type ScrollUpKeybinds = {
  configPath: string;
  onScrollUp?: () => void;
};

export default function ScrollUpKeybinds({ configPath, onScrollUp }: Readonly<ScrollUpKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.scrollUp.includes(key.name)) {
      onScrollUp?.();
    }
  });

  return null;
}