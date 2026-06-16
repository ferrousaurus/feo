import type { FeoConfig } from "#/data/feoConfig";
import feoConfigValidator from "#/data/feoConfig";
import writeFile from "feo-utils/io/writeFile";
import resolveAbsolutePath from "feo-utils/fs/resolveAbsolutePath";
import { deepMerge } from "@std/collections";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";

function moveSourceUp(config: FeoConfig, vars: { app: string; target: string; source: string }) {
  const app = config.configs[vars.app];
  if (app === undefined) {
    throw new Error("The specified App does not exist");
  }
  const target = app.targets[vars.target];
  if (target === undefined) {
    throw new Error("The App does not include the specified Target");
  }
  const sources = target.sources;
  if (!sources.some((s) => s.path === vars.source)) {
    throw new Error("The App's Target's Sources does not include the specified source");
  }
  const index = sources.findIndex((s) => s.path === vars.source);
  if (index === 0) {
    throw new Error("The specified Source is already the App's Target's first source.");
  }
  return [...sources.slice(0, index - 1), sources[index], sources[index - 1], ...sources.slice(index + 1)];
}

const moveSourceUpMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["moveSourceUp", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const config = feoConfigValidator.safeParse(context.client.getQueryData([{ path: configPath, kind: "object" }]));
      if (!config.success) {
        throw config.error;
      }
      try {
        const sources = moveSourceUp(config.data, vars);
        const newConfig = feoConfigValidator.safeParse(
          deepMerge(
            config.data,
            {
              configs: {
                [vars.app]: {
                  targets: {
                    [vars.target]: {
                      sources,
                    },
                  },
                },
              },
            },
            { arrays: "replace" },
          ),
        );
        if (!newConfig.success) {
          throw new Error("There was an error applying the change.");
        }
        await writeFile(resolveAbsolutePath(configPath), stringify(newConfig.data));
        return newConfig.data;
      } catch (_e) {
        return config.data;
      }
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath, kind: "object" }], data);
    },
  });

export default moveSourceUpMutationOptions;
