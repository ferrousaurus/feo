import { useKeyboard } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import configQueryOptions from "#/data/configQueryOptions";

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

  useKeyboard((key) => {
    const keymap = data.settings.keymap;
    if (onCancel && keymap.cancel.includes(key.name)) onCancel();
    if (onConfirm && keymap.confirm.includes(key.name)) onConfirm();
    if (onDelete && keymap.delete.includes(key.name)) onDelete();
    if (onDown && keymap.down.includes(key.name)) onDown();
    if (onMove && keymap.move.includes(key.name)) onMove();
    if (onNew && keymap.new.includes(key.name)) onNew();
    if (onRefresh && keymap.refresh.includes(key.name)) onRefresh();
    if (onScrollDown && keymap.scrollDown.includes(key.name)) onScrollDown();
    if (onScrollUp && keymap.scrollUp.includes(key.name)) onScrollUp();
    if (onUp && keymap.up.includes(key.name)) onUp();
    if (onWrite && keymap.write.includes(key.name)) onWrite();
  });

  return null;
}
