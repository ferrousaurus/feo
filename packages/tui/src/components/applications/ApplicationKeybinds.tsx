import { useKeyboard } from "@opentui/react";

type ApplicationKeybindsProps = {
  onDelete?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function ApplicationKeybinds({ onDelete, onCancel, onConfirm }: Readonly<ApplicationKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "d") {
      onDelete?.();
    }
    if (key.name === "escape") {
      onCancel?.();
    }

    if (key.name === "return") {
      onConfirm?.();
    }
  });

  return null;
}