import UpKeybinds from "../keybinds/UpKeybinds";
import DownKeybinds from "../keybinds/DownKeybinds";
import NewKeybinds from "../keybinds/NewKeybinds";

export type TargetPanelKeybindsProps = {
  configPath: string;
  onNext: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
};

export default function TargetsPanelKeybinds({ configPath, onNext, onPrevious, onNew }: Readonly<TargetPanelKeybindsProps>) {
  return (
    <>
      <NewKeybinds configPath={configPath} onNew={onNew} />
      <UpKeybinds configPath={configPath} onUp={onPrevious} />
      <DownKeybinds configPath={configPath} onDown={onNext} />
    </>
  );
}