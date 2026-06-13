import { Command } from "@cliffy/command";
import { addDefaultParsers, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "#/components/App";
import queryClient from "#/stores/queryClient";
import VERSION from "#/lib/version";
import type { FeoConfig } from "./data/feoConfig";
import resolveAbsolutePath from "./lib/resolveAbsolutePath";
import feoConfigValidator from "./data/feoConfig";
import { createStateStore, StateStoreContext } from "./stores/state";
import keys from "./util/object/keys";
import readConfigFile from "./lib/readConfigFile";

export default async function tui({ configPath }: { configPath: string }) {
  const config = feoConfigValidator.safeParse(await readConfigFile(resolveAbsolutePath(configPath)));

  if (!config.success) {
    console.error(`${configPath} could not be opened as a configuration file.`);
    console.debug(config.error);
    process.exit(1);
  }

  addDefaultParsers([
    {
      filetype: "json",
      aliases: ["jsonc"],
      wasm: "https://github.com/tree-sitter/tree-sitter-json/releases/download/v0.24.8/tree-sitter-json.wasm",
      queries: {
        highlights: ["https://raw.githubusercontent.com/tree-sitter/tree-sitter-json/master/queries/highlights.scm"],
      },
    },
    {
      filetype: "yaml",
      wasm: "https://github.com/tree-sitter-grammars/tree-sitter-yaml/releases/download/v0.7.2/tree-sitter-yaml.wasm",
      queries: {
        highlights: [
          "https://raw.githubusercontent.com/tree-sitter-grammars/tree-sitter-yaml/master/queries/highlights.scm",
        ],
      },
    },
    {
      filetype: "toml",
      wasm: "https://github.com/tree-sitter-grammars/tree-sitter-toml/releases/download/v0.7.0/tree-sitter-toml.wasm",
      queries: {
        highlights: [
          "https://raw.githubusercontent.com/tree-sitter-grammars/tree-sitter-toml/master/queries/highlights.scm",
        ],
      },
    },
  ]);

  const renderer = await createCliRenderer();

  const app = keys(config.data.configs)[0];
  const appConfig = app !== undefined ? config.data.configs[app] : undefined;
  const targets = appConfig !== undefined ? keys(appConfig.targets) : undefined;
  const target = targets !== undefined ? targets[0] : undefined;
  const sources = app !== undefined && target !== undefined ? appConfig?.targets[target]?.sources : undefined;
  const source = sources !== undefined ? sources[sources.length - 1] : undefined;

  const store = createStateStore({
    app,
    target,
    source,
    configPath,
  });

  createRoot(renderer).render(
    <StateStoreContext value={store}>
      <QueryClientProvider client={queryClient}>
        <App configPath={configPath} />
      </QueryClientProvider>
    </StateStoreContext>,
  );
}
