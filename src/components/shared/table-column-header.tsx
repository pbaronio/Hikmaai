"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const assessmentColumnHints = {
  asset:
    "The agent, MCP server, or skill that was assessed in this run.",
  testCase:
    "The name of the security, compliance, or efficiency test that was executed.",
  testArea:
    "Which assessment domain this test belongs to: Security, Compliance, or Efficiency.",
  recurrence:
    "Whether this assessment runs on a schedule or was executed as a one-off.",
  lastChecked: "When this assessment was last run against the asset.",
} as const;

export const evaluationColumnHints = {
  name: "The evaluation framework or assessment pack applied to your assets.",
  category:
    "The industry or domain this evaluation is designed for, e.g. Fine Tech or FinTech.",
  preset:
    "The built-in test preset this evaluation is based on: Safety basics, OWASP LLM01/LLM02, or a custom configuration.",
} as const;

interface TableColumnHeaderProps {
  label: string;
  hint: string;
  className?: string;
}

export function TableColumnHeader({
  label,
  hint,
  className,
}: TableColumnHeaderProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "cursor-help border-b border-dotted border-transparent text-[12px] font-medium text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:text-foreground",
          className
        )}
      >
        {label}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-center">
        {hint}
      </TooltipContent>
    </Tooltip>
  );
}
