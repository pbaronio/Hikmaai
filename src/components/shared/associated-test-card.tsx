import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TestRun } from "@/lib/types";
import {
  areaConfig,
  priorityConfig,
  statusConfig,
  formatRelativeDate,
} from "@/lib/utils/format";
import { isRecurrentTest } from "@/lib/utils/tests";
import { getScheduleLabelForTest } from "@/lib/utils/schedules";
import { cn } from "@/lib/utils";

function AssociatedTestMeta({ test }: { test: TestRun }) {
  const scheduleLabel = getScheduleLabelForTest(test.scheduleId);
  const recurrenceLabel =
    isRecurrentTest(test) && scheduleLabel ? scheduleLabel : "One-off";

  return (
    <p className="mt-2 text-[12px] text-muted-foreground">
      Checked {formatRelativeDate(test.lastRunAt)} · {recurrenceLabel}
    </p>
  );
}

function AssociatedTestBadges({ test }: { test: TestRun }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <Badge variant="outline" className={areaConfig[test.area].className}>
        {areaConfig[test.area].label}
      </Badge>
      <Badge variant="outline" className={priorityConfig[test.priority].className}>
        {priorityConfig[test.priority].label}
      </Badge>
      <Badge variant="outline" className={statusConfig[test.status].className}>
        {statusConfig[test.status].label}
      </Badge>
    </div>
  );
}

export function AssociatedTestCard({ test }: { test: TestRun }) {
  return (
    <Link href={`/tests/${test.id}`}>
      <Card className="row-surface transition-colors hover:bg-accent/40">
        <CardContent className="p-4">
          <p className="text-[14px] font-medium text-foreground">{test.testCase}</p>
          <AssociatedTestBadges test={test} />
          <AssociatedTestMeta test={test} />
        </CardContent>
      </Card>
    </Link>
  );
}

export function AssociatedTestRow({
  test,
  className,
}: {
  test: TestRun;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 px-3 py-2.5",
        className
      )}
    >
      <p className="truncate text-sm font-medium text-foreground">
        {test.testCase}
      </p>
      <AssociatedTestBadges test={test} />
      <AssociatedTestMeta test={test} />
    </div>
  );
}
