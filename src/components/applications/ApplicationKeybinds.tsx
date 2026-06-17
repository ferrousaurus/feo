import CancelKeybinds from "../keybinds/CancelKeybinds";
import ConfirmKeybinds from "../keybinds/ConfirmKeybinds";
import DeleteKeybinds from "../keybinds/DeleteKeybinds";

export type ApplicationKeybindsProps = {
  configPath: string;
  onDelete?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function ApplicationKeybinds({ configPath, onDelete, onCancel, onConfirm }: Readonly<ApplicationKeybindsProps>) {
  return (
    <>
      <CancelKeybinds configPath={configPath} onCancel={onCancel} />
      <ConfirmKeybinds configPath={configPath} onConfirm={onConfirm} />
      <DeleteKeybinds configPath={configPath} onDelete={onDelete} />
    </>
  );
}