import npath from "node:path";

import { deepMerge } from "@std/collections";
import { mutationOptions } from "@tanstack/react-query";

import type { FeoSource } from "#/data/feoConfig";
import feoConfigValidator, { sourceValidator } from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import mediaTypes from "#/lib/config/mediaTypes";
import resolvePath from "#/lib/fs/resolvePath";
import writeFile from "#/lib/io/writeFile";

const addSourceMutationOptions = (configPath: string) => {
  const mediaType = mediaTypes[filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)].mediaType];

  return mutationOptions({
    mutationKey: ["addSource", configPath],
    mutationFn: async (vars: { application: string; target: string; source: string }, context) => {
      const cached = context.client.getQueryData([{ path: configPath }]);
      if (cached === undefined) {
        throw new Error("Configuration not loaded.");
      }
      const config = feoConfigValidator.safeParse(cached);
      if (!config.success) {
        throw config.error;
      }
      let source: FeoSource;
      try {
        const { protocol } = new URL(vars.source);
        source = sourceValidator.parse(
          protocol === "http:" || protocol === "https:" ? { url: vars.source } : { path: vars.source },
        );
      } catch {
        source = sourceValidator.parse({ path: vars.source });
      }
      const newConfig = feoConfigValidator.safeParse(
        deepMerge(config.data, {
          applications: {
            [vars.application]: {
              targets: {
                [vars.target]: { sources: [source] },
              },
            },
          },
        }),
      );
      if (!newConfig.success) {
        throw new Error("There was an error applying the change.");
      }
      await writeFile(resolvePath(configPath), mediaType.stringify(newConfig.data));
      return newConfig.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], data);
    },
  });
};

export default addSourceMutationOptions;
