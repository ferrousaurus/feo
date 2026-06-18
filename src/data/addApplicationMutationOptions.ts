import npath from "node:path";

import { deepMerge } from "@std/collections";
import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod/mini";

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
      const queryData = z.string().parse(context.client.getQueryData([{ path: configPath }]));
      const data = filetype.parse(queryData);
      const config = feoConfigValidator.safeParse(data);
      if (!config.success) {
        throw config.error;
      }
      if (keys(config.data.configs).includes(vars.name)) {
        throw new Error("The specified application already exists.");
      }
      const newConfig = feoConfigValidator.safeParse(
        deepMerge(config.data, {
          configs: {
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
      await context.client.setQueryData([{ path: configPath }], filetype.stringify(data));
    },
  });
};

export default addApplicationMutationOptions;
