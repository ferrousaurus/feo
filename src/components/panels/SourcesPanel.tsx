import { useKeyboard } from "@opentui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";
import readConfigFile from "~/lib/readConfigFile";
import { useStateStore } from "~/stores/state";
import configMutationOptions from "~/data/configMutationOptions";
import moveSourceDownMutationOptions from "~/data/moveSourceDownMutationOptions";
import moveSourceUpMutationOptions from "~/data/moveSourceUpMutationOptions";

export type SourcesPanelProps = {
  active: boolean;
  files: { path: string }[];
  onNew?: () => void;
};

function Source({ file }: { file: { path: string } }) {
  const active = useStateStore((s) => s.source === file.path);

  const { isError, data } = useQuery({
    queryKey: [file.path],
    queryFn: async () => await readConfigFile(file.path),
  });

  if (isError) {
    return (
      <text key={file.path} fg={active ? "red" : "orange"}>
        {file.path}
      </text>
    );
  }

  return (
    <text key={file.path} fg={active ? "cyan" : undefined}>
      {file.path}
    </text>
  );
}

function SourcesPanelKeybinds({ onNew }: { onNew?: () => void }) {
  const { onNext, onPrevious, app, target, source } = useStateStore(
    useShallow((s) => ({
      onNext: s.nextSource,
      onPrevious: s.previousSource,
      app: s.app,
      target: s.target,
      source: s.source,
    })),
  );

  const { mutateAsync: moveSourceUpAsync } = useMutation(moveSourceUpMutationOptions);
  const { mutateAsync: moveSourceDownAsync } = useMutation(moveSourceDownMutationOptions);

  useKeyboard((key) => {
    if (key.name === "j" || key.name === "down") {
      if (key.shift) {
        if (app !== undefined && target !== undefined && source !== undefined) {
          moveSourceDownAsync?.({ app, target, source });
        }
      } else {
        onNext?.();
      }
    }

    if (key.name === "k" || key.name === "up") {
      if (key.shift) {
        if (app !== undefined && target !== undefined && source !== undefined) {
          moveSourceUpAsync?.({ app, target, source });
        }
      } else {
        onPrevious?.();
      }
    }

    if (key.name === "n") {
      onNew?.();
    }
  });

  return null;
}

export default function SourcesPanel({ active, files, onNew }: Readonly<SourcesPanelProps>) {
  return (
    <>
      {files.map((f) => (
        <Source key={f.path} file={f} />
      ))}
      {active && <SourcesPanelKeybinds onNew={onNew} />}
    </>
  );
}
