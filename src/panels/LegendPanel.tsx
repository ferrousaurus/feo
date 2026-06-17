import { panels } from "#/components/Shell";
import ApplicationsPanelLegend from "#/components/legends/ApplicationsPanelLegend";
import TargetsPanelLegend from "#/components/legends/TargetsPanelLegend";
import SourcesPanelLegend from "#/components/legends/SourcesPanelLegend";
import PreviewPanelLegend from "#/components/legends/PreviewPanelLegend";

export default function Legend({ panel }: { panel: (typeof panels)[number]; mode?: "creating" }) {
  switch (panel) {
    case "apps": {
      return <ApplicationsPanelLegend />;
    }
    case "targets": {
      return <TargetsPanelLegend />;
    }
    case "sources": {
      return <SourcesPanelLegend />;
    }
    case "preview": {
      return <PreviewPanelLegend />;
    }
  }
}