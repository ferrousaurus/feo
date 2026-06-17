import writeFile from "#/lib/io/writeFile";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import feoConfigValidator from "#/data/feoConfig";

const deleteTargetMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["deleteTarget", configPath],
    mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
      const config = feoConfigValidator.safeParse(context.client.getQueryData([{ path: configPath, kind: "object" }]));
      if (!config.success) {
        throw config.error;
      }
      delete config.data.configs[vars.app]?.targets[vars.target];
      await writeFile(resolveAbsolutePath(configPath), stringify(config.data));
      return config.data;
    },
    onSuccess: async (data, _vars, _onMutateResult, context) => {
      await context.client.setQueryData([{ path: configPath, kind: "object" }], data);
    },
  });

export default deleteTargetMutationOptions;
