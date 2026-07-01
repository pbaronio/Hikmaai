import type { Priority, TestArea, TestStatus } from "../types";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("it-IT", {
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
  { label: string; className: string; dot: string }
> = {
  critical: {
    label: "Critical",
    className: "border-red-500/20 bg-red-500/10 text-red-300",
    dot: "bg-red-400",
  },
  medium: {
    label: "Medium",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    dot: "bg-amber-400",
  },
  low: {
    label: "Low",
    className: "border-border bg-muted text-muted-foreground",
    dot: "bg-zinc-500",
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
    className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    scoreColor: "text-violet-300",
    chartColor: "#a684ff",
    dot: "bg-[#a684ff]",
  },
  compliance: {
    label: "Compliance",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    scoreColor: "text-blue-300",
    chartColor: "#51a2ff",
    dot: "bg-[#51a2ff]",
  },
  efficiency: {
    label: "Efficiency",
    className: "border-pink-500/20 bg-pink-500/10 text-pink-300",
    scoreColor: "text-pink-300",
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
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  failed: {
    label: "Failed",
    className: "border-red-500/20 bg-red-500/10 text-red-300",
  },
  warning: {
    label: "Warning",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  },
  running: {
    label: "Running",
    className: "border-border bg-muted text-foreground",
  },
};

export function getScoreGrade(percentage: number): string {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return "text-foreground";
  if (percentage >= 60) return "text-zinc-300";
  return "text-red-300";
}

export function getScoreSufficiencyColor(
  percentage: number,
  threshold = 60
): string {
  return percentage > threshold ? "text-emerald-400" : "text-red-400";
}

export function getAgentStatusLabel(percentage: number): string {
  if (percentage >= 80) return "Ottimo";
  if (percentage >= 60) return "Buono";
  if (percentage >= 40) return "Sufficiente";
  return "Critico";
}
