import { defineConfig } from "rolldown";
import { resolve } from "node:path";

export default defineConfig({
  input: "src/index.ts",
  output: {
    codeSplitting: false,
    file: "./dist/bundle.js",
    format: "esm",
  },
  external: ["@opentui/core", /node:\w+/],
  minify: "true",
  tsconfig: "./tsconfig.json",
});
