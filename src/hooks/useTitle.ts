import { useTerminalDimensions } from "@opentui/react";

export type UseTitleOptions = {
  buffer?: number;
  stringify?: (str: string) => string;
};

export default function useTitle(
  title: string | undefined,
  percentage: number,
  { buffer = 6, stringify = (str) => str }: UseTitleOptions,
) {
  const { width } = useTerminalDimensions();

  if (title === undefined) {
    return undefined;
  }

  const max = Math.floor(width * percentage) - buffer;

  return stringify(title.length <= max ? title : title.slice(0, max - 2) + "...");
}
