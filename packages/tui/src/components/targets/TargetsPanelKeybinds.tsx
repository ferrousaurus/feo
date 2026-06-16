import { useKeyboard } from "@opentui/react";

type TargetPanelKeybindsProps = {
  onNext: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
};

export default function TargetsPanelKeybinds({ onNext, onPrevious, onNew }: Readonly<TargetPanelKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "j" || key.name === "down") {
      onNext?.();
    }

    if (key.name === "k" || key.name === "up") {
      onPrevious?.();
    }

    if (key.name === "n") {
      onNew?.();
    }
  });

  return null;
}