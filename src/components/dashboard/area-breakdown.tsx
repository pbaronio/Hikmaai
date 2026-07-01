"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { areaConfig } from "@/lib/utils/format";
import type { TestArea } from "@/lib/types";

interface AreaBreakdownProps {
  areas: Record<TestArea, number>;
}

const chartConfig = {
  security: { label: "Security", color: areaConfig.security.chartColor },
  compliance: { label: "Compliance", color: areaConfig.compliance.chartColor },
  efficiency: { label: "Efficiency", color: areaConfig.efficiency.chartColor },
} satisfies ChartConfig;

export function AreaBreakdown({ areas }: AreaBreakdownProps) {
  const data = (Object.keys(areas) as TestArea[]).map((key) => ({
    area: key,
    value: areas[key],
    fill: chartConfig[key].color,
  }));

  return (
    <div className="flex items-center gap-8">
      <ChartContainer config={chartConfig} className="h-[100px] w-[100px] shrink-0">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="area"
            innerRadius={32}
            outerRadius={46}
            strokeWidth={3}
            stroke="#18181b"
          >
            {data.map((entry) => (
              <Cell key={entry.area} fill={entry.fill} opacity={0.85} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="grid flex-1 gap-3 sm:grid-cols-3">
        {(Object.keys(areas) as TestArea[]).map((key) => (
          <div key={key}>
            <p className="stat-label">{areaConfig[key].label}</p>
            <p
              className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight ${areaConfig[key].scoreColor}`}
            >
              {areas[key]}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
