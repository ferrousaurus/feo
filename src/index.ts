import npath from "node:path";
import { isDeepStrictEqual } from "node:util";

import { Command } from "@cliffy/command";
import { deepMerge } from "@std/collections";

import configOption from "#/commands/options/config";
import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import mediaTypes from "#/lib/config/mediaTypes";
import readFile from "#/lib/io/readFile";
import entries from "#/lib/object/entries";
import values from "#/lib/object/values";
import type { Serializable } from "#/lib/serialization/util";
import loadSourceContent from "#/lib/source/loadSourceContent";
import VERSION from "#/lib/version";
import tui from "#/tui";
import fs from "node:fs";

import sha from "./lib/crypto/hash";
import resolveAbsolutePath from "./lib/fs/resolveAbsolutePath";
import writeFile from "./lib/io/writeFile";

await new Command()
  .name("feo")
  .version(VERSION)
  .description("A configuration file manager")
  .globalOption(configOption.flags, configOption.desc, configOption.opts)
  .action(async (options) => {
    const configDir = npath.join(process.env.HOME ?? "", ".config", "feo");
    const configPath =
      options.config !== undefined
        ? options.config
        : (["jsonc", "json", "yaml", "yml", "toml"]
            .map((ext) => npath.join(configDir, `config.${ext}`))
            .find((p) => fs.existsSync(p)) ?? "");
    await tui({ configPath });
  })
  .command("write", "Write configurations")
  .option("-a, --all", "Write all targets")
  .arguments("[applications:string]")
  .action(async ({ all, ...options }, ...applicationNames) => {
    if (all === true && applicationNames.length > 0) {
      console.error("You cannot specify applications when using the --all option");
      throw new Error("You cannot specify applications when using the --all option");
    }
    const configDir = npath.join(process.env.HOME ?? "", ".config", "feo");
    const configPath =
      options.config !== undefined
        ? options.config
        : (["jsonc", "json", "yaml", "yml", "toml"]
            .map((ext) => npath.join(configDir, `config.${ext}`))
            .find((p) => fs.existsSync(p)) ?? "");
    const configStr = await readFile(configPath).then((f) => f.text());
    const configExt = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = mediaTypes[filetypes[configExt].mediaType].parse(configStr);
    const config = feoConfigValidator.parse(data);
    const applications =
      all === true
        ? values(config.applications)
        : applicationNames
            .filter((an) => an !== undefined)
            .map((a) => config.applications[a])
            .filter((a) => a !== undefined);
    for (const application of applications) {
      for (const [, { path: targetPath, sources: sourcePaths }] of entries(application.targets)) {
        const { dir, ext, name } = npath.parse(targetPath);
        const validatedExt = supportedExtensionSchema.parse(ext);
        const sources = (await Promise.allSettled(sourcePaths.map(async (s) => loadSourceContent(s))))
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
        const resolved = sources.reduce((p, c) => deepMerge(c, p), {} as Serializable);
        const contents = mediaTypes[filetypes[validatedExt].mediaType].stringify(resolved);
        const currentFile = await readFile(resolveAbsolutePath(targetPath));

        if (currentFile.ok) {
          const currentFileContents = await currentFile.text();

          const currentFileData =
            currentFileContents === null
              ? null
              : mediaTypes[filetypes[supportedExtensionSchema.parse(npath.parse(targetPath).ext)].mediaType].parse(
                  currentFileContents,
                );

          if (!isDeepStrictEqual(currentFileData, resolved)) {
            await writeFile(
              resolveAbsolutePath(`${dir}/${name}.${sha(currentFileContents)}.feo-bkup${validatedExt}`),
              currentFileContents,
            );
          }
        }

        await writeFile(resolveAbsolutePath(`${dir}/${name}${validatedExt}`), contents);
      }
    }
  })
  .parse();
