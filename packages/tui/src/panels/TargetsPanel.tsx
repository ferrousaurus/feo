import configQueryOptions from "#/data/configQueryOptions";
import { Target } from "#/components/targets/Target";
import TargetsPanelKeybinds from "#/components/targets/TargetsPanelKeybinds";
import NewTargetInput from "#/components/targets/NewTargetInput";
import keys from "feo-utils/object/keys";
import { useSuspenseQuery } from "@tanstack/react-query";

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
  const { data: targets } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => {
      const ts = d.configs[application]?.targets;
      if (ts === undefined) {
        return [];
      }
      return keys(ts);
    },
  });

  return (
    <>
      {targets.map((t) => (
        <Target key={t} target={t} configPath={configPath} active={target === t} />
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
        <TargetsPanelKeybinds
          onNew={() => {
            onEnableCreate?.();
          }}
          onNext={() => {
            onNext?.();
          }}
          onPrevious={() => {
            onPrevious?.();
          }}
        />
      )}
    </>
  );
}