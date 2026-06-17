import configQueryOptions from "#/data/configQueryOptions";
import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export type RefreshKeybinds = {
  configPath: string;
  onRefresh?: () => void;
};

export default function RefreshKeybinds({ configPath, onRefresh }: Readonly<RefreshKeybinds>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  useKeyboard((key) => {
    if (data.settings.keymap.refresh.includes(key.name)) {
      onRefresh?.();
    }
  });

  return null;
}