import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useKeyboard } from "@opentui/react";
import Legend from "./Legend";
import SourceFiles from "./SourceFiles";
import TargetFiles from "./TargetFiles";
import Preview from "./Preview";
import PreviewLoader from "./PreviewLoader";
import SourceContentsLoader from "./SourceContentsLoader";
import keys from "../util/object/keys";
import Applications from "./Applications";
import entries from "../util/object/entries";
import type { FeoConfig } from "../data/feoConfig";
import nodePath from "node:path";
import resolveAbsolutePath from "../lib/resolveAbsolutePath";
import feoConfigValidator from "../data/feoConfig";

const COLOR = "cyan";

export type ShellProps = {
  config: FeoConfig;
  onChangeConfig?: (config: FeoConfig) => void;
};

const panels = ["apps", "targets", "preview", "sources", "source"] as const;

export default function Shell({ config, onChangeConfig }: Readonly<ShellProps>) {
  const [activePanel, setActivePanel] = useState<(typeof panels)[number]>("apps");

  const [activeApp, setActiveApp] = useState<string | undefined>(keys(config.configs)[0]);

  const [activeTarget, setActiveTarget] = useState<string | undefined>(() => {
    const app = keys(config.configs)[0];
    if (app === undefined) {
      return undefined;
    }
    const appConfig = config.configs[app];
    if (appConfig === undefined) {
      return undefined;
    }
    return keys(appConfig.targets)[0];
  });

  const [activeSource, setActiveSource] = useState<string | undefined>(() => {
    const app = keys(config.configs)[0];
    if (app === undefined) {
      return undefined;
    }
    const appConfig = config.configs[app];
    if (appConfig === undefined) {
      return undefined;
    }
    const target = keys(appConfig.targets)[0];
    if (target === undefined) {
      return undefined;
    }
    const targetConfig = appConfig.targets[target];
    if (targetConfig === undefined) {
      return undefined;
    }
    return targetConfig.sources[0];
  });

  const [previewFormat, setPreviewFormat] = useState<".json" | ".yaml" | ".toml">(".json");

  const [writing, setWriting] = useState<{ path: string; contents: string } | undefined>(undefined);

  const apps = useMemo(() => keys(config.configs), [config.configs]);

  const app = useMemo(
    () => (activeApp === undefined ? { targets: {} } : config.configs[activeApp]),
    [activeApp, config],
  );

  const target = useMemo(
    () => (activeApp === undefined || activeTarget === undefined ? { sources: [] } : app?.targets[activeTarget]),
    [activeApp, activeTarget, app],
  );

  const handleQuit = () => {
    process.exit(1);
  };

  const handleNextPanel = () => {
    setActivePanel((ap) => panels[panels.indexOf(ap) + 1] ?? panels[0]);
  };

  const handlePreviousPanel = () => {
    setActivePanel((ap) => panels[panels.indexOf(ap) - 1] ?? panels[panels.length - 1] ?? panels[0]);
  };

  const handleNextApplication = () => {
    setActiveApp((aa) => {
      const apps = keys(config.configs);
      if (aa === undefined) {
        return apps[0];
      }
      const i = apps.indexOf(aa);
      const next = apps[i + 1];
      setActiveTarget(() => {
        if (next === undefined) {
          return undefined;
        }
        const appConfig = config.configs[next];
        if (appConfig === undefined) {
          return undefined;
        }
        return keys(appConfig.targets)[0];
      });
      setActiveSource(() => {
        if (next === undefined) {
          return undefined;
        }
        const appConfig = config.configs[next];
        if (appConfig === undefined) {
          return undefined;
        }
        const target = keys(appConfig.targets)[0];
        if (target === undefined) {
          return undefined;
        }
        const targetConfig = appConfig.targets[target];
        if (targetConfig === undefined) {
          return undefined;
        }
        return targetConfig.sources[0];
      });
      return next ?? apps[0];
    });
  };

  const handlePreviousApplication = () => {
    setActiveApp((aa) => {
      const apps = keys(config.configs);
      if (aa === undefined) {
        return apps[0];
      }
      const i = apps.indexOf(aa);
      const prev = apps[i - 1];
      setActiveTarget(() => {
        if (prev === undefined) {
          return undefined;
        }
        const appConfig = config.configs[prev];
        if (appConfig === undefined) {
          return undefined;
        }
        return keys(appConfig.targets)[0];
      });
      setActiveSource(() => {
        if (prev === undefined) {
          return undefined;
        }
        const appConfig = config.configs[prev];
        if (appConfig === undefined) {
          return undefined;
        }
        const target = keys(appConfig.targets)[0];
        if (target === undefined) {
          return undefined;
        }
        const targetConfig = appConfig.targets[target];
        if (targetConfig === undefined) {
          return undefined;
        }
        return targetConfig.sources[0];
      });
      return prev ?? apps[apps.length - 1];
    });
  };

  const handleNextTarget = () => {
    setActiveTarget((at) => {
      if (activeApp === undefined) {
        return undefined;
      }
      const app = config.configs[activeApp];
      if (app === undefined) {
        return undefined;
      }
      const targets = keys(app.targets);
      if (at === undefined) {
        return targets.length === 0 ? undefined : targets[0];
      }
      const i = targets.indexOf(at);
      const nextI = i + 1;
      if (nextI > targets.length - 1) {
        return targets.length === 0 ? undefined : targets[0];
      }
      const next = targets[nextI];
      if (next === undefined) {
        return targets.length === 0 ? undefined : targets[0];
      }
      setActiveSource(() => {
        if (next === undefined) {
          return undefined;
        }
        if (activeApp === undefined) {
          return undefined;
        }
        const app = config.configs[activeApp];
        if (app === undefined) {
          return undefined;
        }
        const targetConfig = app.targets[next];
        if (targetConfig === undefined) {
          return undefined;
        }
        return targetConfig.sources[0];
      });
      return next;
    });
  };

  const handlePreviousTarget = () => {
    setActiveTarget((at) => {
      if (activeApp === undefined) {
        return undefined;
      }
      const app = config.configs[activeApp];
      if (app === undefined) {
        return undefined;
      }
      const targets = keys(app.targets);
      if (at === undefined) {
        return targets.length === 0 ? undefined : targets[0];
      }
      const i = targets.indexOf(at);
      const nextI = i - 1;
      if (nextI < 0) {
        return targets.length === 0 ? undefined : targets[0];
      }
      const prev = targets[nextI];
      if (prev === undefined) {
        return targets.length === 0 ? undefined : targets[0];
      }
      setActiveSource(() => {
        if (prev === undefined) {
          return undefined;
        }
        if (activeApp === undefined) {
          return undefined;
        }
        const app = config.configs[activeApp];
        if (app === undefined) {
          return undefined;
        }
        const targetConfig = app.targets[prev];
        if (targetConfig === undefined) {
          return undefined;
        }
        return targetConfig.sources[0];
      });
      return prev;
    });
  };

  const handleNextSource = () => {
    setActiveSource((ac) => {
      if (activeApp === undefined) {
        return undefined;
      }
      const app = config.configs[activeApp];
      if (app === undefined) {
        return undefined;
      }
      if (activeTarget === undefined) {
        return undefined;
      }
      const targetConfig = app.targets[activeTarget];
      if (targetConfig === undefined) {
        return undefined;
      }
      const sources = targetConfig.sources;
      if (ac === undefined) {
        return sources.length === 0 ? undefined : sources[0];
      }
      const i = sources.indexOf(ac);
      const nextI = i + 1;
      if (nextI > sources.length - 1) {
        return sources.length === 0 ? undefined : sources[0];
      }
      return sources[nextI];
    });
  };

  const handlePreviousSource = () => {
    setActiveSource((ac) => {
      if (activeApp === undefined) {
        return undefined;
      }
      const app = config.configs[activeApp];
      if (app === undefined) {
        return undefined;
      }
      if (activeTarget === undefined) {
        return undefined;
      }
      const targetConfig = app.targets[activeTarget];
      if (targetConfig === undefined) {
        return undefined;
      }
      const sources = targetConfig.sources;
      if (ac === undefined) {
        return sources.length === 0 ? undefined : sources[0];
      }
      const i = sources.indexOf(ac);
      const prevI = i - 1;
      if (prevI < 0) {
        return sources.length === 0 ? undefined : sources[0];
      }
      return sources[prevI];
    });
  };

  const handleMoveNextSource = () => {
    if (activeApp !== undefined && activeTarget !== undefined && activeSource !== undefined) {
      const currentSources = config.configs[activeApp]?.targets[activeTarget]?.sources ?? [];
      const i = currentSources.indexOf(activeSource);
      if (i === -1 || i >= currentSources.length - 1) return;
      const newSources = [...currentSources];
      newSources[i] = newSources[i + 1]!;
      newSources[i + 1] = activeSource;

      const newConfig = feoConfigValidator.parse({
        ...config,
        configs: {
          ...config.configs,
          [activeApp]: {
            targets: {
              ...config.configs[activeApp]?.targets,
              [activeTarget]: {
                ...config.configs[activeApp]?.targets[activeTarget],
                sources: newSources,
              },
            },
          },
        },
      });

      onChangeConfig?.(newConfig);
    }
  };

  const handleMovePreviousSource = () => {
    if (activeApp !== undefined && activeTarget !== undefined && activeSource !== undefined) {
      const currentSources = config.configs[activeApp]?.targets[activeTarget]?.sources ?? [];
      const i = currentSources.indexOf(activeSource);
      if (i <= 0) return;
      const newSources = [...currentSources];
      newSources[i] = newSources[i - 1]!;
      newSources[i - 1] = activeSource;

      const newConfig = feoConfigValidator.parse({
        ...config,
        configs: {
          ...config.configs,
          [activeApp]: {
            targets: {
              ...config.configs[activeApp]?.targets,
              [activeTarget]: {
                ...config.configs[activeApp]?.targets[activeTarget],
                sources: newSources,
              },
            },
          },
        },
      });

      onChangeConfig?.(newConfig);
    }
  };

  const handleNextFormat = () => {
    setPreviewFormat((f) => (f === ".json" ? ".toml" : f === ".toml" ? ".yaml" : ".json"));
  };

  const handlePreviousFormat = () => {
    setPreviewFormat((f) => (f === ".json" ? ".yaml" : f === ".yaml" ? ".toml" : ".json"));
  };

  const handleScrollDownPreview = () => {};

  const handleScrollUpPreview = () => {};

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
      const file = Bun.file(path);
      new Promise(async () => {
        if (await file.exists()) {
          const currentFileContents = await file.text();
          await Bun.write(
            `${dir}/${name}.${Bun.hash(currentFileContents, 0).toString(16).padStart(16, "0")}.feo-bkup${previewFormat}`,
            currentFileContents,
          );
        }
        await Bun.write(`${dir}/${name}${previewFormat}`, w.contents);
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
            borderColor={activePanel === "apps" ? COLOR : undefined}
            borderStyle="single"
          >
            <Applications
              active={activePanel === "apps"}
              applications={apps.map((c) => ({
                name: c,
                active: activeApp === c,
              }))}
              onNext={handleNextApplication}
              onPrevious={handlePreviousApplication}
            />
          </box>
          <box
            title="Targets"
            height="25%"
            borderColor={activePanel === "targets" ? COLOR : undefined}
            borderStyle="single"
          >
            <TargetFiles
              files={keys(app?.targets ?? {}).map((target) => ({
                path: target,
                active: target === activeTarget,
              }))}
              active={activePanel === "targets"}
              onNext={handleNextTarget}
              onPrevious={handlePreviousTarget}
            />
          </box>
          <box
            title="Sources"
            height="50%"
            borderColor={activePanel === "sources" ? COLOR : undefined}
            borderStyle="single"
          >
            <SourceFiles
              active={activePanel === "sources"}
              onNext={handleNextSource}
              onPrevious={handlePreviousSource}
              files={
                target?.sources.map((source) => ({
                  path: source,
                  active: activeSource === source,
                })) ?? []
              }
              onMoveNext={handleMoveNextSource}
              onMovePrevious={handleMovePreviousSource}
            />
          </box>
        </box>
        <box flexGrow={1} width="50%">
          <box
            title="Preview"
            height="50%"
            borderColor={activePanel === "preview" ? (writing !== undefined ? "red" : COLOR) : undefined}
            borderStyle="single"
          >
            <PreviewLoader
              key="preview"
              path={activeTarget ?? ""}
              format={previewFormat}
              active={activePanel === "preview"}
              onNextFormat={handleNextFormat}
              onPreviousFormat={handlePreviousFormat}
              onScrollDown={handleScrollDownPreview}
              onScrollUp={handleScrollUpPreview}
              configs={target?.sources ?? []}
              onWrite={handleWrite}
              onCancelWrite={handleCancelWrite}
            />
          </box>
          <box
            title="Source Contents"
            height="50%"
            borderColor={activePanel === "source" ? COLOR : undefined}
            borderStyle="single"
          >
            <SourceContentsLoader path={activeSource ?? ""} format=".json" active={activePanel === "source"} />
          </box>
        </box>
      </box>
      <box height={2} width="100%">
        <Legend panel={activePanel} />
      </box>
    </box>
  );
}
