import Shell from "#/components/Shell";
import configQueryOptions from "#/data/configQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export const AppContext = createContext<{ configPath: string }>({ configPath: "${HOME}/.config/feo/config.toml" });

export type AppProps = {
  configPath: string;
};

export default function App({ configPath }: Readonly<AppProps>) {
  const { isPending, isError, error, data } = useQuery(configQueryOptions(configPath));

  if (isPending) {
    return <box />;
  }

  if (isError) {
    return <text>{error.message}</text>;
  }

  return (
    <AppContext value={{ configPath }}>
      <Shell config={data} configPath={configPath} />
    </AppContext>
  );
}
