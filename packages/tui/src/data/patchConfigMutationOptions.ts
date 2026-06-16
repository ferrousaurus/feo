import writeFile from "feo-utils/io/writeFile";
import resolveAbsolutePath from "feo-utils/fs/resolveAbsolutePath";
import type { DeepPartial } from "feo-utils/object/DeepPartial";
import { deepMerge } from "@std/collections";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import feoConfigValidator, { type FeoConfig } from "#/data/feoConfig";

const patchConfigMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["patchConfig", configPath],
    mutationFn: async (vars: DeepPartial<FeoConfig>, context) => {
      const config = feoConfigValidator.safeParse(context.client.getQueryData([{ path: configPath, kind: "object" }]));
      if (!config.success) {
        throw config.error;
      }
      const newConfig = feoConfigValidator.safeParse(deepMerge(config.data, vars));
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

export default patchConfigMutationOptions;
