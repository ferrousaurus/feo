import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import Shell from "./components/Shell";
import readConfigFile from "./lib/readConfigFile";
import resolveAbsolutePath from "./lib/resolveAbsolutePath";
import { z } from "zod/mini";
import feoConfigValidator, { type FeoConfig } from "./data/feoConfig";
import * as TOML from "@std/toml";

const queryClient = new QueryClient();

function App() {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["~/.config/feo/config.toml"],
    queryFn: async () => {
      const contents = await readConfigFile(resolveAbsolutePath("~/.config/feo/config.toml"));

      return feoConfigValidator.parse(contents);
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["write", "~/.config/feo/config.toml"],
    mutationFn: async (config: FeoConfig) =>
      await Bun.write(resolveAbsolutePath("~/.config/feo/config.toml"), TOML.stringify(config)),
    onMutate: async (vars, context) => {
      await context.client.setQueryData(["~/.config/feo/config.toml"], vars);
    },
  });

  if (isPending) {
    return <box />;
  }

  if (isError) {
    return <text>{error.message}</text>;
  }

  return <Shell config={data} onChangeConfig={mutate} />;
}

const renderer = await createCliRenderer();
createRoot(renderer).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
