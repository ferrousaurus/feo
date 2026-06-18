import { useSuspenseQuery } from "@tanstack/react-query";

import Keybinds from "#/components/Keybinds";

import NewTargetInput from "#/components/targets/NewTargetInput";
import { Target } from "#/components/targets/Target";
import configQueryOptions from "#/data/configQueryOptions";
import keys from "#/lib/object/keys";

export type TargetFilesProps = {
  active: boolean;
  application: string;
  configPath: string;
  target?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  creating: boolean;
  onEnableCreate?: () => void;
  onDisableCreate?: () => void;
};

export default function TargetsPanel({
  active,
  application,
  configPath,
  target,
  onNext,
  onPrevious,
  creating,
  onEnableCreate,
  onDisableCreate,
}: Readonly<TargetFilesProps>) {
  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const targetsData = config.configs[application]?.targets;
  const targets = targetsData === undefined ? [] : keys(targetsData);

  return (
    <>
      {targets.map((t) => (
        <Target
          key={t}
          target={t}
          configPath={configPath}
          active={target === t}
          application={application}
          enableKeybinds={active && target === t && !creating}
        />
      ))}
      {application !== undefined && creating && (
        <NewTargetInput
          app={application}
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
        <Keybinds
          configPath={configPath}
          onNew={() => {
            onEnableCreate?.();
          }}
          onUp={() => {
            onPrevious?.();
          }}
          onDown={() => {
            onNext?.();
          }}
        />
      )}
    </>
  );
}
