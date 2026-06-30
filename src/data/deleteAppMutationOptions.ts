import npath from "node:path";

import { mutationOptions } from "@tanstack/react-query";

import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import mediaTypes from "#/lib/config/mediaTypes";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import writeFile from "#/lib/io/writeFile";

const deleteApplicationMutationOptions = (configPath: string) => {
  const mediaType = mediaTypes[filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)].mediaType];

  return mutationOptions({
    mutationKey: ["deleteApplication", configPath],
    mutationFn: async (vars: { app: string }, context) => {
      const cached = context.client.getQueryData([{ path: configPath }]);
      if (cached === undefined) {
        throw new Error("Configuration not loaded.");
      }
      const config = feoConfigValidator.safeParse(cached);
      if (!config.success) {
        throw config.error;
      }
      delete config.data.applications[vars.app];
      const newConfig = feoConfigValidator.safeParse(config.data);
      if (!newConfig.success) {
        throw new Error("There was an error applying the change.");
      }
      await writeFile(resolveAbsolutePath(configPath), mediaType.stringify(newConfig.data));
      return newConfig.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], data);
    },
  });
};

export default deleteApplicationMutationOptions;
