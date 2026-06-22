import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import readFile from "#/lib/io/readFile";
import entries from "#/lib/object/entries";
import values from "#/lib/object/values";
import type { Serializable } from "#/lib/serialization/util";
import { Command } from "@cliffy/command";
import { deepMerge } from "@std/collections";
import npath from "node:path";

const writeCommand = new Command()
  .option("-a, --all", "Write all targets")
  .arguments("[applications:string]")
  .action(async ({ all, ...options }, ...applicationNames) => {
    if (all === true && applicationNames.length > 0) {
      console.error("You cannot specify applications when using the --all option");
      throw new Error("You cannot specify applications when using the --all option");
    }
    const configPath = options.config as string;
    const configStr = await readFile(configPath).then((f) => f.text());
    const configExt = supportedExtensionSchema.parse(npath.parse(configPath).ext);
    const data = filetypes[configExt].parse(configStr);
    const config = feoConfigValidator.parse(data);
    const applications =
      all === true
        ? values(config.configs)
        : applicationNames
            .filter((an) => an !== undefined)
            .map((a) => config.configs[a])
            .filter((a) => a !== undefined);
    for (const application of applications) {
      for (const [target, { sources }] of entries(application.targets)) {
        const { dir, ext, name } = npath.parse(target);
        const validatedExt = supportedExtensionSchema.parse(ext);
        const resolved = sources.reduce((p, c) => deepMerge(c, p), {} as Serializable);
        const contents = filetypes[validatedExt].stringify(resolved);
        const currentFileContents = await readFile(target).then((r) => r.text());
        console.log(currentFileContents);
        console.log(contents);
        /*
        if (currentFileContents !== null) {
          await writeFile(`${dir}/${name}.${sha(currentFileContents)}.feo-bkup${validatedExt}`, currentFileContents);
        }
        await writeFile(`${dir}/${name}${validatedExt}`, contents);
        */
      }
    }
  });

export default writeCommand;
