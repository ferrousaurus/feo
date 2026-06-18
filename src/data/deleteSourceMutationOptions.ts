import npath from "node:path";

import { deepMerge } from "@std/collections";
import { mutationOptions } from "@tanstack/react-query";
import { z } from "zod/mini";

import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import writeFile from "#/lib/io/writeFile";

const deleteSourceMutationOptions = (configPath: string) => {
  const filetype = filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)];

  return mutationOptions({
    mutationKey: ["deleteSource", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const queryData = z.string().parse(context.client.getQueryData([{ path: configPath }]));
      const parsed = filetype.parse(queryData);
      const config = feoConfigValidator.safeParse(parsed);
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
      await writeFile(resolveAbsolutePath(configPath), filetype.stringify(newConfig.data));
      return newConfig.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], filetype.stringify(data));
    },
  });
};

export default deleteSourceMutationOptions;
