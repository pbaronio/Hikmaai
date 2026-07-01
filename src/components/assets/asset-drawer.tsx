"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScoreInfographic } from "@/components/shared/score-infographic";
import type { Agent } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils/format";
import { getTestsForAgent } from "@/lib/data/mock";
import { priorityConfig, statusConfig } from "@/lib/utils/format";

interface AssetDrawerProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeLabels = {
  agent: "AI Agent",
  mcp: "MCP Server",
  skill: "Skill",
};

const statusLabels = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-400" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
  degraded: { label: "Degraded", className: "bg-amber-500/15 text-amber-400" },
};

export function AssetDrawer({ agent, open, onOpenChange }: AssetDrawerProps) {
  if (!agent) return null;

  const activeTests = getTestsForAgent(agent.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:!max-w-[768px]">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{typeLabels[agent.type]}</Badge>
            <Badge variant="outline" className={statusLabels[agent.status].className}>
              {statusLabels[agent.status].label}
            </Badge>
          </div>
          <SheetTitle className="text-left">{agent.name}</SheetTitle>
          <SheetDescription className="text-left">
            Last tested {formatRelativeDate(agent.lastTestedAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4">
          <p className="text-sm text-muted-foreground">{agent.description}</p>

          <ScoreInfographic
            efficiency={agent.efficiency}
            compliance={agent.compliance}
            security={agent.security}
            size="sm"
            open={open}
          />

          <div>
            <h4 className="mb-3 text-sm font-medium">
              Active tests ({activeTests.length})
            </h4>
            <div className="space-y-2">
              {activeTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{test.testCase}</p>
                    <div className="mt-0.5 flex gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-xs ${priorityConfig[test.priority].className}`}
                      >
                        {test.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusConfig[test.status].className}`}
                      >
                        {statusConfig[test.status].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col items-center gap-3 border-t border-border bg-card px-6 py-5">
          <Link
            href={`/assets/${agent.id}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-1 h-[54px] w-full gap-2 rounded-[4px] bg-[#C192FF] px-6 text-base font-semibold text-[#000000] shadow-md ring-2 ring-[#C192FF]/30 hover:bg-[#ab7de8] [&_svg]:text-[#000000]"
            )}
          >
            <ExternalLink className="size-4" />
            Open detail
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
