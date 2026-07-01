"use client";

import { useState, useMemo, useCallback, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, Search, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TestDrawer } from "./test-drawer";
import { TableColumnHeader, assessmentColumnHints } from "@/components/shared/table-column-header";
import { testRuns, getAgentById } from "@/lib/data/mock";
import type { TestRun, Priority, TestArea } from "@/lib/types";
import {
  priorityConfig,
  formatRelativeDate,
  areaConfig,
} from "@/lib/utils/format";
import {
  expandTestsByAgent,
  isRecurrentTest,
} from "@/lib/utils/tests";
import { cn } from "@/lib/utils";

const ALL_PRIORITIES = "all" as const;
const ALL_AREAS = "all" as const;

type PriorityFilter = Priority | typeof ALL_PRIORITIES;
type AreaFilter = TestArea | typeof ALL_AREAS;

const priorityFilters: { value: PriorityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const areaFilters: { value: AreaFilter; label: string }[] = [
  { value: "all", label: "All test area" },
  { value: "security", label: "Security" },
  { value: "compliance", label: "Compliance" },
  { value: "efficiency", label: "Efficiency" },
];

function PriorityTab({
  active,
  onClick,
  label,
  count,
  activeClassName,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  activeClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active
          ? activeClassName ?? "bg-accent text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      <span
        className={cn(
          "tabular-nums text-[11px] font-normal",
          active ? "opacity-70" : "text-muted-foreground/80"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function AreaScore({ test }: { test: TestRun }) {
  const chip = areaConfig[test.area];

  return (
    <span
      className={cn(
        "w-fit rounded-md border px-2 py-0.5 text-[11px] font-medium",
        chip.className
      )}
    >
      {chip.label}
    </span>
  );
}

function AgentCell({ agentId }: { agentId: string }) {
  const agent = getAgentById(agentId);
  if (!agent) {
    return <span className="text-[13px] text-muted-foreground">—</span>;
  }

  return (
    <span className="truncate text-[13px] font-medium text-foreground">
      {agent.name}
    </span>
  );
}

function RecurrenceCell({ test }: { test: TestRun }) {
  if (isRecurrentTest(test)) {
    return (
      <div>
        <p className="text-[13px] font-medium text-foreground">Recurrent</p>
        <p className="text-[12px] text-muted-foreground">{test.schedule}</p>
      </div>
    );
  }

  return (
    <span className="text-[13px] text-muted-foreground">One-off</span>
  );
}

function TestRow({
  test,
  onSelect,
}: {
  test: TestRun;
  onSelect: (test: TestRun) => void;
}) {
  const agentId = test.agents[0];

  return (
    <TableRow
      className="cursor-pointer border-border hover:bg-accent/40"
      onClick={() => onSelect(test)}
    >
      <TableCell>
        <AgentCell agentId={agentId} />
      </TableCell>
      <TableCell>
        <span className="text-[14px] font-medium text-foreground">
          {test.testCase}
        </span>
      </TableCell>
      <TableCell>
        <AreaScore test={test} />
      </TableCell>
      <TableCell>
        <RecurrenceCell test={test} />
      </TableCell>
      <TableCell>
        <span className="text-[13px] text-muted-foreground">
          {formatRelativeDate(test.lastRunAt)}
        </span>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <RefreshCw className="size-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

const PRIORITY_ORDER: Priority[] = ["critical", "medium", "low"];

function groupRowsByPriority(
  rows: TestRun[]
): { priority: Priority; tests: TestRun[] }[] {
  const groups = new Map<Priority, TestRun[]>();

  for (const row of rows) {
    const list = groups.get(row.priority) ?? [];
    list.push(row);
    groups.set(row.priority, list);
  }

  return PRIORITY_ORDER.filter((p) => groups.has(p)).map((priority) => ({
    priority,
    tests: groups.get(priority)!,
  }));
}

function PrioritySectionHeader({
  priority,
  count,
}: {
  priority: Priority;
  count: number;
}) {
  const config = priorityConfig[priority];

  return (
    <TableRow className="border-border bg-muted/25 hover:bg-muted/25">
      <TableCell colSpan={6} className="py-3">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-1.5 rounded-full", config.dot)} />
          <span className="text-[13px] font-semibold text-foreground">
            {config.label}
          </span>
          <span className="text-[12px] text-muted-foreground">
            {count} assessment{count === 1 ? "" : "s"}
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TestsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPriority =
    (searchParams.get("priority") as Priority | null) ?? ALL_PRIORITIES;
  const initialArea =
    (searchParams.get("area") as TestArea | null) ?? ALL_AREAS;

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>(initialPriority);
  const [areaFilter, setAreaFilter] = useState<AreaFilter>(initialArea);
  const [selectedTest, setSelectedTest] = useState<TestRun | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const updateFilters = useCallback(
    (priority: PriorityFilter, area: AreaFilter) => {
      const params = new URLSearchParams();
      if (priority !== ALL_PRIORITIES) params.set("priority", priority);
      if (area !== ALL_AREAS) params.set("area", area);
      const qs = params.toString();
      router.replace(qs ? `/tests?${qs}` : "/tests", { scroll: false });
    },
    [router]
  );

  const handlePriorityChange = (value: PriorityFilter) => {
    setPriorityFilter(value);
    updateFilters(value, areaFilter);
  };

  const handleAreaChange = (value: AreaFilter) => {
    setAreaFilter(value);
    updateFilters(priorityFilter, value);
  };

  const baseRows = useMemo(() => {
    const filtered = testRuns.filter((t) => {
      if (areaFilter !== ALL_AREAS && t.area !== areaFilter) return false;
      return true;
    });

    const expanded = expandTestsByAgent(filtered);

    if (!search.trim()) return expanded;

    const q = search.toLowerCase();
    return expanded.filter((t) => {
      const agent = getAgentById(t.agents[0]!);
      return (
        t.testCase.toLowerCase().includes(q) ||
        agent?.name.toLowerCase().includes(q)
      );
    });
  }, [search, areaFilter]);

  const priorityCounts = useMemo(() => {
    const counts: Record<PriorityFilter, number> = {
      all: baseRows.length,
      critical: 0,
      medium: 0,
      low: 0,
    };

    for (const row of baseRows) {
      counts[row.priority]++;
    }

    return counts;
  }, [baseRows]);

  const rows = useMemo(() => {
    if (priorityFilter === ALL_PRIORITIES) return baseRows;
    return baseRows.filter((t) => t.priority === priorityFilter);
  }, [baseRows, priorityFilter]);

  const groupedRows = useMemo(() => groupRowsByPriority(rows), [rows]);

  const handleSelect = (test: TestRun) => {
    setSelectedTest(test);
    setDrawerOpen(true);
  };

  const resultLabel =
    priorityFilter !== ALL_PRIORITIES
      ? priorityConfig[priorityFilter].label
      : "All";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="page-title">Assessments</h1>
        <Button className="create-new-btn">
          Crea nuovo
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by test or asset..."
            className="search-field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-border bg-card p-1">
            {priorityFilters.map((f) => (
              <PriorityTab
                key={f.value}
                active={priorityFilter === f.value}
                onClick={() => handlePriorityChange(f.value)}
                label={f.label}
                count={priorityCounts[f.value]}
                activeClassName={
                  f.value === "critical"
                    ? "bg-red-500/10 text-red-300"
                    : f.value === "medium"
                      ? "bg-amber-500/10 text-amber-200"
                      : f.value === "low"
                        ? "bg-accent text-foreground"
                        : undefined
                }
              />
            ))}
          </div>

          <Select
            value={areaFilter}
            onValueChange={(v) => handleAreaChange((v ?? ALL_AREAS) as AreaFilter)}
          >
            <SelectTrigger className="w-[188px] border-border bg-card">
              <span className="truncate text-sm">
                {areaFilters.find((f) => f.value === areaFilter)?.label}
              </span>
            </SelectTrigger>
            <SelectContent>
              {areaFilters.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  <span className="flex items-center gap-2">
                    {f.value !== ALL_AREAS && (
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          f.value === "security" && "bg-violet-400",
                          f.value === "compliance" && "bg-blue-400",
                          f.value === "efficiency" && "bg-pink-400"
                        )}
                      />
                    )}
                    {f.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="stat-label">{resultLabel} tests</p>
        </div>
        {rows.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No tests match your filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>
                  <TableColumnHeader label="Asset" hint={assessmentColumnHints.asset} />
                </TableHead>
                <TableHead>
                  <TableColumnHeader label="Test case" hint={assessmentColumnHints.testCase} />
                </TableHead>
                <TableHead>
                  <TableColumnHeader label="Test area" hint={assessmentColumnHints.testArea} />
                </TableHead>
                <TableHead>
                  <TableColumnHeader label="Recurrence" hint={assessmentColumnHints.recurrence} />
                </TableHead>
                <TableHead>
                  <TableColumnHeader
                    label="Last checked"
                    hint={assessmentColumnHints.lastChecked}
                  />
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedRows.map(({ priority, tests }) => (
                <Fragment key={priority}>
                  <PrioritySectionHeader priority={priority} count={tests.length} />
                  {tests.map((test) => (
                    <TestRow key={test.id} test={test} onSelect={handleSelect} />
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <TestDrawer
        test={selectedTest}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
