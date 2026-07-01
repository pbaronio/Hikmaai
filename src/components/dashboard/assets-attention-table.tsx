import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAssetsNeedingAttention } from "@/lib/data/mock";
import { formatRelativeDate } from "@/lib/utils/format";
import type { TestArea } from "@/lib/types";

const typeLabels = {
  agent: "Agent",
  mcp: "MCP",
  skill: "Skill",
};

const statusConfig = {
  active: {
    label: "Active",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  inactive: {
    label: "Inactive",
    className: "border-border bg-muted text-muted-foreground",
  },
  degraded: {
    label: "Degraded",
    className: "border-red-500/20 bg-red-500/10 text-red-300",
  },
};

function weakestArea(agent: {
  security: number;
  compliance: number;
  efficiency: number;
}): TestArea {
  const scores = {
    security: agent.security,
    compliance: agent.compliance,
    efficiency: agent.efficiency,
  };
  return Object.entries(scores).sort(([, a], [, b]) => a - b)[0][0] as TestArea;
}

const areaLabels: Record<TestArea, string> = {
  security: "Security",
  compliance: "Compliance",
  efficiency: "Efficiency",
};

export function AssetsAttentionTable() {
  const rows = getAssetsNeedingAttention(10).filter(
    ({ agent }) => agent.type === "agent" && agent.status === "degraded"
  );

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="stat-label">Assets</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Degraded agents needing attention
          </p>
        </div>
        <Link
          href="/assets"
          className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          View all →
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="pl-5 text-[12px] font-medium text-muted-foreground">
              Asset
            </TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground">
              Weak spot
            </TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground">
              Critical
            </TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground">
              Last tested
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ agent, criticalTests }) => {
            const weak = weakestArea(agent);
            return (
              <TableRow
                key={agent.id}
                className="border-border hover:bg-accent/40"
              >
                <TableCell className="pl-5">
                  <Link
                    href={`/assets/${agent.id}`}
                    className="text-[14px] font-medium text-foreground hover:underline"
                  >
                    {agent.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">
                    {typeLabels[agent.type]}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] text-muted-foreground">
                    {areaLabels[weak]}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[13px] font-semibold tabular-nums text-foreground">
                    {criticalTests}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${statusConfig[agent.status].className}`}
                  >
                    {statusConfig[agent.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-[13px] text-muted-foreground">
                  {formatRelativeDate(agent.lastTestedAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
