import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import writeFile from "#/lib/io/writeFile";
import { mutationOptions } from "@tanstack/react-query";
import npath from "node:path";
import { z } from "zod/mini";

const deleteTargetMutationOptions = (configPath: string) => {
  const filetype = filetypes[supportedExtensionSchema.parse(npath.parse(configPath).ext)];

  return mutationOptions({
    mutationKey: ["deleteTarget", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const queryData = z.string().parse(context.client.getQueryData([{ path: configPath }]));
      const parsed = filetype.parse(queryData);
      const config = feoConfigValidator.safeParse(parsed);
      if (!config.success) {
        throw config.error;
      }
      delete config.data.configs[vars.app]?.targets[vars.target];
      await writeFile(resolveAbsolutePath(configPath), filetype.stringify(config.data));

      return config.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath }], filetype.stringify(data));
    },
  });
};

export default deleteTargetMutationOptions;
