"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { trendData } from "@/lib/data/mock";
import { chartColors } from "@/lib/chart-theme";

const chartConfig = {
  overall: { label: "Overall", color: chartColors.series.overall },
  security: { label: "Security", color: chartColors.series.security },
  compliance: { label: "Compliance", color: chartColors.series.compliance },
  efficiency: { label: "Efficiency", color: chartColors.series.efficiency },
} satisfies ChartConfig;

export function TrendChart() {
  return (
    <div className="surface-card p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="stat-label">Assessment trend</p>
          <p className="mt-1 text-sm text-muted-foreground">Last 90 days</p>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[260px] w-full">
        <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartColors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: chartColors.axis, fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: chartColors.axis, fontSize: 11 }}
            width={32}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="overall"
            stroke="var(--color-overall)"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="security"
            stroke="var(--color-security)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
            strokeOpacity={0.85}
          />
          <Line
            type="monotone"
            dataKey="compliance"
            stroke="var(--color-compliance)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
            strokeOpacity={0.85}
          />
          <Line
            type="monotone"
            dataKey="efficiency"
            stroke="var(--color-efficiency)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
            strokeOpacity={0.85}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
