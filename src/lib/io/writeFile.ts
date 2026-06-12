import getRuntime from "../getRuntime";

const writeFileNode = async (path: string, contents: string) => {
  const writeFile = await import("node:fs/promises").then((m) => m.writeFile);
  return writeFile(path, contents);
};

const writeFileBun = async (path: string, contents: string) => {
  Bun.write(path, contents);
};

const writeFileByRuntime = {
  Bun: writeFileBun,
  Deno: writeFileNode,
  Node: writeFileNode,
};

const writeFile = writeFileByRuntime[getRuntime()];

export default writeFile;
