import UpKeybinds from "../keybinds/UpKeybinds";
import DownKeybinds from "../keybinds/DownKeybinds";
import NewKeybinds from "../keybinds/NewKeybinds";

export type ApplicationsPanelKeybindsProps = {
  configPath: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onNew?: () => void;
};

export default function ApplicationsPanelKeybinds({ configPath, onNext, onPrevious, onNew }: Readonly<ApplicationsPanelKeybindsProps>) {
  return (
    <>
      <NewKeybinds configPath={configPath} onNew={onNew} />
      <UpKeybinds configPath={configPath} onUp={onPrevious} />
      <DownKeybinds configPath={configPath} onDown={onNext} />
    </>
  );
}