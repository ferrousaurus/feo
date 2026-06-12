import { useKeyboard } from "@opentui/react";
import nodePath from "node:path";
import { useMemo, useState } from "react";
import type { FeoConfig } from "#/data/feoConfig";
import feoConfigValidator from "#/data/feoConfig";
import resolveAbsolutePath from "#/lib/resolveAbsolutePath";
import { useStateStore } from "#/stores/state";
import keys from "#/util/object/keys";
import ApplicationsPanel from "#/components/panels/ApplicationsPanel";
import Legend from "#/components/panels/LegendPanel";
import PreviewPanel from "#/components/panels/PreviewPanel";
import SourcePanel from "#/components/panels/SourcePanel";
import SourcesPanel from "#/components/panels/SourcesPanel";
import TargetsPanel from "#/components/panels/TargetsPanel";
import { useShallow } from "zustand/react/shallow";
import readTextFile from "#/lib/io/readTextFile";
import writeFile from "#/lib/io/writeFile";
import sha from "#/lib/crypto/hash";

const COLOR = "cyan";

export type ShellProps = {
  config: FeoConfig;
  onChangeConfig?: (config: FeoConfig) => void;
};

const panels = ["apps", "targets", "preview", "sources", "source"] as const;

export default function Shell({ config, onChangeConfig }: Readonly<ShellProps>) {
  const [panel, setPanel] = useState<(typeof panels)[number]>("apps");

  const handlePreviousPanel = () => {
    setPanel((p) => panels[panels.indexOf(p) - 1] ?? panels[panels.length - 1] ?? panels[0]);
  };

  const handleNextPanel = () => {
    setPanel((p) => panels[panels.indexOf(p) + 1] ?? panels[0]);
  };

  const { activeApp, activeTarget, activeSource } = useStateStore(
    useShallow((s) => ({
      activeApp: s.app,
      activeTarget: s.target,
      activeSource: s.source,
    })),
  );

  const [writing, setWriting] = useState<{ path: string; contents: string } | undefined>(undefined);

  const app = activeApp === undefined ? { targets: {} } : config.configs[activeApp];

  const target = activeApp === undefined || activeTarget === undefined ? { sources: [] } : app?.targets[activeTarget];
  const handleQuit = () => {
    process.exit(1);
  };

  const handleWrite = (opts: { path: string; contents: string }) => {
    setWriting((w) => {
      if (w === undefined) {
        return opts;
      }
      if (w.path !== opts.path) {
        return w; // TODO: Error messaging
      }
      if (w.contents !== opts.contents) {
        return w; // TODO: Error messaging
      }
      const path = resolveAbsolutePath(opts.path);
      const { dir, ext, name } = nodePath.parse(path);
      void readTextFile(path).then(async (currentFileContents) => {
        if (currentFileContents !== null) {
          await writeFile(
            `${dir}/${name}.${await sha(currentFileContents)}.feo-bkup${config.settings.previewFormat}`,
            currentFileContents,
          );
        }
        await writeFile(`${dir}/${name}${config.settings.previewFormat}`, w.contents);
      });
      return undefined;
    });
  };

  const handleCancelWrite = () => {
    setWriting(undefined);
  };

  useKeyboard((key) => {
    if (key.name === "q") {
      handleQuit();
    }

    if (key.name === "tab") {
      if (key.shift) {
        handlePreviousPanel();
      } else {
        handleNextPanel();
      }
    }
  });

  return (
    <box>
      <box height="100%" width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
        <box flexGrow={1} width="50%">
          <box
            title="Applications"
            height="25%"
            borderColor={panel === "apps" ? COLOR : undefined}
            borderStyle="single"
          >
            <ApplicationsPanel
              active={panel === "apps"}
              applications={keys(config.configs).map((c) => ({
                name: c,
                active: activeApp === c,
              }))}
            />
          </box>
          <box title="Targets" height="25%" borderColor={panel === "targets" ? COLOR : undefined} borderStyle="single">
            <TargetsPanel
              active={panel === "targets"}
              files={keys(app?.targets ?? {}).map((target) => ({
                path: target,
                active: target === activeTarget,
              }))}
            />
          </box>
          <box title="Sources" height="50%" borderColor={panel === "sources" ? COLOR : undefined} borderStyle="single">
            <SourcesPanel
              active={panel === "sources"}
              files={
                target?.sources.map((source) => ({
                  path: source,
                  active: activeSource === source,
                })) ?? []
              }
            />
          </box>
        </box>
        <box flexGrow={1} width="50%">
          <box
            title={`Preview (${config.settings.previewFormat})`}
            height="50%"
            borderColor={panel === "preview" ? (writing !== undefined ? "red" : COLOR) : undefined}
            borderStyle="single"
          >
            <PreviewPanel
              format={config.settings.previewFormat}
              active={panel === "preview"}
              key="preview"
              configs={target?.sources ?? []}
              onWrite={handleWrite}
              onCancelWrite={handleCancelWrite}
            />
          </box>
          <box
            title="Source Contents"
            height="50%"
            borderColor={panel === "source" ? COLOR : undefined}
            borderStyle="single"
          >
            <SourcePanel active={panel === "source"} />
          </box>
        </box>
      </box>
      <box height={2} width="100%">
        <Legend panel={panel} />
      </box>
    </box>
  );
}
