import { useSuspenseQuery } from "@tanstack/react-query";

import Application from "#/components/applications/Application";
import NewApplicationInput from "#/components/applications/NewApplicationInput";
import Keybinds from "#/components/keybinds/Keybinds";
import configQueryOptions from "#/data/configQueryOptions";
import keys from "#/lib/object/keys";

export type ApplicationsPanelProps = {
  active: boolean;
  configPath: string;
  application?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  creating: boolean;
  onEnableCreate?: () => void;
  onDisableCreate?: () => void;
};

export default function ApplicationsPanel({
  active,
  application,
  configPath,
  onNext,
  onPrevious,
  creating,
  onEnableCreate,
  onDisableCreate,
}: Readonly<ApplicationsPanelProps>) {
  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const applications = keys(config.configs);

  const handleNext = () => {
    onNext?.();
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  const handleNew = () => {
    onEnableCreate?.();
  };

  return (
    <>
      {applications.map((a) => (
        <Application
          key={a}
          active={application === a}
          application={a}
          configPath={configPath}
          enableKeybinds={active && !creating}
        />
      ))}
      {creating && (
        <NewApplicationInput
          configPath={configPath}
          onSubmit={() => {
            onDisableCreate?.();
          }}
          onCancel={() => {
            onDisableCreate?.();
          }}
        />
      )}
      {active && !creating && (
        <Keybinds configPath={configPath} onNew={handleNew} onUp={handlePrevious} onDown={handleNext} />
      )}
    </>
  );
}
