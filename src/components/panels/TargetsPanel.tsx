import { useKeyboard } from "@opentui/react";
import { useShallow } from "zustand/shallow";
import { useStateStore } from "#/stores/state";

export type TargetFilesProps = {
  active: boolean;
  files: { path: string }[];
};

export function Target({ file }: { file: { path: string } }) {
  const active = useStateStore((s) => s.target === file.path);

  return (
    <text key={file.path} fg={active ? "cyan" : undefined}>
      {file.path}
    </text>
  );
}

function TargetsPanelKeybinds() {
  const { onNext, onPrevious } = useStateStore(
    useShallow((s) => ({
      onNext: s.nextTarget,
      onPrevious: s.previousTarget,
    })),
  );

  useKeyboard((key) => {
    if (key.name === "j" || key.name === "down") {
      if (key.shift) {
        // move item down
      } else {
        // down
        onNext?.();
      }
    }

    if (key.name === "k" || key.name === "up") {
      if (key.shift) {
        // move item up
      } else {
        onPrevious?.();
      }
    }
  });

  return null;
}

export default function TargetsPanel({ active, files }: Readonly<TargetFilesProps>) {
  return (
    <>
      {files.map((f) => (
        <Target key={f.path} file={f} />
      ))}
      {active && <TargetsPanelKeybinds />}
    </>
  );
}
