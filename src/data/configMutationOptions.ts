import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import writeFile from "~/lib/io/writeFile";
import resolveAbsolutePath from "~/lib/resolveAbsolutePath";
import type { FeoConfig } from "~/data/feoConfig";

const configMutationOptions = mutationOptions({
  mutationKey: ["write", "~/.config/feo/config.toml"],
  mutationFn: async (config: FeoConfig) =>
    await writeFile(resolveAbsolutePath("~/.config/feo/config.toml"), stringify(config)),
  onMutate: async (vars, context) => {
    await context.client.setQueryData(["~/.config/feo/config.toml"], vars);
  },
});

export default configMutationOptions;
