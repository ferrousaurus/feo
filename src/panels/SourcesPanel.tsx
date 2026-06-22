import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import Keybinds from "#/components/Keybinds";
import NewSourceInput from "#/components/sources/NewSourceInput";
import Source from "#/components/sources/Source";
import configQueryOptions from "#/data/configQueryOptions";
import type { FeoSource } from "#/data/feoConfig";
import moveSourceDownMutationOptions from "#/data/moveSourceDownMutationOptions";
import moveSourceUpMutationOptions from "#/data/moveSourceUpMutationOptions";
import { sourceId } from "#/lib/source/identity";

export type SourcesPanelProps = {
  active: boolean;
  application: string;
  configPath: string;
  source?: FeoSource;
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

  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const sources = config.applications[application]?.targets[target]?.sources ?? [];

  const { mutateAsync: moveSourceUpAsync } = useMutation(moveSourceUpMutationOptions(configPath));
  const { mutateAsync: moveSourceDownAsync } = useMutation(moveSourceDownMutationOptions(configPath));

  return (
    <>
      {sources.map((s) => (
        <Source
          key={sourceId(s)}
          configPath={configPath}
          application={application}
          target={target}
          source={s}
          active={source !== undefined && sourceId(source) === sourceId(s)}
          enableKeybinds={active && source !== undefined && sourceId(source) === sourceId(s) && !creating}
          moving={moving === sourceId(s)}
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
        <Keybinds
          configPath={configPath}
          onNew={() => {
            if (moving === undefined) {
              onEnableCreate?.();
            }
          }}
          onMove={() => {
            setMoving((m) => (m === undefined ? (source !== undefined ? sourceId(source) : undefined) : undefined));
          }}
          onUp={() => {
            if (moving !== undefined) {
              moveSourceUpAsync({ app: application, target, source: moving });
            } else {
              onPrevious?.();
            }
          }}
          onDown={() => {
            if (moving !== undefined) {
              moveSourceDownAsync({ app: application, target, source: moving });
            } else {
              onNext?.();
            }
          }}
        />
      )}
    </>
  );
}
