import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchedulesTable } from "@/components/schedule/schedules-table";

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="page-title">Schedule</h1>
          <Button className="create-new-btn shrink-0">
            Create new
            <Plus className="size-4" />
          </Button>
        </div>
        <p className="page-subtitle">
          Recurring test schedules across your workspace
        </p>
      </div>

      <SchedulesTable />
    </div>
  );
}
