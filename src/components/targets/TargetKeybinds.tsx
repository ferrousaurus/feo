import CancelKeybinds from "../keybinds/CancelKeybinds";
import ConfirmKeybinds from "../keybinds/ConfirmKeybinds";
import DeleteKeybinds from "../keybinds/DeleteKeybinds";

export type TargetKeybindsProps = {
  configPath: string;
  onDelete?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function TargetKeybinds({ configPath, onDelete, onCancel, onConfirm }: Readonly<TargetKeybindsProps>) {
  return (
    <>
      <CancelKeybinds configPath={configPath} onCancel={onCancel} />
      <ConfirmKeybinds configPath={configPath} onConfirm={onConfirm} />
      <DeleteKeybinds configPath={configPath} onDelete={onDelete} />
    </>
  );
}