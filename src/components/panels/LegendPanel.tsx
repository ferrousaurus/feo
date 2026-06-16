import { panels } from "../Shell";

export default function Legend({ panel }: { panel: (typeof panels)[number] }) {
  switch (panel) {
    case "apps":
    case "targets": {
      return (
        <>
          <text>Q - Quit</text>
          <text>j/↓ - Down | k/↑ - Up | N - New</text>
        </>
      );
    }
    case "sources": {
      return (
        <>
          <text>Q - Quit</text>
          <text>j/↓ - Down | k/↑ - Up | N - New</text>
          <text>M - Move | [ - Scroll Up | ] - Scroll Down</text>
        </>
      );
    }
    case "preview": {
      return (
        <>
          <text>Q - Quit</text>
          <text>[ - Scroll Up | ] - Scroll Down | W - Write</text>
        </>
      );
    }
  }
}
