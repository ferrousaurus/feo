import { useKeyboard } from "@opentui/react";
import { useQuery } from "@tanstack/react-query";
import readConfigFile from "../lib/readConfigFile";

export type SourceFilesProps = {
  files: { active: boolean; path: string }[];
  active: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onMovePrevious?: () => void;
  onMoveNext?: () => void;
};

function SourceFile({ file }: { file: { active: boolean; path: string } }) {
  const { isError, data } = useQuery({
    queryKey: [file.path],
    queryFn: async () => await readConfigFile(file.path),
  });

  if (isError) {
    return (
      <text key={file.path} fg={file.active ? "red" : "orange"}>
        {file.path}
      </text>
    );
  }

  return (
    <text key={file.path} fg={file.active ? "cyan" : undefined}>
      {file.path}
    </text>
  );
}

export default function SourceFiles({
  files,
  active,
  onPrevious,
  onNext,
  onMoveNext,
  onMovePrevious,
}: Readonly<SourceFilesProps>) {
  useKeyboard((key) => {
    if (active) {
      if (key.name === "j" || key.name === "down") {
        if (key.shift) {
          onMoveNext?.();
        } else {
          if (active) {
            onNext?.();
          }
        }
      }

      if (key.name === "k" || key.name === "up") {
        if (key.shift) {
          onMovePrevious?.();
        } else {
          onPrevious?.();
        }
      }
    }
  });

  return files.map((f) => <SourceFile key={f.path} file={f} />);
}
