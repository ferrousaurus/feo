import { panels } from "#/components/Shell";

export default function Legend({ mode, panel }: { panel: (typeof panels)[number]; mode?: "creating" }) {
  switch (panel) {
    case "apps":
    case "targets": {
      return (
        <>
          <text>[Q]uit</text>
          <text>j/↓ - Down | k/↑ - Up | [N]ew</text>
          <text>[D]elete | [M]ove</text>
        </>
      );
    }
    case "sources": {
      return (
        <>
          <text>[Q]uit</text>
          <text>j/↓ - Down | k/↑ - Up | [N]ew</text>
          <text>[D]elete | [M]ove | [ - Scroll Up | ] - Scroll Down</text>
        </>
      );
    }
    case "preview": {
      return (
        <>
          <text>[Q]uit</text>
          <text />
          <text>[W]rite | [ - Scroll Up | ] - Scroll Down</text>
        </>
      );
    }
  }
}
