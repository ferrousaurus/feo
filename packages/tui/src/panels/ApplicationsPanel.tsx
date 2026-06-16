import configQueryOptions from "#/data/configQueryOptions";
import Application from "#/components/applications/Application";
import ApplicationsPanelKeybinds from "#/components/applications/ApplicationsPanelKeybinds";
import NewApplicationInput from "#/components/applications/NewApplicationInput";
import keys from "feo-utils/object/keys";
import { useSuspenseQuery } from "@tanstack/react-query";

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
  const { data: applications } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => keys(d.configs),
  });

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
          enableKeybinds={!creating}
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
        <ApplicationsPanelKeybinds onNext={handleNext} onPrevious={handlePrevious} onNew={handleNew} />
      )}
    </>
  );
}
