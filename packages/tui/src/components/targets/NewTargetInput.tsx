import addTargetMutationOptions from "#/data/addTargetMutationOptions";
import { useKeyboard } from "@opentui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type NewTargetInputProps = {
  app: string;
  configPath: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export default function NewTargetInput({ app, configPath, onSubmit, onCancel }: Readonly<NewTargetInputProps>) {
  const [name, setName] = useState("");

  const { mutateAsync } = useMutation(addTargetMutationOptions(configPath));

  useKeyboard((key) => {
    if (key.name === "escape") {
      onCancel?.();
    }
  });

  function handleSubmit() {
    mutateAsync({
      application: app,
      target: name,
    })
      .then(() => {
        onSubmit?.();
      })
      .catch(() => {
        onSubmit?.();
      });
  }

  return <input placeholder="New Target" focused onInput={setName} onSubmit={handleSubmit} />;
}