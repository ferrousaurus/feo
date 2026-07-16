import npath from "node:path";

import { deepMerge } from "@std/collections";
import { mutationOptions } from "@tanstack/react-query";

import type { FeoConfig } from "#/data/feoConfig";
import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import mediaTypes from "#/lib/config/mediaTypes";
import resolvePath from "#/lib/fs/resolvePath";
import writeFile from "#/lib/io/writeFile";
import { sourceId } from "#/lib/source/identity";

function moveSourceDown(config: FeoConfig, vars: { app: string; target: string; source: string }) {
  const app = config.applications[vars.app];
  if (app === undefined) {
    throw new Error("The specified App does not exist");
  }
  const target = app.targets[vars.target];
  if (target === undefined) {
    throw new Error("The App does not include the specified Target");
  }
  const sources = target.sources;
  if (!sources.some((s) => sourceId(s) === vars.source)) {
    throw new Error("The App's Target's Sources does not include the specified source");
  }
  const index = sources.findIndex((s) => sourceId(s) === vars.source);
  if (index === sources.length - 1) {
    throw new Error("The specified Source is already the App's Target's last source.");
  }
  return [...sources.slice(0, index), sources[index + 1], sources[index], ...sources.slice(index + 2)];
}

const moveSourceDownMutationOptions = (configPath: string) => {
  const mediaType = mediaTypes[filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)].mediaType];

  return mutationOptions({
    mutationKey: ["moveSourceDown", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const cached = context.client.getQueryData([{ path: configPath }]);
      if (cached === undefined) {
        throw new Error("Configuration not loaded.");
      }
      const config = feoConfigValidator.safeParse(cached);
      if (!config.success) {
        throw config.error;
      }
      try {
        const sources = moveSourceDown(config.data, vars);

        const newConfig = feoConfigValidator.safeParse(
          deepMerge(
            config.data,
            {
              applications: {
                [vars.app]: {
                  targets: {
                    [vars.target]: {
                      sources: sources,
                    },
                  },
                },
              },
            },
            { arrays: "replace" },
          ),
        );
        if (!newConfig.success) {
          throw new Error("There was an error applying the change.");
        }
        await writeFile(resolvePath(configPath), mediaType.stringify(newConfig.data));

        return newConfig.data;
      } catch (_e) {
        return config.data;
      }
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], data);
    },
  });
};

export default moveSourceDownMutationOptions;
