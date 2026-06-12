import UnsupportedRuntimeException from "#/util/error/UnsupportedRuntimeException";

export default function getRuntime() {
  if ("Bun" in globalThis) {
    return "Bun" as const;
  }
  if ("Deno" in globalThis) {
    return "Deno" as const;
  }
  if (typeof process !== "undefined" && process.release?.name === "node") {
    return "Node" as const;
  }
  throw new UnsupportedRuntimeException();
}
