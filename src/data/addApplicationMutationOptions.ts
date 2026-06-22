import npath from "node:path";

import { deepMerge } from "@std/collections";
import { mutationOptions } from "@tanstack/react-query";

import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import writeFile from "#/lib/io/writeFile";
import keys from "#/lib/object/keys";

const addApplicationMutationOptions = (configPath: string) => {
  const filetype = filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)];

  return mutationOptions({
    mutationKey: ["addApplication", configPath],
    mutationFn: async (vars: { name: string }, context) => {
      const cached = context.client.getQueryData([{ path: configPath }]);
      if (cached === undefined) {
        throw new Error("Configuration not loaded.");
      }
      const config = feoConfigValidator.safeParse(cached);
      if (!config.success) {
        throw config.error;
      }
      if (keys(config.data.applications).includes(vars.name)) {
        throw new Error("The specified application already exists.");
      }
      const newConfig = feoConfigValidator.safeParse(
        deepMerge(config.data, {
          applications: {
            [vars.name]: {
              targets: {},
            },
          },
        }),
      );
      if (!newConfig.success) {
        throw new Error("There was an error applying the change.");
      }
      await writeFile(resolveAbsolutePath(configPath), filetype.stringify(newConfig.data));
      return newConfig.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], data);
    },
  });
};

export default addApplicationMutationOptions;
