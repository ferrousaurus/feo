import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import configQueryOptions from "#/data/configQueryOptions";
import entries from "#/lib/object/entries";
export type KeybindsProps = {
  configPath: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onDelete?: () => void;
  onDown?: () => void;
  onMove?: () => void;
  onNew?: () => void;
  onRefresh?: () => void;
  onScrollDown?: () => void;
  onScrollUp?: () => void;
  onUp?: () => void;
  onWrite?: () => void;
};

export default function Keybinds({
  configPath,
  onCancel,
  onConfirm,
  onDelete,
  onDown,
  onMove,
  onNew,
  onRefresh,
  onScrollDown,
  onScrollUp,
  onUp,
  onWrite,
}: Readonly<KeybindsProps>) {
  const { data } = useSuspenseQuery(configQueryOptions(configPath));

  const handlerMap = {
    cancel: onCancel,
    confirm: onConfirm,
    delete: onDelete,
    down: onDown,
    move: onMove,
    new: onNew,
    refresh: onRefresh,
    scrollDown: onScrollDown,
    scrollUp: onScrollUp,
    up: onUp,
    write: onWrite,
  } as const;

  const binds = entries(data.settings.keymap)
    .map(([action, keys]) => [keys, handlerMap[action]] as const)
    .filter(([, handler]) => handler !== undefined);

  useKeyboard((key) => {
    for (const [, handler] of binds.filter(([keys]) => keys.includes(key.name))) {
      handler?.();
    }
  });

  return null;
}
