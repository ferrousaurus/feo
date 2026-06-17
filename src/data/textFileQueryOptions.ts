import readFile from "#/lib/io/readFile";
import { queryOptions } from "@tanstack/react-query";

const textFileQueryOptions = (path: string) =>
  queryOptions({
    queryKey: [{ path, kind: "text" }],
    queryFn: async () => await readFile(path).then((f) => f.text()),
  });

export default textFileQueryOptions;
