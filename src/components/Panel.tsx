import type { BoxProps } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import configQueryOptions from "#/data/configQueryOptions";
import useTitle from "#/hooks/useTitle";

export type PanelProps = BoxProps & {
  active: boolean;
  configPath: string;
};

const stringifyTitle = (title: string) => `┤${title}├`;

export default function Panel({ active, configPath, title, ...props }: Readonly<PanelProps>) {
  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const theme = config.settings.theme;

  const truncatedTitle = useTitle(title, 0.3, { stringify: stringifyTitle });

  return <box title={truncatedTitle} borderColor={active ? theme.active : theme.inactive} {...props} />;
}
