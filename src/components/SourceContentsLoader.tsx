import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";
import Preview, { type PreviewProps } from "./Preview";
import resolveAbsolutePath from "../lib/resolveAbsolutePath";
import getProtocol from "../lib/getProtocol";
import readConfigFile from "../lib/readConfigFile";
import { deepMerge } from "@std/collections";

export type SourceContentsLoaderProps = Omit<PreviewProps, "config"> & {
  path: string;
};

export default function SourceContentsLoader({ path, ...props }: Readonly<SourceContentsLoaderProps>) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: [path],
    queryFn: async () => await readConfigFile(path),
  });

  if (isPending) {
    return <></>;
  }

  if (isError) {
    return <text>{error?.message}</text>;
  }

  return <Preview config={data ?? {}} {...props} />;
}
