"use client";

import { ScoreArcGauge } from "@/components/shared/score-arc-gauge";
import { areaConfig } from "@/lib/utils/format";
import type { TestArea } from "@/lib/types";

interface ScoreInfographicProps {
  efficiency: number;
  compliance: number;
  security: number;
  size?: "sm" | "md";
  open?: boolean;
}

function ArcScore({
  area,
  value,
  size,
  open,
}: {
  area: TestArea;
  value: number;
  size: "sm" | "md";
  open?: boolean;
}) {
  const config = areaConfig[area];

  return (
    <div className="flex flex-col items-center gap-0.5">
      <ScoreArcGauge
        value={value}
        open={open}
        activeColor={config.chartColor}
        size={size === "sm" ? "compact" : "default"}
      />
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
}

export function ScoreInfographic({
  efficiency,
  compliance,
  security,
  size = "md",
  open = true,
}: ScoreInfographicProps) {
  return (
    <div className="flex items-center justify-around gap-2">
      <ArcScore area="security" value={security} size={size} open={open} />
      <ArcScore area="compliance" value={compliance} size={size} open={open} />
      <ArcScore area="efficiency" value={efficiency} size={size} open={open} />
    </div>
  );
}
