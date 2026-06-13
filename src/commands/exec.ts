import { Command } from "@cliffy/command";
import nodeChildProcess from "node:child_process";
import configOption from "./options/config";

const execCommand = new Command()
  .description("Execute a subcommand with symlinks")
  .option(configOption.flags, configOption.desc, configOption.opts)
  .arguments("[args...:string]")
  .action(async (options, command, ...args) => {
    const result = nodeChildProcess.spawnSync(command, args, {
      stdio: "inherit",
    });

    if (result.error) {
      console.error(result.error.message);
      process.exit(1);
    }

    process.exit(result.status ?? 1);
  });

export default execCommand;
