import npath from "node:path";

import { deepMerge } from "@std/collections";
import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod/mini";

import feoConfigValidator, { type FeoConfig } from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import writeFile from "#/lib/io/writeFile";
import type { DeepPartial } from "#/lib/object/DeepPartial";

const patchConfigMutationOptions = (configPath: string) => {
  const filetype = filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)];

  return mutationOptions({
    mutationKey: ["patchConfig", configPath],
    mutationFn: async (vars: DeepPartial<FeoConfig>, context) => {
      const queryData = z.string().parse(context.client.getQueryData([{ path: configPath }]));
      const parsed = filetype.parse(queryData);
      const config = feoConfigValidator.safeParse(parsed);
      if (!config.success) {
        throw config.error;
      }
      const newConfig = feoConfigValidator.safeParse(deepMerge(config.data, vars));
      if (!newConfig.success) {
        throw new Error("There was an error applying the change.");
      }
      await writeFile(resolveAbsolutePath(configPath), filetype.stringify(newConfig.data));

      return newConfig.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], filetype.stringify(data));
    },
  });
};

export default patchConfigMutationOptions;
