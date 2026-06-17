import type { FeoConfig } from "#/data/feoConfig";
import writeFile from "#/lib/io/writeFile";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";

const configMutationOptions = (configPath: string) =>
  mutationOptions({
    mutationKey: ["write", configPath],
    mutationFn: async (config: FeoConfig) => await writeFile(resolveAbsolutePath(configPath), stringify(config)),
    onMutate: async (vars, context) => {
      await context.client.setQueryData([configPath], vars);
    },
  });

export default configMutationOptions;
