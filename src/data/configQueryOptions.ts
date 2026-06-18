import feoConfigValidator from "#/data/feoConfig";
import filetypes, { supportedExtensionSchema } from "#/lib/config/filetypes";
import { queryOptions } from "@tanstack/react-query";
import npath from "node:path";
import sourceContentQueryOptions from "./sourceContentQueryOptions";

const configQueryOptions = (path: string) =>
  queryOptions({
    ...sourceContentQueryOptions({ path }),
    select: (text) => {
      const ext = supportedExtensionSchema.parse(npath.parse(path).ext);
      const data = filetypes[ext].parse(text);
      return feoConfigValidator.parse(data);
    },
  });

export default configQueryOptions;
