export default function Legend({ panel }: { panel: "apps" | "targets" | "preview" | "sources" | "source" }) {
  switch (panel) {
    case "apps":
    case "targets": {
      return (
        <>
          <text>Q - Quit | O/P - Panel | N - New</text>
          <text>j/↓ - Down | k/↑ - Up</text>
        </>
      );
    }
    case "sources": {
      return (
        <>
          <text>Q - Quit | O/P - Panel | N - New | M - Move</text>
          <text>j/↓ - Down | k/↑ - Up | [/] Scroll</text>
        </>
      );
    }
    case "preview": {
      return (
        <>
          <text>Q - Quit | O/P - Panel | F - Change Preview Format | W - Write</text>
          <text>j/↓ - Down | k/↑ - Up | [/] Scroll</text>
        </>
      );
    }
  }
}
