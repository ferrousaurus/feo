import type { FeoConfig } from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import writeFile from "#/lib/io/writeFile";
import { mutationOptions } from "@tanstack/react-query";
import npath from "node:path";

const configMutationOptions = (configPath: string) => {
  const filetype = filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)];

  return mutationOptions({
    mutationKey: ["write", configPath],
    mutationFn: async (config: FeoConfig) => {
      await writeFile(resolveAbsolutePath(configPath), filetype.stringify(config));
    },
    onMutate: async (vars, context) => {
      await context.client.setQueryData([{ path: configPath }], filetype.stringify(vars));
    },
  });
};

export default configMutationOptions;
