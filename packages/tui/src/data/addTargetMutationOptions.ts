import writeFile from "feo-utils/io/writeFile";
import resolveAbsolutePath from "feo-utils/fs/resolveAbsolutePath";
import { deepMerge } from "@std/collections";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import feoConfigValidator from "#/data/feoConfig";

const addTargetMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["addTarget", configPath],
    mutationFn: async (vars: { application: string; target: string }, context) => {
      const config = feoConfigValidator.safeParse(context.client.getQueryData([{ path: configPath, kind: "object" }]));
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
      await context.client.setQueryData([{ path: configPath, kind: "object" }], data);
    },
  });

export default addTargetMutationOptions;
