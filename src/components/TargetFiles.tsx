import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import Legend from "./Legend";

export type TargetFilesProps = {
  files: { path: string; active: boolean }[];
  active: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
};

export default function TargetFiles({ active, files, onPrevious, onNext }: Readonly<TargetFilesProps>) {
  useKeyboard((key) => {
    if (active) {
      if (key.name === "j" || key.name === "down") {
        if (key.shift) {
          // move item down
        } else {
          // down
          if (active) {
            onNext?.();
          }
        }
      }

      if (key.name === "k" || key.name === "up") {
        if (key.shift) {
          // move item up
        } else {
          onPrevious?.();
        }
      }
    }
  });

  return files.map((f) => (
    <text key={f.path} fg={f.active ? "cyan" : undefined}>
      {f.path}
    </text>
  ));
}
