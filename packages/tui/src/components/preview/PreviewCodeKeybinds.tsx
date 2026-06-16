import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { type RefObject } from "react";

type PreviewCodeKeybindsProps = {
  configPath: string;
  contents: string;
  path?: string;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
};

export default function PreviewCodeKeybinds({
  contents,
  path,
  onWrite,
  onCancelWrite,
  scrollRef,
}: Readonly<PreviewCodeKeybindsProps>) {
  useKeyboard((key) => {
    if (key.name === "]") {
      scrollRef.current?.scrollBy(1);
    }

    if (key.name === "[") {
      scrollRef.current?.scrollBy(-1);
    }

    if (key.name === "escape") {
      onCancelWrite?.();
    }

    if (path !== undefined && path !== "") {
      if (key.name === "w") {
        onWrite?.({ path, contents });
      }
    }
  });

  return null;
}