import { Command } from "@cliffy/command";

import configOption from "#/commands/options/config";
import spawn from "#/lib/proc/spawn";

const execCommand = new Command()
  .description("Execute a subcommand with symlinks")
  .option(configOption.flags, configOption.desc, configOption.opts)
  .arguments("[args...:string]")
  .action(async (_options, command, ...args) => {
    const proc = await spawn(command, args, {
      stdio: "inherit",
    });

    proc.once("close", (exitCode) => {
      process.exit(exitCode ?? 1);
    });
  });

export default execCommand;
