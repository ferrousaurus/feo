import type { BoxProps } from "@opentui/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import configQueryOptions from "#/data/configQueryOptions";
import useTitle from "#/hooks/useTitle";

export type PanelProps = BoxProps & {
  active?: boolean;
  configPath: string;
  submitting?: boolean;
};

const stringifyTitle = (title: string) => `┤${title}├`;

export default function Panel({
  active = false,
  configPath,
  submitting = false,
  title,
  ...props
}: Readonly<PanelProps>) {
  const { data: config } = useSuspenseQuery(configQueryOptions(configPath));
  const theme = config.settings.theme;

  const truncatedTitle = useTitle(title, 0.3, { stringify: stringifyTitle });

  const borderColor = active ? (submitting ? theme.warning : theme.active) : theme.inactive;

  return <box title={truncatedTitle} borderColor={borderColor} {...props} />;
}
