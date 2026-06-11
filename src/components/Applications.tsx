import { useKeyboard } from "@opentui/react";

export type ApplicationsProps = {
  applications: { name: string; active: boolean }[];
  active: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
};

export default function Applications({ active, applications, onPrevious, onNext }: Readonly<ApplicationsProps>) {
  useKeyboard((key) => {
    if (active) {
      if (key.name === "j" || key.name === "down") {
        if (key.shift) {
          // move item down
        } else {
          // down
          if (active) {
            onNext?.();
          }
        }
      }

      if (key.name === "k" || key.name === "up") {
        if (key.shift) {
          // move item up
        } else {
          onPrevious?.();
        }
      }
    }
  });

  return applications.map((a) => (
    <text key={a.name} fg={a.active ? "cyan" : undefined}>
      {a.name}
    </text>
  ));
}
