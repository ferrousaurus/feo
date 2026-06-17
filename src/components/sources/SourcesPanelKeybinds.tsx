import UpKeybinds from "../keybinds/UpKeybinds";
import DownKeybinds from "../keybinds/DownKeybinds";
import CancelKeybinds from "../keybinds/CancelKeybinds";
import ConfirmKeybinds from "../keybinds/ConfirmKeybinds";
import NewKeybinds from "../keybinds/NewKeybinds";
import MoveKeybinds from "../keybinds/MoveKeybinds";

export type SourcesPanelKeybindsProps = {
  configPath: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
  onMove?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function SourcesPanelKeybinds({
  configPath,
  onNext,
  onPrevious,
  onNew,
  onMove,
  onConfirm,
  onCancel,
}: Readonly<SourcesPanelKeybindsProps>) {
  return (
    <>
      <NewKeybinds configPath={configPath} onNew={onNew} />
      <CancelKeybinds configPath={configPath} onCancel={onCancel} />
      <ConfirmKeybinds configPath={configPath} onConfirm={onConfirm} />
      <MoveKeybinds configPath={configPath} onMove={onMove} />
      <UpKeybinds configPath={configPath} onUp={onPrevious} />
      <DownKeybinds configPath={configPath} onDown={onNext} />
    </>
  );
}