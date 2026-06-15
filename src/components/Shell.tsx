import ApplicationsPanel from "#/components/panels/ApplicationsPanel";
import Legend from "#/components/panels/LegendPanel";
import PreviewPanel from "#/components/panels/PreviewPanel";
import SourcesPanel from "#/components/panels/SourcesPanel";
import TargetsPanel from "#/components/panels/TargetsPanel";
import configQueryOptions from "#/data/configQueryOptions";
import sha from "#/lib/crypto/hash";
import readTextFile from "#/lib/io/readTextFile";
import writeFile from "#/lib/io/writeFile";
import resolveAbsolutePath from "#/lib/resolveAbsolutePath";
import keys from "#/util/object/keys";
import { useKeyboard } from "@opentui/react";
import { useQueryClient } from "@tanstack/react-query";
import nodePath from "node:path";
import { Suspense, useState } from "react";

const COLOR = "cyan";

const panels = ["apps", "targets", "sources", "preview"] as const;

const handleQuit = () => {
  process.exit(1);
};

export type ShellProps = {
  configPath: string;
  initialApplication: string | undefined;
  initialTarget: string | undefined;
  initialSource: string | undefined;
};

export default function Shell({ configPath, initialApplication, initialTarget, initialSource }: Readonly<ShellProps>) {
  const queryClient = useQueryClient();

  const [panel, setPanel] = useState<(typeof panels)[number]>("apps");
  const [application, setApplication] = useState<string | undefined>(initialApplication);
  const [target, setTarget] = useState<string | undefined>(initialTarget);
  const [source, setSource] = useState<string | undefined>(initialSource);

  const [writing, setWriting] = useState<{ path: string; contents: string } | undefined>(undefined);

  const [creating, setCreating] = useState<"application" | "target" | "source" | undefined>(undefined);

  const handlePreviousPanel = () => {
    setPanel((p) => panels[panels.indexOf(p) - 1] ?? panels[panels.length - 1] ?? panels[0]);
  };

  const handleNextPanel = () => {
    setPanel((p) => panels[panels.indexOf(p) + 1] ?? panels[0]);
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
      const next = apps[i + 1] ?? apps[0];
      if (next === undefined) {
        setTarget(undefined);
        setSource(undefined);
        return undefined;
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
      if (i === -1) {
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
      const next = targets[ni + 1] ?? targets[0];
      if (next === undefined) {
        setSource(undefined);
        return undefined;
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
      if (pi === -1) {
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
        return sources[0];
      }
      const i = sources.indexOf(currentSource);
      if (i === -1) {
        return currentSource;
      }
      return sources[i + 1] ?? sources[0];
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
      return sources[i - 1] ?? sources[sources.length - 1];
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
    if (creating === undefined) {
      if (key.name === "q") {
        handleQuit();
      }

      if (key.name === "o") {
        handlePreviousPanel();
      }

      if (key.name === "p") {
        handleNextPanel();
      }
    }
  });

  return (
    <box>
      <box height="100%" width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
        <box flexGrow={1} width="30%">
          <box
            title="Applications"
            height="50%"
            borderColor={panel === "apps" ? COLOR : undefined}
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
          <box title="Targets" height="50%" borderColor={panel === "targets" ? COLOR : undefined} borderStyle="single">
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
          title="Sources"
          height="100%"
          borderColor={panel === "sources" ? (writing !== undefined ? "red" : COLOR) : undefined}
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
          title="Preview"
          height="100%"
          borderColor={panel === "preview" ? COLOR : undefined}
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
      <box height={2} width="100%">
        <Legend panel={panel} />
      </box>
    </box>
  );
}
