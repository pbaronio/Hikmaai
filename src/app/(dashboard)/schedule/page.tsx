import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testRuns } from "@/lib/data/mock";

export default function SchedulePage() {
  const scheduled = testRuns.filter((t) => t.schedule);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="page-title">Schedule</h1>
          <Button className="create-new-btn shrink-0">
            Crea nuovo
            <Plus className="size-4" />
          </Button>
        </div>
        <p className="page-subtitle">
          Recurring test schedules across your workspace
        </p>
      </div>

      <div className="space-y-2">
        {scheduled.map((test) => (
          <div key={test.id} className="row-surface flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[15px] font-medium text-foreground">{test.testCase}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {test.agents.length} assets · {test.area}
              </p>
            </div>
            <span className="rounded-md bg-white/5 px-2.5 py-1 text-[12px] text-muted-foreground ring-1 ring-white/10">
              {test.schedule}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
