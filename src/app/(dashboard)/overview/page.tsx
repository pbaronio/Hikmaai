import { OverviewMetricsRow, PriorityCards } from "@/components/dashboard/overview-metrics";
import { AssetsAttentionTable } from "@/components/dashboard/assets-attention-table";

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <div>
        <h1 className="page-title">Welcome back, Paolo</h1>
        <p className="page-subtitle">
          30 assets monitored • 47 active tests • 9 need attention
        </p>
      </div>

      <OverviewMetricsRow />
      <PriorityCards />
      <AssetsAttentionTable />
    </div>
  );
}
