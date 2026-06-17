import VERSION from "#/lib/version";
import tui from "#/tui";
import { Command } from "@cliffy/command";
import execCommand from "#/commands/exec";
import configOption from "#/commands/options/config";

await new Command()
  .name("feo")
  .version(VERSION)
  .description("A configuration file manager")
  .globalOption(configOption.flags, configOption.desc, configOption.opts)
  .action(async (options) => {
    await tui({ configPath: options.config });
  })
  .command("exec", execCommand)
  .parse();
