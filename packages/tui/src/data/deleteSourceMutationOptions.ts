import writeFile from "feo-utils/io/writeFile";
import resolveAbsolutePath from "feo-utils/fs/resolveAbsolutePath";
import { deepMerge } from "@std/collections";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import feoConfigValidator from "#/data/feoConfig";

const deleteSourceMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["deleteSource", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const config = feoConfigValidator.safeParse(context.client.getQueryData([{ path: configPath, kind: "object" }]));
      if (!config.success) {
        throw config.error;
      }
      const newConfig = feoConfigValidator.safeParse(
        deepMerge(config.data, {
          configs: {
            [vars.app]: {
              targets: {
                [vars.target]: {
                  sources: config.data.configs[vars.app]?.targets[vars.target]?.sources.filter(
                    (s) => s.path !== vars.source,
                  ),
                },
              },
            },
          },
        }),
      );
      if (!newConfig.success) {
        throw new Error("There was an error applying the change.");
      }
      await writeFile(resolveAbsolutePath(configPath), stringify(newConfig.data));
      return newConfig.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath, kind: "object" }], data);
    },
  });

export default deleteSourceMutationOptions;
