import { useKeyboard } from "@opentui/react";
import { useShallow } from "zustand/shallow";
import { useStateStore } from "../../stores/state";

export type ApplicationsPanelProps = {
  active: boolean;
  applications: { name: string }[];
};

function Application({ application }: { application: { name: string } }) {
  const active = useStateStore((s) => s.app === application.name);

  return (
    <text key={application.name} fg={active ? "cyan" : undefined}>
      {application.name}
    </text>
  );
}

function ApplicationsPanelKeybinds() {
  const { onNext, onPrevious } = useStateStore(
    useShallow((s) => ({
      onNext: s.nextApp,
      onPrevious: s.previousApp,
    })),
  );

  useKeyboard((key) => {
    if (key.name === "j" || key.name === "down") {
      if (key.shift) {
        // move item down
      } else {
        // down
        onNext?.();
      }
    }

    if (key.name === "k" || key.name === "up") {
      if (key.shift) {
        // move item up
      } else {
        onPrevious?.();
      }
    }
  });

  return null;
}

export default function ApplicationsPanel({ active, applications }: Readonly<ApplicationsPanelProps>) {
  return (
    <>
      {applications.map((a) => (
        <Application key={a.name} application={a} />
      ))}
      {active && <ApplicationsPanelKeybinds />}
    </>
  );
}
