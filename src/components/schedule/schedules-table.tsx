import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableColumnHeader,
  scheduleColumnHints,
} from "@/components/shared/table-column-header";
import { scheduleStatusConfig } from "@/lib/utils/format";
import {
  getSchedulesWithUsage,
  formatScheduleDetails,
} from "@/lib/utils/schedules";
import { cn } from "@/lib/utils";

export function SchedulesTable() {
  const rows = getSchedulesWithUsage();

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <p className="stat-label">Schedules</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {rows.filter((row) => row.isActive).length} active ·{" "}
          {rows.length} total
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="pl-5">
              <TableColumnHeader
                label="Name"
                hint={scheduleColumnHints.name}
                className="pl-0"
              />
            </TableHead>
            <TableHead>
              <TableColumnHeader
                label="Details"
                hint={scheduleColumnHints.details}
              />
            </TableHead>
            <TableHead>
              <TableColumnHeader
                label="Tests using schedule"
                hint={scheduleColumnHints.testsUsingSchedule}
              />
            </TableHead>
            <TableHead>
              <TableColumnHeader
                label="Status"
                hint={scheduleColumnHints.status}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ schedule, testCount, isActive }) => (
            <TableRow
              key={schedule.id}
              className="border-border hover:bg-accent/40"
            >
              <TableCell className="pl-5">
                <p className="text-[14px] font-medium text-foreground">
                  {schedule.name}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-[13px] text-muted-foreground">
                  {formatScheduleDetails(schedule)}
                </p>
              </TableCell>
              <TableCell>
                <span className="text-[13px] font-semibold tabular-nums text-foreground">
                  {testCount}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11px] font-medium",
                    scheduleStatusConfig[isActive ? "active" : "inactive"].className
                  )}
                >
                  {scheduleStatusConfig[isActive ? "active" : "inactive"].label}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
