import writeFile from "#/lib/io/writeFile";
import resolveAbsolutePath from "#/lib/resolveAbsolutePath";
import { deepMerge } from "@std/collections";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import feoConfigValidator from "./feoConfig";

const addTargetMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["addTarget", configPath],
    mutationFn: async (vars: { application: string; target: string }, context) => {
      const config = feoConfigValidator.safeParse(context.client.getQueryData([configPath]));
      if (!config.success) {
        throw config.error;
      }
      const newConfig = feoConfigValidator.safeParse(
        deepMerge(config.data, {
          configs: {
            [vars.application]: {
              targets: {
                [vars.target]: { sources: [] },
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

export default addTargetMutationOptions;
