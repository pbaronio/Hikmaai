import type { Agent, Priority, TestArea, TestStatus } from "../types";

const chips = {
  critical:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  muted:
    "border-border bg-muted text-foreground/85 dark:text-muted-foreground",
  violet:
    "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300",
  blue: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
  pink: "border-rose-200 bg-rose-50 text-rose-800 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300",
} as const;

export const neutralChipClassName = chips.muted;

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export const priorityConfig: Record<
  Priority,
  { label: string; className: string; tabClassName: string; dot: string }
> = {
  critical: {
    label: "Critical",
    className: chips.critical,
    tabClassName: "bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-300",
    dot: "bg-red-600 dark:bg-red-400",
  },
  medium: {
    label: "Medium",
    className: chips.warning,
    tabClassName:
      "bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200",
    dot: "bg-amber-600 dark:bg-amber-400",
  },
  low: {
    label: "Low",
    className: chips.muted,
    tabClassName: "bg-accent text-foreground",
    dot: "bg-zinc-600 dark:bg-zinc-500",
  },
};

export const areaConfig: Record<
  TestArea,
  {
    label: string;
    className: string;
    scoreColor: string;
    chartColor: string;
    dot: string;
  }
> = {
  security: {
    label: "Security",
    className: chips.violet,
    scoreColor: "text-violet-800 dark:text-violet-300",
    chartColor: "#a684ff",
    dot: "bg-[#a684ff]",
  },
  compliance: {
    label: "Compliance",
    className: chips.blue,
    scoreColor: "text-blue-800 dark:text-blue-300",
    chartColor: "#51a2ff",
    dot: "bg-[#51a2ff]",
  },
  efficiency: {
    label: "Efficiency",
    className: chips.pink,
    scoreColor: "text-rose-800 dark:text-pink-300",
    chartColor: "#fb64b6",
    dot: "bg-[#fb64b6]",
  },
};

export const statusConfig: Record<
  TestStatus,
  { label: string; className: string }
> = {
  passed: {
    label: "Passed",
    className: chips.success,
  },
  failed: {
    label: "Failed",
    className: chips.critical,
  },
  warning: {
    label: "Warning",
    className: chips.warning,
  },
  running: {
    label: "Running",
    className: chips.muted,
  },
};

export const agentStatusConfig: Record<
  Agent["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: chips.success,
  },
  inactive: {
    label: "Inactive",
    className: chips.muted,
  },
  degraded: {
    label: "Degraded",
    className: chips.warning,
  },
};

export const scheduleStatusConfig = {
  active: {
    label: "Active",
    className: chips.success,
  },
  inactive: {
    label: "Inactive",
    className: chips.muted,
  },
} as const;

export function getScoreGrade(percentage: number): string {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return "text-foreground";
  if (percentage >= 60) return "text-zinc-600 dark:text-zinc-300";
  return "text-red-700 dark:text-red-300";
}

export function getScoreSufficiencyColor(
  percentage: number,
  threshold = 60
): string {
  return percentage > threshold
    ? "text-emerald-700 dark:text-emerald-400"
    : "text-red-700 dark:text-red-400";
}

export function getAgentStatusLabel(percentage: number): string {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Critical";
}
