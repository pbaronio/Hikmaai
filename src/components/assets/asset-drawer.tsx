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
import { AssociatedTestRow } from "@/components/shared/associated-test-card";
import type { Agent } from "@/lib/types";
import { getTestsForAgent } from "@/lib/data/mock";
import { formatRelativeDate, agentStatusConfig, neutralChipClassName } from "@/lib/utils/format";

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

export function AssetDrawer({ agent, open, onOpenChange }: AssetDrawerProps) {
  if (!agent) return null;

  const activeTests = getTestsForAgent(agent.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:!max-w-[768px]">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="pr-8 text-left text-xl font-semibold leading-snug">
            {agent.name}
          </SheetTitle>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={neutralChipClassName}>
              {typeLabels[agent.type]}
            </Badge>
            <Badge
              variant="outline"
              className={agentStatusConfig[agent.status].className}
            >
              {agentStatusConfig[agent.status].label}
            </Badge>
          </div>
          <SheetDescription className="mt-2 text-left text-[13px] leading-relaxed">
            Last tested {formatRelativeDate(agent.lastTestedAt)}
            {activeTests.length > 0 &&
              ` · ${activeTests.length} active test${activeTests.length === 1 ? "" : "s"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 px-6 py-6">
          <section>
            <p className="section-title">About</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {agent.description}
            </p>
          </section>

          <ScoreInfographic
            efficiency={agent.efficiency}
            compliance={agent.compliance}
            security={agent.security}
            size="sm"
            open={open}
          />

          <section>
            <h4 className="section-title">
              Active tests ({activeTests.length})
            </h4>
            <div className="mt-3 space-y-2">
              {activeTests.map((test) => (
                <AssociatedTestRow key={test.id} test={test} />
              ))}
            </div>
          </section>
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
