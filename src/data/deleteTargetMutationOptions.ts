import npath from "node:path";

import { mutationOptions } from "@tanstack/react-query";

import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import writeFile from "#/lib/io/writeFile";

const deleteTargetMutationOptions = (configPath: string) => {
  const filetype = filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)];

  return mutationOptions({
    mutationKey: ["deleteTarget", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const cached = context.client.getQueryData([{ path: configPath }]);
      if (cached === undefined) {
        throw new Error("Configuration not loaded.");
      }
      const config = feoConfigValidator.safeParse(cached);
      if (!config.success) {
        throw config.error;
      }
      delete config.data.applications[vars.app]?.targets[vars.target];
      await writeFile(resolveAbsolutePath(configPath), filetype.stringify(config.data));

      return config.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], data);
    },
  });
};

export default deleteTargetMutationOptions;
