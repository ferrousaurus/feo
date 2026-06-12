import { Command } from "@cliffy/command";
import { addDefaultParsers, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "#/components/App";
import queryClient from "#/stores/queryClient";
import VERSION from "#/lib/version";
import tui from "#/tui";

await new Command()
  .name("feo")
  .version(VERSION)
  .description("A configuration file manager")
  .option("-c, --config <config:string>", "The configuration file to load", {
    default: "${HOME}/.config/feo/config.toml",
  })
  .action(async (options) => {
    await tui({ configPath: options.config });
  })
  .parse();
