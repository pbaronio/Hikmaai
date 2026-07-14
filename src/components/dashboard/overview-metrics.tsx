"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpRight } from "lucide-react";
import { ScoreRadarChart } from "./score-radar-chart";
import { AgentStatusGraphic } from "./agent-status-graphic";
import { ScoreOutOf100 } from "@/components/shared/score-out-of-100";
import { getAgentStatusLabel } from "@/lib/utils/format";
import { scoreData } from "@/lib/data/mock";
import { priorityConfig } from "@/lib/utils/format";
import type { Priority } from "@/lib/types";

const priorityCards: {
  key: Priority;
  label: string;
  href: string;
  hint: string;
}[] = [
  {
    key: "critical",
    label: "Critical",
    href: "/tests?priority=critical",
    hint: "Tests need priority attention",
  },
  {
    key: "medium",
    label: "Medium",
    href: "/tests?priority=medium",
    hint: "Tests need attention",
  },
  {
    key: "low",
    label: "Low",
    href: "/tests?priority=low",
    hint: "Tests need secondary attention",
  },
];

function AgentStatusCard() {
  const { percentage } = scoreData;
  const status = getAgentStatusLabel(percentage);

  return (
    <article className="surface-card relative flex min-h-[295px] flex-col overflow-hidden rounded-xl p-6">
      <AgentStatusGraphic />
      <div className="relative z-10 flex flex-1 flex-col">
        <p className="stat-label">Agent status</p>
        <p className="mt-1.5 text-[32px] font-semibold tracking-tight text-foreground">
          {status}
        </p>
        <p className="mt-1.5 max-w-[265px] text-[13px] leading-snug text-muted-foreground">
          Resolve issues from critical tests to improve your score
        </p>
      </div>
      <div className="relative z-10 mt-auto border-t border-white/6 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Hikmaai Score</p>
          <ScoreOutOf100
            value={percentage}
            uniform
            className="text-sm font-medium text-foreground"
          />
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white/75 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </article>
  );
}

function TestAreaOverviewCard() {
  const { areas } = scoreData;

  return (
    <article className="relative flex h-[295px] w-full flex-col overflow-visible rounded-xl border border-border bg-card px-[23px] py-[21px] dark:border-white/8">
      <Tooltip>
        <TooltipTrigger
          aria-label="How area scores are calculated"
          className="absolute right-[23px] top-4 flex size-[18px] cursor-help items-center justify-center rounded-[9px] border border-border text-[10.4px] font-semibold leading-[10.4px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground dark:border-white/20 dark:text-white/35 dark:hover:border-white/40 dark:hover:text-white/70"
        >
          i
        </TooltipTrigger>
        <TooltipContent
          side="left"
          align="end"
          className="max-w-[280px] text-left text-[13px] leading-relaxed"
        >
          Each score (0–100) is the pass rate of the latest assessments in that
          area across all monitored agents. Security, Compliance, and Efficiency
          are averaged separately from their most recent test runs.
        </TooltipContent>
      </Tooltip>
      <p className="stat-label">Area Status</p>
      <p className="pt-1.5 text-[26.4px] font-bold leading-[30.36px] tracking-[-0.528px] text-foreground">
        Test Area Overview
      </p>
      <ScoreRadarChart areas={areas} variant="overview" />
    </article>
  );
}

export function OverviewMetricsRow() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.26fr_1fr]">
      <AgentStatusCard />
      <TestAreaOverviewCard />
    </div>
  );
}

export function PriorityCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {priorityCards.map((card) => (
        <Link key={card.key} href={card.href} className="group">
          <div className="surface-card flex flex-col gap-3 p-5 transition-colors group-hover:bg-accent/40">
            <div className="flex items-center gap-2">
              <span
                className={`size-1.5 rounded-full ${priorityConfig[card.key].dot}`}
              />
              <p className="stat-label">{card.label}</p>
              {card.key === "critical" && (
                <ArrowUpRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </div>
            <p className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">
              {scoreData.priorities[card.key]}
            </p>
            <p className="text-sm text-muted-foreground">{card.hint}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** @deprecated Use OverviewMetricsRow instead */
export function ScoreCard() {
  return <OverviewMetricsRow />;
}
