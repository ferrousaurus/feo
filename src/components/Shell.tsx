import ApplicationsPanel from "#/components/panels/ApplicationsPanel";
import Legend from "#/components/panels/LegendPanel";
import PreviewPanel from "#/components/panels/PreviewPanel";
import SourcePanel from "#/components/panels/SourcePanel";
import SourcesPanel from "#/components/panels/SourcesPanel";
import TargetsPanel from "#/components/panels/TargetsPanel";
import type { FeoConfig } from "#/data/feoConfig";
import sha from "#/lib/crypto/hash";
import readTextFile from "#/lib/io/readTextFile";
import writeFile from "#/lib/io/writeFile";
import resolveAbsolutePath from "#/lib/resolveAbsolutePath";
import { useStateStore } from "#/stores/state";
import keys from "#/util/object/keys";
import { useKeyboard } from "@opentui/react";
import nodePath from "node:path";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const COLOR = "cyan";

const panels = ["apps", "targets", "preview", "sources", "source"] as const;

export type ShellProps = {
  config: FeoConfig;
  configPath: string;
};

export default function Shell({ config, configPath }: Readonly<ShellProps>) {
  const [panel, setPanel] = useState<(typeof panels)[number]>("apps");

  const handlePreviousPanel = () => {
    setPanel((p) => panels[panels.indexOf(p) - 1] ?? panels[panels.length - 1] ?? panels[0]);
  };

  const handleNextPanel = () => {
    setPanel((p) => panels[panels.indexOf(p) + 1] ?? panels[0]);
  };

  const {
    activeApp,
    activeTarget,
    activeSource,
    nextApp,
    previousApp,
    nextSource,
    previousSource,
    nextTarget,
    previousTarget,
  } = useStateStore(
    useShallow((s) => ({
      activeApp: s.app,
      activeTarget: s.target,
      activeSource: s.source,
      nextApp: s.nextApp,
      previousApp: s.previousApp,
      nextSource: s.nextSource,
      previousSource: s.previousSource,
      nextTarget: s.nextTarget,
      previousTarget: s.previousTarget,
    })),
  );

  const [writing, setWriting] = useState<{ path: string; contents: string } | undefined>(undefined);

  const app = activeApp === undefined ? { targets: {} } : config.configs[activeApp];

  const target = activeApp === undefined || activeTarget === undefined ? { sources: [] } : app?.targets[activeTarget];
  const handleQuit = () => {
    process.exit(1);
  };

  const handleNextApplication = () => {
    nextApp();
  };

  const handlePreviousApplication = () => {
    previousApp();
  };

  const handleNextSource = () => {
    nextSource();
  };

  const handlePreviousSource = () => {
    previousSource();
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
              }))}
              application={activeApp}
              configPath={configPath}
              onNext={handleNextApplication}
              onPrevious={handlePreviousApplication}
            />
          </box>
          <box title="Targets" height="25%" borderColor={panel === "targets" ? COLOR : undefined} borderStyle="single">
            {activeApp !== undefined && (
              <TargetsPanel
                application={activeApp}
                configPath={configPath}
                target={activeTarget}
                active={panel === "targets"}
                targets={keys(app?.targets ?? {})}
                onNext={nextTarget}
                onPrevious={previousTarget}
              />
            )}
          </box>
          <box title="Sources" height="50%" borderColor={panel === "sources" ? COLOR : undefined} borderStyle="single">
            {activeApp !== undefined && activeTarget !== undefined && (
              <SourcesPanel
                active={panel === "sources"}
                application={activeApp}
                configPath={configPath}
                sources={target?.sources.toReversed() ?? []}
                source={activeSource}
                target={activeTarget}
                onNext={handleNextSource}
                onPrevious={handlePreviousSource}
              />
            )}
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
              target={activeTarget}
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
            <SourcePanel active={panel === "source"} source={activeSource} />
          </box>
        </box>
      </box>
      <box height={2} width="100%">
        <Legend panel={panel} />
      </box>
    </box>
  );
}
