import npath from "node:path";

import { mutationOptions } from "@tanstack/react-query";

import type { FeoConfig } from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import mediaTypes from "#/lib/config/mediaTypes";
import resolvePath from "#/lib/fs/resolvePath";
import writeFile from "#/lib/io/writeFile";

const configMutationOptions = (configPath: string) => {
  const mediaType = mediaTypes[filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)].mediaType];

  return mutationOptions({
    mutationKey: ["write", configPath],
    mutationFn: async (config: FeoConfig) => {
      await writeFile(resolvePath(configPath), mediaType.stringify(config));
    },
    onMutate: async (vars, context) => {
      await context.client.setQueryData([{ path: configPath }], vars);
    },
  });
};

export default configMutationOptions;
