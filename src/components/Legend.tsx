export default function Legend({ panel }: { panel: "apps" | "targets" | "preview" | "sources" | "source" }) {
  switch (panel) {
    case "apps":
    case "targets": {
      return (
        <>
          <text>q - Quit | Tab - Next Panel | Shift Tab - Previous Panel</text>
          <text>j/↓ - Down | k/↑ - Up</text>
        </>
      );
    }
    case "sources": {
      return (
        <>
          <text>q - Quit | Tab - Next Panel | Shift Tab - Previous Panel</text>
          <text>j/↓ - Down | Shift+j/↓ - Move Down | k/↑ - Up | Shift + k/↑ - Move Up</text>
        </>
      );
    }
    case "source": {
      return (
        <>
          <text>q - Quit | Tab - Next Panel | Shift Tab - Previous Panel</text>
        </>
      );
    }
    case "preview": {
      return (
        <>
          <text>q - Quit | Tab - Next Panel | Shift Tab - Previous Panel</text>
          <text>Space - Next Format | Shift Space - Previous Format | Enter - Save | Escape - Cancel Save</text>
        </>
      );
    }
  }
}
