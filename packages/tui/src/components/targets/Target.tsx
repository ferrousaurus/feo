import configQueryOptions from "#/data/configQueryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";

export type TargetProps = { active: boolean; configPath: string; target: string };

export function Target({ active, configPath, target }: Readonly<TargetProps>) {
  const { data: theme } = useSuspenseQuery({ ...configQueryOptions(configPath), select: (d) => d.settings.theme });

  return (
    <text key={target} fg={active ? theme.active : theme.inactive}>
      {target}
    </text>
  );
}