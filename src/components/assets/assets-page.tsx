"use client";

import { useState, useMemo } from "react";
import { Search, Plus, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { AssetDrawer } from "./asset-drawer";
import { agents } from "@/lib/data/mock";
import type { Agent } from "@/lib/types";
import { formatRelativeDate, getScoreColor, agentStatusConfig, neutralChipClassName } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const typeLabels = {
  agent: "AI Agent",
  mcp: "MCP",
  skill: "Skill",
};

type SortKey =
  | "name"
  | "type"
  | "security"
  | "compliance"
  | "efficiency"
  | "status"
  | "activeTests"
  | "lastTestedAt";
type SortDir = "asc" | "desc";

const statusOrder = { degraded: 0, inactive: 1, active: 2 };

function SortableTableHead({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (column: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === column;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          active && "text-foreground"
        )}
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )
        ) : (
          <ArrowUpDown className="size-3 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}

const typeFilterLabels: Record<string, string> = {
  all: "All types",
  agent: "Agents",
  mcp: "MCP",
  skill: "Skills",
};

export function AssetsPageContent() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [search, typeFilter]);

  const sorted = useMemo(() => {
    const list = [...filtered];

    list.sort((a, b) => {
      let cmp = 0;

      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
        case "security":
          cmp = a.security - b.security;
          break;
        case "compliance":
          cmp = a.compliance - b.compliance;
          break;
        case "efficiency":
          cmp = a.efficiency - b.efficiency;
          break;
        case "status":
          cmp = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "activeTests":
          cmp = a.activeTests - b.activeTests;
          break;
        case "lastTestedAt":
          cmp =
            new Date(a.lastTestedAt).getTime() -
            new Date(b.lastTestedAt).getTime();
          break;
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [filtered, sortKey, sortDir]);

  const handleSort = (column: SortKey) => {
    if (sortKey === column) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(column);
    setSortDir("asc");
  };

  const handleSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setDrawerOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="page-title">Assets</h1>
          <Button className="create-new-btn shrink-0">
            Create new
            <Plus className="size-4" />
          </Button>
        </div>
        <p className="page-subtitle">
          AI agents, MCP servers and skills under assessment
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="search-field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v ?? "all")}
        >
          <SelectTrigger className="w-[188px] border-border bg-card">
            <span className="truncate text-sm">
              {typeFilterLabels[typeFilter] ?? typeFilter}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="agent">Agents</SelectItem>
            <SelectItem value="mcp">MCP</SelectItem>
            <SelectItem value="skill">Skills</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="surface-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <SortableTableHead
                label="Name"
                column="name"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
              <SortableTableHead
                label="Type"
                column="type"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
              <SortableTableHead
                label="Security"
                column="security"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
              <SortableTableHead
                label="Compliance"
                column="compliance"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
              <SortableTableHead
                label="Efficiency"
                column="efficiency"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
              <SortableTableHead
                label="Status"
                column="status"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
              <SortableTableHead
                label="Tests"
                column="activeTests"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
              <SortableTableHead
                label="Last tested"
                column="lastTestedAt"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                className="text-[12px] font-medium text-muted-foreground"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((agent) => (
              <TableRow
                key={agent.id}
                className="cursor-pointer border-border hover:bg-accent/40"
                onClick={() => handleSelect(agent)}
              >
                <TableCell className="text-[14px] font-medium text-foreground">
                  {agent.name}
                </TableCell>
                <TableCell>
                  <span className={cn("rounded-md border px-2 py-0.5 text-[12px] font-medium", neutralChipClassName)}>
                    {typeLabels[agent.type]}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-[13px] font-medium tabular-nums ${getScoreColor(agent.security)}`}>
                    {agent.security}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-[13px] font-medium tabular-nums ${getScoreColor(agent.compliance)}`}>
                    {agent.compliance}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-[13px] font-medium tabular-nums ${getScoreColor(agent.efficiency)}`}>
                    {agent.efficiency}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-medium", agentStatusConfig[agent.status].className)}>
                    {agentStatusConfig[agent.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-[13px] font-medium tabular-nums text-foreground">
                  {agent.activeTests}
                </TableCell>
                <TableCell className="text-[13px] text-muted-foreground">
                  {formatRelativeDate(agent.lastTestedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AssetDrawer
        agent={selectedAgent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
