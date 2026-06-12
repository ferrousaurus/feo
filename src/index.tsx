import { Command } from "@cliffy/command";
import { addDefaultParsers, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./components/App";
import queryClient from "./stores/queryClient";
import VERSION from "./lib/version";

await new Command()
  .name("feo")
  .version(VERSION)
  .description("A configuration file manager")
  .action(async () => {
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

    createRoot(renderer).render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  })
  .parse();
