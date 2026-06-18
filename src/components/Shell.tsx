import configQueryOptions from "#/data/configQueryOptions";
import type { FeoSource } from "#/data/feoConfig";
import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import sha from "#/lib/crypto/hash";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import readFile from "#/lib/io/readFile";
import writeFile from "#/lib/io/writeFile";
import keys from "#/lib/object/keys";
import ApplicationsPanel from "#/panels/ApplicationsPanel";
import Legend from "#/panels/LegendPanel";
import PreviewPanel from "#/panels/PreviewPanel";
import SourcesPanel from "#/panels/SourcesPanel";
import TargetsPanel from "#/panels/TargetsPanel";
import { useKeyboard, useRenderer } from "@opentui/react";
import { useQueryClient } from "@tanstack/react-query";
import npath from "node:path";
import { Suspense, use, useState } from "react";
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

export type ShellProps = {
  configPath: string;
  initialApplication: string | undefined;
  initialTarget: string | undefined;
  initialSource: FeoSource | undefined;
};

export default function Shell({ configPath, initialApplication, initialTarget, initialSource }: Readonly<ShellProps>) {
  const queryClient = useQueryClient();

  const [panel, setPanel] = useState<(typeof panels)[number]>("apps");
  const [application, setApplication] = useState<string | undefined>(initialApplication);
  const [target, setTarget] = useState<string | undefined>(initialTarget);
  const [source, setSource] = useState<FeoSource | undefined>(initialSource);

  const [_writing, setWriting] = useState<{ path: string; contents: string } | undefined>(undefined);

  const [creating, setCreating] = useState<"application" | "target" | "source" | undefined>(undefined);

  const renderer = useRenderer();

  const handleQuit = () => {
    queryClient.unmount();
    renderer.destroy();
    process.exit(0);
  };

  const handleApplicationsPanel = () => {
    setPanel("apps");
  };

  const handleTargetsPanel = () => {
    setPanel("targets");
  };

  const handleSourcesPanel = () => {
    setPanel("sources");
  };

  const handlePreviewPanel = () => {
    setPanel("preview");
  };

  const handleNextApplication = () => {
    const text = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (text === undefined) {
      return;
    }
    const ext = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = filetypes[ext].parse(text);
    const config = feoConfigValidator.parse(data);
    const apps = keys(config.configs);
    setApplication((currentApp) => {
      if (currentApp === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.configs[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        setTarget(firstTarget);
        setSource(firstTarget !== undefined && targets !== undefined ? targets[firstTarget]?.sources[0] : undefined);
        return firstApp;
      }
      const i = apps.indexOf(currentApp);
      if (i === -1) {
        return currentApp;
      }
      const next = apps[i + 1];
      if (next === undefined) {
        return currentApp;
      }
      const targets = config.configs[next]?.targets;
      if (targets === undefined) {
        setTarget(undefined);
        setSource(undefined);
        return next;
      }
      const firstTarget = keys(targets)[0];
      setTarget(firstTarget);
      setSource(firstTarget === undefined ? undefined : targets[firstTarget]?.sources[0]);
      return next;
    });
  };

  const handlePreviousApplication = () => {
    const text = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (text === undefined) {
      return;
    }
    const ext = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = filetypes[ext].parse(text);
    const config = feoConfigValidator.parse(data);
    const apps = keys(config.configs);
    setApplication((currentApp) => {
      if (currentApp === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.configs[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        setTarget(firstTarget);
        setSource(firstTarget !== undefined && targets !== undefined ? targets[firstTarget]?.sources[0] : undefined);
        return firstApp;
      }
      const i = apps.indexOf(currentApp);
      if (i <= 0) {
        return currentApp;
      }
      const prev = apps[i - 1] ?? apps[apps.length - 1];
      if (prev === undefined) {
        setTarget(undefined);
        setSource(undefined);
        return undefined;
      }
      const targets = config.configs[prev]?.targets;
      if (targets === undefined) {
        setTarget(undefined);
        setSource(undefined);
        return prev;
      }
      const firstTarget = keys(targets)[0];
      setTarget(firstTarget);
      setSource(firstTarget === undefined ? undefined : targets[firstTarget]?.sources[0]);
      return prev;
    });
  };

  const handleNextTarget = () => {
    const text = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (text === undefined) {
      return;
    }
    const ext = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = filetypes[ext].parse(text);
    const config = feoConfigValidator.parse(data);
    setTarget((currentTarget) => {
      if (application === undefined) {
        return currentTarget;
      }
      const appConfig = config.configs[application];
      if (appConfig === undefined) {
        return currentTarget;
      }
      const targets = keys(appConfig.targets);
      if (currentTarget === undefined) {
        const firstTarget = targets[0];
        if (target !== firstTarget) {
          setSource(firstTarget === undefined ? undefined : appConfig.targets[firstTarget]?.sources[0]);
        }
        return firstTarget;
      }
      const ni = targets.indexOf(currentTarget);
      if (ni === -1) {
        return currentTarget;
      }
      const next = targets[ni + 1];
      if (next === undefined) {
        return currentTarget;
      }
      if (target !== next) {
        setSource(appConfig.targets[next]?.sources[0]);
      }
      return next;
    });
  };

  const handlePreviousTarget = () => {
    const text = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (text === undefined) {
      return;
    }
    const ext = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = filetypes[ext].parse(text);
    const config = feoConfigValidator.parse(data);
    setTarget((currentTarget) => {
      if (application === undefined) {
        return currentTarget;
      }
      const appConfig = config.configs[application];
      if (appConfig === undefined) {
        return currentTarget;
      }
      const targets = keys(appConfig.targets);
      if (currentTarget === undefined) {
        const firstTarget = targets[0];
        setSource(firstTarget === undefined ? undefined : appConfig.targets[firstTarget]?.sources[0]);
        return firstTarget;
      }
      const pi = targets.indexOf(currentTarget);
      if (pi <= 0) {
        return currentTarget;
      }
      const previous = targets[pi - 1] ?? targets[targets.length - 1];
      if (previous === undefined) {
        setSource(undefined);
        return undefined;
      }
      if (target !== previous) {
        setSource(appConfig.targets[previous]?.sources[0]);
      }
      return previous;
    });
  };

  const handleNextSource = () => {
    const text = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (text === undefined) {
      return;
    }
    const ext = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = filetypes[ext].parse(text);
    const config = feoConfigValidator.parse(data);
    setSource((currentSource) => {
      if (application === undefined || target === undefined) {
        return currentSource;
      }
      const sources = config.configs[application]?.targets[target]?.sources;
      if (sources === undefined) {
        return currentSource;
      }
      if (currentSource === undefined) {
        const firstSource = sources[0];
        if (firstSource === undefined) {
        }
        return firstSource;
      }
      const i = sources.findIndex((s) => s.path === currentSource.path);
      if (i === -1) {
        return currentSource;
      }
      const next = sources[i + 1];
      if (next === undefined) {
        return currentSource;
      }
      return next;
    });
  };

  const handlePreviousSource = () => {
    const text = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (text === undefined) {
      return;
    }
    const ext = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = filetypes[ext].parse(text);
    const config = feoConfigValidator.parse(data);
    setSource((currentSource) => {
      if (application === undefined || target === undefined) {
        return currentSource;
      }
      const sources = config.configs[application]?.targets[target]?.sources;
      if (sources === undefined) {
        return currentSource;
      }
      if (currentSource === undefined) {
        return sources[sources.length - 1];
      }
      const i = sources.findIndex((s) => s.path === currentSource.path);
      if (i === -1) {
        return currentSource;
      }
      const prev = sources[i - 1];
      if (prev === undefined) {
        return currentSource;
      }
      return prev;
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
