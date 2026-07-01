"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { areaConfig } from "@/lib/utils/format";
import { ScoreOutOf100 } from "@/components/shared/score-out-of-100";
import type { TestArea } from "@/lib/types";
import { cn } from "@/lib/utils";

const AREA_ORDER: TestArea[] = ["security", "compliance", "efficiency"];

const OVERVIEW_DOT_COLORS = AREA_ORDER.map((key) => areaConfig[key].chartColor);

const chartConfig = {
  score: { label: "Current score", color: "#71717a" },
  target: { label: "Target (80%)", color: "#71717a" },
} satisfies ChartConfig;

interface ScoreRadarChartProps {
  areas: Record<TestArea, number>;
  target?: number;
  variant?: "full" | "compact" | "overview";
  highlightArea?: TestArea;
}

const OVERVIEW_LABEL_INITIAL: Record<string, string> = {
  Security: "S",
  Compliance: "C",
  Efficiency: "E",
};

function OverviewAxisTick({
  x,
  y,
  cx,
  cy,
  payload,
}: {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  payload?: { value: string };
}) {
  const label = payload?.value ?? "";
  if (x == null || y == null) return null;

  const initial = OVERVIEW_LABEL_INITIAL[label] ?? label.charAt(0);
  const centerX = cx ?? x;
  const centerY = cy ?? y;
  const pull = 0.14;
  const tx = x + (centerX - x) * pull;
  const ty = y + (centerY - y) * pull;

  return (
    <text
      x={tx}
      y={ty}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#ffffff"
      fontSize={12}
      fontWeight={500}
    >
      {initial}
    </text>
  );
}

function OverviewRadarVisual({
  data,
}: {
  data: { area: string; score: number }[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square h-[200px] w-[200px] overflow-visible [&_.recharts-responsive-container]:overflow-visible [&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:overflow-visible"
    >
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="78%"
        margin={{ top: 6, right: 10, bottom: 6, left: 10 }}
        data={data}
      >
        <PolarGrid
          gridType="polygon"
          stroke="rgba(255,255,255,0.12)"
          radialLines
        />
        <PolarAngleAxis
          dataKey="area"
          tick={OverviewAxisTick}
          tickLine={false}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="score"
          dataKey="score"
          stroke="#71717a"
          fill="#71717a"
          fillOpacity={0.28}
          strokeWidth={1.5}
          dot={(props) => {
            const { cx, cy, index } = props;
            if (cx == null || cy == null || index == null) return null;

            return (
              <circle
                key={index}
                cx={cx}
                cy={cy}
                r={4}
                fill={OVERVIEW_DOT_COLORS[index]}
                stroke="#18181b"
                strokeWidth={2}
              />
            );
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="tabular-nums">
                  {value}
                  <span className="text-muted-foreground">/100</span>
                </span>
              )}
            />
          }
        />
      </RadarChart>
    </ChartContainer>
  );
}

function RadarVisual({
  data,
  className,
  tickFontSize = 11,
}: {
  data: { area: string; score: number; target: number }[];
  className?: string;
  tickFontSize?: number;
}) {
  return (
    <ChartContainer config={chartConfig} className={cn("aspect-square", className)}>
      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
        <PolarGrid
          gridType="polygon"
          stroke="rgba(255,255,255,0.1)"
          radialLines
        />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fill: "#a1a1aa", fontSize: tickFontSize, fontWeight: 400 }}
          tickLine={false}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="target"
          dataKey="target"
          stroke="#71717a"
          fill="#71717a"
          fillOpacity={0.06}
          strokeWidth={1.5}
          strokeDasharray="5 5"
          dot={false}
        />
        <Radar
          name="score"
          dataKey="score"
          stroke="#34d399"
          fill="#34d399"
          fillOpacity={0.22}
          strokeWidth={2}
          dot={{
            r: 4,
            fill: "#34d399",
            stroke: "#18181b",
            strokeWidth: 2,
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="tabular-nums">
                  {value}
                  <span className="text-muted-foreground">/100</span>
                </span>
              )}
            />
          }
        />
      </RadarChart>
    </ChartContainer>
  );
}

function OverviewLegend({
  areas,
}: {
  areas: Record<TestArea, number>;
}) {
  return (
    <ul className="flex w-[204px] shrink-0 flex-col gap-2 pt-1">
      {AREA_ORDER.map((key) => (
        <li key={key} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-[4px]"
              style={{ backgroundColor: areaConfig[key].chartColor }}
            />
            <span className="text-[11px] font-medium leading-[19.5px] text-muted-foreground">
              {areaConfig[key].label}
            </span>
          </div>
          <ScoreOutOf100
            value={areas[key]}
            uniform
            className="pl-2 text-right text-[13px] text-foreground"
          />
        </li>
      ))}
    </ul>
  );
}

function GridLegend({
  areas,
  variant,
  highlightArea,
}: {
  areas: Record<TestArea, number>;
  variant: "full" | "compact";
  highlightArea?: TestArea;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        variant === "compact" ? "w-full grid-cols-3" : "w-full flex-1 sm:grid-cols-3"
      )}
    >
      {AREA_ORDER.map((key) => (
        <div
          key={key}
          className={cn(
            variant === "compact" ? "text-center" : "text-center sm:text-left",
            highlightArea === key && "rounded-lg bg-accent/40 px-2 py-1.5"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1.5",
              variant === "compact"
                ? "justify-center"
                : "justify-center sm:justify-start"
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                areaConfig[key].dot
              )}
            />
            <p className="stat-label">{areaConfig[key].label}</p>
          </div>
          <div className="mt-1">
            <ScoreOutOf100
              value={areas[key]}
              className={cn(
                variant === "compact" ? "text-lg" : "text-2xl",
                "text-foreground"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TestAreaOverviewPanel({
  areas,
}: {
  areas: Record<TestArea, number>;
}) {
  const data = AREA_ORDER.map((key) => ({
    area: areaConfig[key].label,
    score: areas[key],
  }));

  return (
    <div className="flex w-full max-w-[428px] items-center justify-between pt-3">
      <div className="shrink-0 overflow-visible p-1">
        <OverviewRadarVisual data={data} />
      </div>
      <OverviewLegend areas={areas} />
    </div>
  );
}

export function ScoreRadarChart({
  areas,
  target = 80,
  variant = "full",
  highlightArea,
}: ScoreRadarChartProps) {
  const data = AREA_ORDER.map((key) => ({
    area: areaConfig[key].label,
    score: areas[key],
    target,
  }));

  if (variant === "overview") {
    return <TestAreaOverviewPanel areas={areas} />;
  }

  const legend = (
    <GridLegend
      areas={areas}
      variant={variant}
      highlightArea={highlightArea}
    />
  );

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-full border border-border p-3">
          <RadarVisual data={data} className="h-[180px] w-[180px]" />
        </div>
        {legend}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8">
      <div className="relative shrink-0 rounded-full border border-border p-3">
        <RadarVisual data={data} className="h-[200px] w-[200px]" />
      </div>
      {legend}
    </div>
  );
}
