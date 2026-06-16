import addApplicationMutationOptions from "#/data/addApplicationMutationOptions";
import { useKeyboard } from "@opentui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export type NewApplicationInputProps = { configPath: string; onSubmit?: () => void; onCancel?: () => void };

export default function NewApplicationInput({ configPath, onSubmit, onCancel }: Readonly<NewApplicationInputProps>) {
  const [name, setName] = useState("");

  const { mutateAsync } = useMutation(addApplicationMutationOptions(configPath));

  const handleSubmit = () => {
    mutateAsync({ name })
      .then(() => {
        onSubmit?.();
      })
      .catch(() => {
        onSubmit?.();
      });
  };

  const handleCancel = () => {
    onCancel?.();
  };

  useKeyboard((key) => {
    if (key.name === "escape") {
      handleCancel();
    }
  });

  return <input placeholder="New Application" focused onInput={setName} onSubmit={handleSubmit} />;
}