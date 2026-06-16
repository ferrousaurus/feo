import configQueryOptions from "#/data/configQueryOptions";
import type { Source as SourceData } from "#/data/feoConfig";
import textFileQueryOptions from "#/data/textFileQueryOptions";
import useTitle from "#/hooks/useTitle";
import ActiveSource from "#/components/sources/ActiveSource";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

type SourceProps = {
  configPath: string;
  application: string;
  target: string;
  source: SourceData;
  active: boolean;
  enableKeybinds: boolean;
  moving: boolean;
};

export default function SourceComponent({ active, enableKeybinds, application, target, source, configPath, moving }: Readonly<SourceProps>) {
  const { isError } = useQuery(textFileQueryOptions(source.path));
  const { data: theme } = useSuspenseQuery({ ...configQueryOptions(configPath), select: (d) => d.settings.theme });

  const title = useTitle(source.path, 0.35, {
    buffer: 8,
    stringify: (title: string) => `┤${title}├`,
  });

  if (isError) {
    return <box borderColor={active ? theme.warning : theme.error} title={title} />;
  }

  if (active) {
    return (
      <box borderColor={theme.active} borderStyle={moving ? "double" : undefined} title={title}>
        <ActiveSource
          application={application}
          target={target}
          source={source}
          configPath={configPath}
          enableKeybinds={enableKeybinds}
        />
      </box>
    );
  }

  return <box borderColor={theme.primary} title={title} />;
}