import { addDefaultParsers, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

import Shell from "#/components/Shell";
import configQueryOptions from "#/data/configQueryOptions";
import feoConfigValidator from "#/data/feoConfig";
import readConfigFile from "#/lib/config/readConfigFile";
import resolvePath from "#/lib/fs/resolvePath";
import keys from "#/lib/object/keys";
import jsonHighlights from "#/parsers/json/highlights.scm" with { type: "file" };
import jsonWasm from "#/parsers/json/tree-sitter-json.wasm" with { type: "file" };
import tomlHighlights from "#/parsers/toml/highlights.scm" with { type: "file" };
import tomlWasm from "#/parsers/toml/tree-sitter-toml.wasm" with { type: "file" };
import yamlHighlights from "#/parsers/yaml/highlights.scm" with { type: "file" };
import yamlWasm from "#/parsers/yaml/tree-sitter-yaml.wasm" with { type: "file" };

import sourceContentQueryOptions from "./data/sourceContentQueryOptions";
import values from "./lib/object/values";

export type TuiProps = { configPath: string };

const tui = async ({ configPath }: Readonly<TuiProps>) => {
  const config = feoConfigValidator.safeParse(await readConfigFile(resolvePath(configPath)));

  if (!config.success) {
    console.error(`${configPath} could not be opened as a configuration file.`);
    console.debug(config.error);
    process.exit(1);
  }

  addDefaultParsers([
    {
      filetype: "json",
      wasm: jsonWasm,
      queries: { highlights: [jsonHighlights] },
    },
    {
      filetype: "yaml",
      wasm: yamlWasm,
      queries: { highlights: [yamlHighlights] },
    },
    {
      filetype: "toml",
      wasm: tomlWasm,
      queries: { highlights: [tomlHighlights] },
    },
  ]);

  const queryClient = new QueryClient();

  queryClient.setQueryData(configQueryOptions(configPath).queryKey, config.data);

  await Promise.allSettled(
    values(config.data.applications)
      .flatMap((c) => values(c.targets))
      .flatMap((t) => t.sources)
      .map((s) => {
        queryClient.prefetchQuery(sourceContentQueryOptions(s, configPath));
      }),
  );

  const application = keys(config.data.applications)[0];
  const appConfig = application !== undefined ? config.data.applications[application] : undefined;
  const targets = appConfig !== undefined ? keys(appConfig.targets) : undefined;
  const firstTarget = targets !== undefined ? targets[0] : undefined;
  const target = firstTarget !== undefined && typeof firstTarget === "string" ? firstTarget : undefined;
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
