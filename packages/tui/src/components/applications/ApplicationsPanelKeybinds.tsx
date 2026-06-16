import { useKeyboard } from "@opentui/react";

export type ApplicationsPanelKeybindsProps = {
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
};

export default function ApplicationsPanelKeybinds({ onNext, onPrevious, onNew }: Readonly<ApplicationsPanelKeybindsProps>) {
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