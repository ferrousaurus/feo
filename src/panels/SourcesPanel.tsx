import configQueryOptions from "#/data/configQueryOptions";
import type { Source } from "#/data/feoConfig";
import moveSourceDownMutationOptions from "#/data/moveSourceDownMutationOptions";
import moveSourceUpMutationOptions from "#/data/moveSourceUpMutationOptions";
import SourceComponent from "#/components/sources/Source";
import SourcesPanelKeybinds from "#/components/sources/SourcesPanelKeybinds";
import NewSourceInput from "#/components/sources/NewSourceInput";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export type SourcesPanelProps = {
  active: boolean;
  application: string;
  configPath: string;
  source?: Source;
  target: string;
  onNext?: () => void;
  onPrevious?: () => void;
  creating: boolean;
  onEnableCreate?: () => void;
  onDisableCreate?: () => void;
};

export default function SourcesPanel({
  active,
  application,
  configPath,
  source,
  target,
  onNext,
  onPrevious,
  creating,
  onEnableCreate,
  onDisableCreate,
}: Readonly<SourcesPanelProps>) {
  const [moving, setMoving] = useState<string | undefined>(undefined);

  const { data: sources } = useSuspenseQuery({
    ...configQueryOptions(configPath),
    select: (d) => d.configs[application]?.targets[target]?.sources ?? [],
  });

  const { mutateAsync: moveSourceUpAsync } = useMutation(moveSourceUpMutationOptions(configPath));
  const { mutateAsync: moveSourceDownAsync } = useMutation(moveSourceDownMutationOptions(configPath));

  return (
    <>
      {sources.map((s) => (
        <SourceComponent
          key={s.path}
          configPath={configPath}
          application={application}
          target={target}
          source={s}
          active={source?.path === s.path}
          enableKeybinds={active && source?.path === s.path && !creating}
          moving={moving === s.path}
        />
      ))}
      {creating && (
        <NewSourceInput
          app={application}
          configPath={configPath}
          target={target}
          onSubmit={() => {
            onDisableCreate?.();
          }}
          onCancel={() => {
            onDisableCreate?.();
          }}
        />
      )}
      {active && !creating && (
        <SourcesPanelKeybinds
          configPath={configPath}
          onNext={() => {
            if (moving !== undefined) {
              moveSourceDownAsync({ app: application, target, source: moving });
            } else {
              onNext?.();
            }
          }}
          onPrevious={() => {
            if (moving !== undefined) {
              moveSourceUpAsync({ app: application, target, source: moving });
            } else {
              onPrevious?.();
            }
          }}
          onNew={() => {
            if (moving === undefined) {
              onEnableCreate?.();
            }
          }}
          onMove={() => {
            setMoving((m) => (m === undefined ? source?.path : undefined));
          }}
          onCancel={() => {}}
          onConfirm={() => {
            setMoving((m) => (m === undefined ? source?.path : undefined));
          }}
        />
      )}
    </>
  );
}
