import getRuntime from "~/lib/getRuntime";

async function shaNode(str: string) {
  const crypto = await import("node:crypto");
  return crypto.createHash("sha256").update(str).digest("hex");
}

async function shaBun(str: string) {
  return Bun.hash(str, 0).toString(16).padStart(16, "0");
}

const shaByRuntime = {
  Bun: shaBun,
  Deno: shaNode,
  Node: shaNode,
};

const sha = shaByRuntime[getRuntime()];

export default sha;
