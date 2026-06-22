import npath from "node:path";

import { useKeyboard, useRenderer } from "@opentui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useReducer, useState } from "react";

import configQueryOptions from "#/data/configQueryOptions";
import type { FeoSource } from "#/data/feoConfig";
import feoConfigValidator from "#/data/feoConfig";
import sha from "#/lib/crypto/hash";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import readFile from "#/lib/io/readFile";
import writeFile from "#/lib/io/writeFile";
import keys from "#/lib/object/keys";
import { sourceId } from "#/lib/source/identity";
import ApplicationsPanel from "#/panels/ApplicationsPanel";
import Legend from "#/panels/LegendPanel";
import PreviewPanel from "#/panels/PreviewPanel";
import SourcesPanel from "#/panels/SourcesPanel";
import TargetsPanel from "#/panels/TargetsPanel";

import Panel from "./Panel";

export const panels = ["apps", "targets", "sources", "preview"] as const;

type ShellKeybindsProps = {
  onQuit?: () => void;
  onApplicationsPanel?: () => void;
  onTargetsPanel?: () => void;
  onSourcesPanel?: () => void;
  onPreviewPanel?: () => void;
};

function ShellKeybinds({
  onQuit,
  onApplicationsPanel,
  onTargetsPanel,
  onSourcesPanel,
  onPreviewPanel,
}: ShellKeybindsProps) {
  useKeyboard((key) => {
    if (key.name === "q") {
      onQuit?.();
    }

    if (key.name === "a") {
      onApplicationsPanel?.();
    }

    if (key.name === "t") {
      onTargetsPanel?.();
    }

    if (key.name === "s") {
      onSourcesPanel?.();
    }

    if (key.name === "p") {
      onPreviewPanel?.();
    }
  });

  return null;
}

type ShellState = {
  panel: (typeof panels)[number];
  application: string | undefined;
  target: string | undefined;
  source: FeoSource | undefined;
};

export type ShellProps = {
  configPath: string;
  initialApplication: string | undefined;
  initialTarget: string | undefined;
  initialSource: FeoSource | undefined;
};

export default function Shell({ configPath, initialApplication, initialTarget, initialSource }: Readonly<ShellProps>) {
  const queryClient = useQueryClient();

  const [{ panel, application, target, source }, dispatch] = useReducer(
    (p: ShellState, c: Partial<ShellState> | ((state: ShellState) => Partial<ShellState>)) => {
      if (typeof c === "function") {
        return { ...p, ...c(p) };
      }
      return { ...p, ...c };
    },
    {
      panel: "apps",
      application: initialApplication,
      target: initialTarget,
      source: initialSource,
    },
  );

  const [_writing, setWriting] = useState<{ path: string; contents: string } | undefined>(undefined);

  const [creating, setCreating] = useState<"application" | "target" | "source" | undefined>(undefined);

  const renderer = useRenderer();

  const handleQuit = () => {
    queryClient.unmount();
    renderer.destroy();
    process.exit(0);
  };

  const handleApplicationsPanel = () => {
    dispatch({ panel: "apps" });
  };

  const handleTargetsPanel = () => {
    dispatch({ panel: "targets" });
  };

  const handleSourcesPanel = () => {
    dispatch({ panel: "sources" });
  };

  const handlePreviewPanel = () => {
    dispatch({ panel: "preview" });
  };

  const handleNextApplication = () => {
    const data = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (data === undefined) {
      return;
    }
    const config = feoConfigValidator.parse(data);
    const apps = keys(config.applications);
    dispatch((s) => {
      if (s.application === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.applications[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        return {
          application: firstApp,
          target: firstTarget,
          source: firstTarget !== undefined && targets !== undefined ? targets[firstTarget]?.sources[0] : undefined,
        };
      }
      const i = apps.indexOf(s.application);
      if (i === -1) {
        return { application: s.application };
      }
      const next = apps[i + 1];
      if (next === undefined) {
        return { application: s.application };
      }
      const targets = config.applications[next]?.targets;
      if (targets === undefined) {
        return { application: next, target: undefined, source: undefined };
      }
      const firstTarget = keys(targets)[0];
      return {
        application: next,
        target: firstTarget,
        source: firstTarget === undefined ? undefined : targets[firstTarget]?.sources[0],
      };
    });
  };

  const handlePreviousApplication = () => {
    const data = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (data === undefined) {
      return;
    }
    const config = feoConfigValidator.parse(data);
    const apps = keys(config.applications);
    dispatch((s) => {
      if (s.application === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.applications[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        return {
          application: firstApp,
          target: firstTarget,
          source: firstTarget !== undefined && targets !== undefined ? targets[firstTarget]?.sources[0] : undefined,
        };
      }
      const i = apps.indexOf(s.application);
      if (i <= 0) {
        return { application: s.application };
      }
      const prev = apps[i - 1] ?? apps[apps.length - 1];
      if (prev === undefined) {
        return { application: undefined, target: undefined, source: undefined };
      }
      const targets = config.applications[prev]?.targets;
      if (targets === undefined) {
        return { application: prev, target: undefined, source: undefined };
      }
      const firstTarget = keys(targets)[0];
      return {
        application: prev,
        target: firstTarget,
        source: firstTarget === undefined ? undefined : targets[firstTarget]?.sources[0],
      };
    });
  };

  const handleNextTarget = () => {
    const data = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (data === undefined) {
      return;
    }
    const config = feoConfigValidator.parse(data);
    dispatch((s) => {
      if (s.application === undefined) {
        return { target: s.target };
      }
      const appConfig = config.applications[s.application];
      if (appConfig === undefined) {
        return { target: s.target };
      }
      const tgts = keys(appConfig.targets);
      if (s.target === undefined) {
        const firstTarget = tgts[0];
        return {
          target: firstTarget,
          source: firstTarget === undefined ? undefined : appConfig.targets[firstTarget]?.sources[0],
        };
      }
      const ni = tgts.indexOf(s.target);
      if (ni === -1) {
        return { target: s.target };
      }
      const next = tgts[ni + 1];
      if (next === undefined) {
        return { target: s.target };
      }
      return {
        target: next,
        source: appConfig.targets[next]?.sources[0],
      };
    });
  };

  const handlePreviousTarget = () => {
    const data = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (data === undefined) {
      return;
    }
    const config = feoConfigValidator.parse(data);
    dispatch((s) => {
      if (s.application === undefined) {
        return { target: s.target };
      }
      const appConfig = config.applications[s.application];
      if (appConfig === undefined) {
        return { target: s.target };
      }
      const tgts = keys(appConfig.targets);
      if (s.target === undefined) {
        const firstTarget = tgts[0];
        return {
          target: firstTarget,
          source: firstTarget === undefined ? undefined : appConfig.targets[firstTarget]?.sources[0],
        };
      }
      const pi = tgts.indexOf(s.target);
      if (pi <= 0) {
        return { target: s.target };
      }
      const previous = tgts[pi - 1] ?? tgts[tgts.length - 1];
      if (previous === undefined) {
        return { target: undefined, source: undefined };
      }
      return {
        target: previous,
        source: appConfig.targets[previous]?.sources[0],
      };
    });
  };

  const handleNextSource = () => {
    const data = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (data === undefined) {
      return;
    }
    const config = feoConfigValidator.parse(data);
    dispatch((s) => {
      if (s.application === undefined || s.target === undefined) {
        return { source: s.source };
      }
      const sources = config.applications[s.application]?.targets[s.target]?.sources;
      if (sources === undefined) {
        return { source: s.source };
      }
      if (s.source === undefined) {
        const firstSource = sources[0];
        if (firstSource === undefined) {
        }
        return { source: firstSource };
      }
      const i = sources.findIndex((src) => s.source !== undefined && sourceId(src) === sourceId(s.source));
      if (i === -1) {
        return { source: s.source };
      }
      const next = sources[i + 1];
      if (next === undefined) {
        return { source: s.source };
      }
      return { source: next };
    });
  };

  const handlePreviousSource = () => {
    const data = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (data === undefined) {
      return;
    }
    const config = feoConfigValidator.parse(data);
    dispatch((s) => {
      if (s.application === undefined || s.target === undefined) {
        return { source: s.source };
      }
      const sources = config.applications[s.application]?.targets[s.target]?.sources;
      if (sources === undefined) {
        return { source: s.source };
      }
      if (s.source === undefined) {
        return { source: sources[sources.length - 1] };
      }
      const i = sources.findIndex((src) => s.source !== undefined && sourceId(src) === sourceId(s.source));
      if (i === -1) {
        return { source: s.source };
      }
      const prev = sources[i - 1];
      if (prev === undefined) {
        return { source: s.source };
      }
      return { source: prev };
    });
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
      const { dir, ext, name } = npath.parse(path);
      void readFile(path)
        .then((f) => f.text())
        .then(async (currentFileContents) => {
          if (currentFileContents !== null) {
            await writeFile(`${dir}/${name}.${sha(currentFileContents)}.feo-bkup${ext}`, currentFileContents);
          }
          await writeFile(`${dir}/${name}${ext}`, w.contents);
        });
      return undefined;
    });
  };

  const handleCancelWrite = () => {
    setWriting(undefined);
  };

  return (
    <>
      <box>
        <box height="100%" width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
          <box flexGrow={1} width="30%">
            <Panel title="[A]pplications" height="50%" active={panel === "apps"} configPath={configPath}>
              <Suspense>
                <ApplicationsPanel
                  active={panel === "apps"}
                  configPath={configPath}
                  application={application}
                  onNext={handleNextApplication}
                  onPrevious={handlePreviousApplication}
                  creating={creating === "application"}
                  onEnableCreate={() => {
                    setCreating("application");
                  }}
                  onDisableCreate={() => {
                    setCreating(undefined);
                  }}
                />
              </Suspense>
            </Panel>
            <Panel title="[T]argets" height="50%" active={panel === "targets"} configPath={configPath}>
              <Suspense>
                {application !== undefined && (
                  <TargetsPanel
                    active={panel === "targets"}
                    configPath={configPath}
                    application={application}
                    target={target}
                    onNext={handleNextTarget}
                    onPrevious={handlePreviousTarget}
                    creating={creating === "target"}
                    onEnableCreate={() => {
                      setCreating("target");
                    }}
                    onDisableCreate={() => {
                      setCreating(undefined);
                    }}
                  />
                )}
              </Suspense>
            </Panel>
          </box>
          <Panel
            flexGrow={1}
            width="35%"
            title="[S]ources"
            height="100%"
            active={panel === "sources"}
            configPath={configPath}
          >
            <Suspense>
              {application !== undefined && target !== undefined && (
                <SourcesPanel
                  active={panel === "sources"}
                  configPath={configPath}
                  application={application}
                  target={target}
                  source={source}
                  onNext={handleNextSource}
                  onPrevious={handlePreviousSource}
                  creating={creating === "source"}
                  onEnableCreate={() => {
                    setCreating("source");
                  }}
                  onDisableCreate={() => {
                    setCreating(undefined);
                  }}
                />
              )}
            </Suspense>
          </Panel>
          <Panel
            flexGrow={1}
            width="35%"
            title="[P]review"
            height="100%"
            active={panel === "preview"}
            borderStyle="single"
            configPath={configPath}
          >
            <Suspense>
              <PreviewPanel
                configPath={configPath}
                active={panel === "preview"}
                application={application}
                target={target}
                onWrite={handleWrite}
                onCancelWrite={handleCancelWrite}
              />
            </Suspense>
          </Panel>
        </box>
        <box height={3} width="100%">
          <Legend panel={panel} />
        </box>
      </box>
      {!creating && (
        <ShellKeybinds
          onQuit={handleQuit}
          onApplicationsPanel={handleApplicationsPanel}
          onTargetsPanel={handleTargetsPanel}
          onSourcesPanel={handleSourcesPanel}
          onPreviewPanel={handlePreviewPanel}
        />
      )}
    </>
  );
}
