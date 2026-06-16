import ApplicationsPanel from "#/panels/ApplicationsPanel";
import Legend from "#/panels/LegendPanel";
import PreviewPanel from "#/panels/PreviewPanel";
import SourcesPanel from "#/panels/SourcesPanel";
import TargetsPanel from "#/panels/TargetsPanel";
import configQueryOptions from "#/data/configQueryOptions";
import type { Source } from "#/data/feoConfig";
import useTitle from "#/hooks/useTitle";
import sha from "feo-utils/crypto/hash";
import writeFile from "feo-utils/io/writeFile";
import readFile from "feo-utils/io/readFile";
import resolveAbsolutePath from "feo-utils/fs/resolveAbsolutePath";
import keys from "feo-utils/object/keys";
import { useKeyboard } from "@opentui/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import nodePath from "node:path";
import { Suspense, useState } from "react";

export const panels = ["apps", "targets", "sources", "preview"] as const;

const handleQuit = () => {
  process.exit(1);
};

function ShellKeybinds({
  onQuit,
  onApplicationsPanel,
  onTargetsPanel,
  onSourcesPanel,
  onPreviewPanel,
}: {
  onQuit?: () => void;
  onApplicationsPanel?: () => void;
  onTargetsPanel?: () => void;
  onSourcesPanel?: () => void;
  onPreviewPanel?: () => void;
}) {
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
  initialSource: Source | undefined;
};

export default function Shell({ configPath, initialApplication, initialTarget, initialSource }: Readonly<ShellProps>) {
  const queryClient = useQueryClient();

  const { data: theme } = useSuspenseQuery({ ...configQueryOptions(configPath), select: (d) => d.settings.theme });

  const [panel, setPanel] = useState<(typeof panels)[number]>("apps");
  const [application, setApplication] = useState<string | undefined>(initialApplication);
  const [target, setTarget] = useState<string | undefined>(initialTarget);
  const [source, setSource] = useState<Source | undefined>(initialSource);

  const [writing, setWriting] = useState<{ path: string; contents: string } | undefined>(undefined);

  const [creating, setCreating] = useState<"application" | "target" | "source" | undefined>(undefined);

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
    const config = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (config === undefined) {
      return;
    }
    const apps = keys(config.configs);
    setApplication((currentApp) => {
      if (currentApp === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.configs[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        setTarget(firstTarget);
        setSource(
          firstTarget !== undefined && targets !== undefined
            ? targets[firstTarget]?.sources[targets[firstTarget].sources.length - 1]
            : undefined,
        );
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
      setSource(
        firstTarget === undefined ? undefined : targets[firstTarget]?.sources[targets[firstTarget].sources.length - 1],
      );
      return next;
    });
  };

  const handlePreviousApplication = () => {
    const config = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (config === undefined) {
      return;
    }
    const apps = keys(config.configs);
    setApplication((currentApp) => {
      if (currentApp === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.configs[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        setTarget(firstTarget);
        setSource(
          firstTarget !== undefined && targets !== undefined
            ? targets[firstTarget]?.sources[targets[firstTarget].sources.length - 1]
            : undefined,
        );
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
      setSource(
        firstTarget === undefined ? undefined : targets[firstTarget]?.sources[targets[firstTarget].sources.length - 1],
      );
      return prev;
    });
  };

  const handleNextTarget = () => {
    const config = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (config === undefined) {
      return;
    }
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
          setSource(
            firstTarget === undefined
              ? undefined
              : appConfig.targets[firstTarget]?.sources[appConfig.targets[firstTarget].sources.length - 1],
          );
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
        setSource(appConfig.targets[next]?.sources[appConfig.targets[next].sources.length - 1]);
      }
      return next;
    });
  };

  const handlePreviousTarget = () => {
    const config = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (config === undefined) {
      return;
    }
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
        setSource(
          firstTarget === undefined
            ? undefined
            : appConfig.targets[firstTarget]?.sources[appConfig.targets[firstTarget].sources.length - 1],
        );
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
    const config = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (config === undefined) {
      return;
    }
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
      const i = sources.indexOf(currentSource);
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
    const config = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (config === undefined) {
      return;
    }
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
      const i = sources.indexOf(currentSource);
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
    const config = queryClient.getQueryData(configQueryOptions(configPath).queryKey);
    if (config === undefined) {
      return;
    }
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

  const stringifyTitle = (title: string) => `┤${title}├`;

  const applicationsTitle = useTitle("[A]pplications", 0.3, { stringify: stringifyTitle });
  const targetsTitle = useTitle("[T]argets", 0.3, { stringify: stringifyTitle });
  const sourcesTitle = useTitle("[S]ources", 0.35, { stringify: stringifyTitle });
  const previewTitle = useTitle("[P]review", 0.35, { stringify: stringifyTitle });

  return (
    <>
      <box>
        <box height="100%" width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
          <box flexGrow={1} width="30%">
            <box
              title={applicationsTitle}
              height="50%"
              borderColor={panel === "apps" ? theme.active : theme.inactive}
              borderStyle="single"
            >
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
            </box>
            <box
              title={targetsTitle}
              height="50%"
              borderColor={panel === "targets" ? theme.active : theme.inactive}
              borderStyle="single"
            >
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
            </box>
          </box>
          <box
            flexGrow={1}
            width="35%"
            title={sourcesTitle}
            height="100%"
            borderColor={panel === "sources" ? (writing !== undefined ? theme.error : theme.active) : theme.inactive}
            borderStyle="single"
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
          </box>
          <box
            flexGrow={1}
            width="35%"
            title={previewTitle}
            height="100%"
            borderColor={panel === "preview" ? (writing ? theme.error : theme.active) : theme.inactive}
            borderStyle="single"
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
          </box>
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
