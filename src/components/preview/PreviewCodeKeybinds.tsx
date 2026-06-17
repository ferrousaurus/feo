import type { ScrollBoxRenderable } from "@opentui/core";
import CancelKeybinds from "../keybinds/CancelKeybinds";
import WriteKeybinds from "../keybinds/WriteKeybinds";
import ScrollUpKeybinds from "../keybinds/ScrollUpKeybinds";
import ScrollDownKeybinds from "../keybinds/ScrollDownKeybinds";
import { type RefObject } from "react";

export type PreviewCodeKeybindsProps = {
  configPath: string;
  contents: string;
  path?: string;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
};

export default function PreviewCodeKeybinds({
  configPath,
  contents,
  path,
  onWrite,
  onCancelWrite,
  scrollRef,
}: Readonly<PreviewCodeKeybindsProps>) {
  return (
    <>
      <CancelKeybinds configPath={configPath} onCancel={onCancelWrite} />
      <ScrollUpKeybinds configPath={configPath} onScrollUp={() => { scrollRef.current?.scrollBy(-1); }} />
      <ScrollDownKeybinds configPath={configPath} onScrollDown={() => { scrollRef.current?.scrollBy(1); }} />
      {path !== undefined && path !== "" && (
        <WriteKeybinds configPath={configPath} onWrite={() => { onWrite?.({ path, contents }); }} />
      )}
    </>
  );
}