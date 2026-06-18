import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  output: {
    codeSplitting: false,
    file: "./dist/bundle.js",
    format: "esm",
    minify: true,
  },
  external: ["@opentui/core", /node:\w+/],
  tsconfig: "./tsconfig.json",
});
