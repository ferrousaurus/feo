import npath from "node:path";

import { addDefaultParsers, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

import Shell from "#/components/Shell";
import configQueryOptions from "#/data/configQueryOptions";
import feoConfigValidator from "#/data/feoConfig";
import readConfigFile from "#/lib/config/readConfigFile";
import resolveAbsolutePath from "#/lib/fs/resolveAbsolutePath";
import keys from "#/lib/object/keys";

import sourceContentQueryOptions from "./data/sourceContentQueryOptions";
import filetypes, { supportedExtensionSchema } from "./lib/config/filetypes";
import values from "./lib/object/values";

export type TuiProps = { configPath: string };

const tui = async ({ configPath }: Readonly<TuiProps>) => {
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

  const queryClient = new QueryClient();

  const ext = supportedExtensionSchema.parse(npath.parse(configPath).ext);

  queryClient.setQueryData(configQueryOptions(configPath).queryKey, filetypes[ext].stringify(config.data));

  await Promise.allSettled(
    values(config.data.configs)
      .flatMap((c) => values(c.targets))
      .flatMap((t) => t.sources)
      .map((s) => {
        queryClient.prefetchQuery(sourceContentQueryOptions(s));
      }),
  );

  const application = keys(config.data.configs)[0];
  const appConfig = application !== undefined ? config.data.configs[application] : undefined;
  const targets = appConfig !== undefined ? keys(appConfig.targets) : undefined;
  const target = targets !== undefined ? targets[0] : undefined;
  const sources = application !== undefined && target !== undefined ? appConfig?.targets[target]?.sources : undefined;
  const source = sources !== undefined ? sources[0] : undefined;

  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });

  createRoot(renderer).render(
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <Shell configPath={configPath} initialApplication={application} initialTarget={target} initialSource={source} />
      </Suspense>
    </QueryClientProvider>,
  );
};

export default tui;
