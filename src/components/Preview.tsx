import { useState } from "react";
import * as YAML from "@std/yaml";
import * as TOML from "@std/toml";
import { useKeyboard } from "@opentui/react";

export type PreviewProps = {
  path?: string;
  config: Record<string, unknown>;
  format: ".json" | ".yaml" | ".toml";
  active: boolean;
  onPreviousFormat?: () => void;
  onNextFormat?: () => void;
  onScrollDown?: () => void;
  onScrollUp?: () => void;
  onWrite?: (opts: { path: string; contents: string }) => void;
  onCancelWrite?: () => void;
};

const stringifiers = {
  ".json": (obj: Record<string, unknown>) => JSON.stringify(obj, null, 2),
  ".yaml": YAML.stringify,
  ".toml": TOML.stringify,
};

export default function Preview({
  path,
  config,
  format,
  active,
  onPreviousFormat,
  onNextFormat,
  onScrollDown,
  onScrollUp,
  onWrite,
  onCancelWrite,
}: Readonly<PreviewProps>) {
  const stringify = stringifiers[format];

  const contents = stringify(config);

  useKeyboard((key) => {
    if (active && path !== undefined && path !== "") {
      if (key.name === "space") {
        if (key.shift) {
          onPreviousFormat?.();
        } else {
          onNextFormat?.();
        }
      }

      if (key.name === "j" || key.name === "down") {
        onScrollDown?.();
      }

      if (key.name === "k" || key.name === "up") {
        onScrollUp?.();
      }

      if (key.name === "return") {
        onWrite?.({ path, contents });
      }

      if (key.name === "escape") {
        onCancelWrite?.();
      }
    }
  });

  return <text>{contents}</text>;
}
