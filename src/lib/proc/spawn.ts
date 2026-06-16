import proc from "node:child_process";

const spawn = (
  command: string,
  args: string[],
  options?: {
    stdio?: "inherit";
  },
) =>
  proc.spawn(command, args, {
    stdio: options?.stdio,
  });

export default spawn;
