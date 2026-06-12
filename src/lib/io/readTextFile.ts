import getRuntime from "../getRuntime";

const readTextFileNode = async (path: string) => {
  const fs = await import("node:fs/promises");
  try {
    await fs.access(path);
  } catch (e) {
    return null;
  }
  return await fs.readFile(path, "utf-8");
};

const readTextFileBun = async (path: string) => {
  const file = Bun.file(path);
  if (!file.exists()) {
    return null;
  }
  return await file.text();
};

const readTextFileByRuntime = {
  Bun: readTextFileBun,
  Deno: readTextFileNode,
  Node: readTextFileNode,
};

const readTextFile = readTextFileByRuntime[getRuntime()];

export default readTextFile;
