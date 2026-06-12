import { stringify } from "@std/toml";
import { mutationOptions } from "@tanstack/react-query";
import writeFile from "../lib/io/writeFile";
import resolveAbsolutePath from "../lib/resolveAbsolutePath";
import type { FeoConfig } from "./feoConfig";
import feoConfigValidator from "./feoConfig";

function moveSourceDown(config: FeoConfig, vars: { app: string; target: string; source: string }) {
  const app = config.configs[vars.app];
  if (app === undefined) {
    throw new Error("The specified App does not exist");
  }
  const target = app.targets[vars.target];
  if (target === undefined) {
    throw new Error("The App does not include the specified Target");
  }
  const sources = target.sources;
  if (!sources.includes(vars.source)) {
    throw new Error("The App's Target's Sources does not include the specified source");
  }
  const index = sources.indexOf(vars.source);
  if (index === sources.length - 1) {
    throw new Error("The specified Source is already the App's Target's last source.");
  }
  return [...sources.slice(0, index), sources[index + 1], vars.source, ...sources.slice(index + 2)];
}

const moveSourceDownMutationOptions = mutationOptions({
  mutationKey: ["moveSourceDown", "~/.config/feo/config.toml"],
  mutationFn: async (vars: { app: string; target: string; source: string }, context) => {
    const config = feoConfigValidator.safeParse(context.client.getQueryData(["~/.config/feo/config.toml"]));
    if (!config.success) {
      throw config.error;
    }
    const newConfig = feoConfigValidator.safeParse({
      ...config.data,
      configs: {
        ...config.data.configs,
        [vars.app]: {
          ...config.data.configs[vars.app],
          targets: {
            ...(config.data.configs[vars.app]?.targets ?? {}),
            [vars.target]: {
              ...(config.data.configs[vars.target]?.targets[vars.target] ?? {}),
              sources: moveSourceDown(config.data, vars),
            },
          },
        },
      },
    });
    if (!newConfig.success) {
      throw new Error("There was an error applying the change.");
    }
    await writeFile(resolveAbsolutePath("~/.config/feo/config.toml"), stringify(newConfig.data));
    return newConfig.data;
  },
  onSuccess: async (data, _vars, _onMutateResult, context) => {
    await context.client.setQueryData(["~/.config/feo/config.toml"], data);
  },
});

export default moveSourceDownMutationOptions;
