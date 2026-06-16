import { useKeyboard } from "@opentui/react";

export type ActiveSourceKeybindsProps = {
  onDelete?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onUp?: () => void;
  onDown?: () => void;
};

export default function ActiveSourceKeybinds({ onDelete, onCancel, onConfirm, onUp, onDown }: Readonly<ActiveSourceKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "d") {
      onDelete?.();
    }

    if (key.name === "escape") {
      onCancel?.();
    }

    if (key.name === "enter") {
      onConfirm?.();
    }

    if (key.name === "]") {
      onDown?.();
    }

    if (key.name === "[") {
      onUp?.();
    }
  });

  return null;
}