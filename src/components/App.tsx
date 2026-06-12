import { addDefaultParsers, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import * as TOML from "@std/toml";
import { QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import Shell from "#/components/Shell";
import feoConfigValidator, { type FeoConfig } from "#/data/feoConfig";
import readConfigFile from "#/lib/readConfigFile";
import resolveAbsolutePath from "#/lib/resolveAbsolutePath";
import queryClient from "#/stores/queryClient";
import { createStateStore, StateStoreContext } from "#/stores/state";
import keys from "#/util/object/keys";
import { createContext, use, useMemo } from "react";
import writeFile from "#/lib/io/writeFile";
import configQueryOptions from "#/data/configQueryOptions";
import configMutationOptions from "#/data/configMutationOptions";
import { Command } from "@cliffy/command";

export const AppContext = createContext<{ configPath: string }>({ configPath: "${HOME}/.config/feo/config.toml" });

export type AppProps = {
  configPath: string;
};

export default function App({ configPath }: Readonly<AppProps>) {
  const { isPending, isError, isSuccess, error, data } = useQuery(configQueryOptions(configPath));
  const { mutateAsync } = useMutation(configMutationOptions(configPath));

  const store = useMemo(() => {
    const app = isSuccess ? keys(data.configs)[0] : undefined;
    const appConfig = isSuccess && app !== undefined ? data.configs[app] : undefined;
    const targets = isSuccess && appConfig !== undefined ? keys(appConfig.targets) : undefined;
    const target = isSuccess && targets !== undefined ? targets[0] : undefined;
    const source =
      isSuccess && app !== undefined && target !== undefined ? appConfig?.targets[target]?.sources[0] : undefined;
    return createStateStore({
      app,
      target,
      source,
    });
  }, [isSuccess, data]);

  if (isPending) {
    return <box />;
  }

  if (isError) {
    return <text>{error.message}</text>;
  }

  return (
    <AppContext value={{ configPath }}>
      <StateStoreContext value={store}>
        <Shell config={data} onChangeConfig={(c) => void mutateAsync(c)} />
      </StateStoreContext>
    </AppContext>
  );
}
