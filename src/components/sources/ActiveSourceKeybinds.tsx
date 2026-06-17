import CancelKeybinds from "../keybinds/CancelKeybinds";
import ConfirmKeybinds from "../keybinds/ConfirmKeybinds";
import DeleteKeybinds from "../keybinds/DeleteKeybinds";
import RefreshKeybinds from "../keybinds/RefreshKeybinds";
import ScrollUpKeybinds from "../keybinds/ScrollUpKeybinds";
import ScrollDownKeybinds from "../keybinds/ScrollDownKeybinds";

export type ActiveSourceKeybindsProps = {
  configPath: string;
  onDelete?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onScrollUp?: () => void;
  onScrollDown?: () => void;
  onRefresh?: () => void;
};

export default function ActiveSourceKeybinds({
  configPath,
  onDelete,
  onCancel,
  onConfirm,
  onScrollUp,
  onScrollDown,
  onRefresh,
}: Readonly<ActiveSourceKeybindsProps>) {
  return (
    <>
      <CancelKeybinds configPath={configPath} onCancel={onCancel} />
      <ConfirmKeybinds configPath={configPath} onConfirm={onConfirm} />
      <DeleteKeybinds configPath={configPath} onDelete={onDelete} />
      <RefreshKeybinds configPath={configPath} onRefresh={onRefresh} />
      <ScrollUpKeybinds configPath={configPath} onScrollUp={onScrollUp} />
      <ScrollDownKeybinds configPath={configPath} onScrollDown={onScrollDown} />
    </>
  );
}