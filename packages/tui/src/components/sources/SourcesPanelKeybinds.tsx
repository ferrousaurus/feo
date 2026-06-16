import { useKeyboard } from "@opentui/react";

type SourcesPanelKeybindsProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
  onMove?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function SourcesPanelKeybinds({
  onNext,
  onPrevious,
  onNew,
  onMove,
  onConfirm,
  onCancel,
}: Readonly<SourcesPanelKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "k" || key.name === "up") {
      onNext?.();
    }

    if (key.name === "j" || key.name === "down") {
      onPrevious?.();
    }

    if (key.name === "n") {
      onNew?.();
    }

    if (key.name === "m") {
      onMove?.();
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