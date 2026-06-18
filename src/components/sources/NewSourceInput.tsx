import addSourceMutationOptions from "#/data/addSourceMutationOptions";
import { useKeyboard } from "@opentui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export type NewSourceInputProps = {
  app: string;
  configPath: string;
  target: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export default function NewSourceInput({ app, configPath, target, onSubmit, onCancel }: Readonly<NewSourceInputProps>) {
  const [name, setName] = useState("");

  const { mutateAsync } = useMutation(addSourceMutationOptions(configPath));

  useKeyboard((key) => {
    if (key.name === "escape") {
      onCancel?.();
    }
  });

  function handleSubmit() {
    void mutateAsync({
      application: app,
      target,
      source: name,
    })
      .then(() => {
        onSubmit?.();
      })
      .catch(() => {
        onSubmit?.();
      });
  }

  return <input placeholder="New Source" focused onInput={setName} onSubmit={handleSubmit} />;
}
