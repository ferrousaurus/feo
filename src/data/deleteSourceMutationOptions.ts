import writeFile from "#/lib/io/writeFile";
import resolveAbsolutePath from "#/lib/resolveAbsolutePath";
import { deepMerge } from "@std/collections";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import feoConfigValidator from "./feoConfig";

const deleteSourceMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["deleteSource", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const config = feoConfigValidator.safeParse(context.client.getQueryData([configPath]));
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
                    (s) => s !== vars.source,
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
      await context.client.setQueryData([configPath], data);
    },
  });

export default deleteSourceMutationOptions;
