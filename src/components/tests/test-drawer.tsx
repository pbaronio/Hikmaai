"use client";

import Link from "next/link";
import { RefreshCw, ExternalLink, Bot } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { TestRun } from "@/lib/types";
import {
  priorityConfig,
  areaConfig,
  formatRelativeDate,
} from "@/lib/utils/format";
import { getAreaScore, getTestBaseId } from "@/lib/utils/tests";
import { ScoreArcGauge } from "@/components/shared/score-arc-gauge";
import { cn } from "@/lib/utils";
import { getAgentNames } from "@/lib/data/mock";

interface TestDrawerProps {
  test: TestRun | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestDrawer({ test, open, onOpenChange }: TestDrawerProps) {
  if (!test) return null;

  const agentNames = getAgentNames(test.agents);
  const score = getAreaScore(test);
  const area = areaConfig[test.area];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:!max-w-[587px]">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="pr-8 text-left text-xl font-semibold leading-snug">
            {test.testCase}
          </SheetTitle>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={priorityConfig[test.priority].className}
            >
              {priorityConfig[test.priority].label}
            </Badge>
            <Badge variant="outline" className={area.className}>
              {area.label}
            </Badge>
          </div>
          <SheetDescription className="mt-2 text-left text-[13px] leading-relaxed">
            Checked {formatRelativeDate(test.lastRunAt)}
            {test.runCount > 1 && ` · ${test.runCount} previous runs`}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 px-6 py-6">
          <section>
            <p className="text-[12px] font-medium text-muted-foreground">
              Result
            </p>
            <div className="mt-2 flex flex-col items-center gap-3">
              {score !== undefined ? (
                <ScoreArcGauge
                  key={test.id}
                  value={score}
                  open={open}
                />
              ) : (
                <p className="py-8 text-2xl text-muted-foreground">—</p>
              )}
              <span
                className={cn(
                  "rounded-md border px-2.5 py-1 text-[12px] font-medium",
                  area.className
                )}
              >
                {area.label}
              </span>
            </div>
          </section>

          <section>
            <p className="section-title">Tested on</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {agentNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-[14px] text-foreground"
                >
                  <Bot className="size-4 text-muted-foreground" />
                  {name}
                </span>
              ))}
            </div>
          </section>

          <section>
            <p className="section-title">What happened</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {test.overview}
            </p>
          </section>
        </div>

        <SheetFooter className="flex-col items-center gap-3 border-t border-border bg-card px-6 py-5">
          <Link
            href={`/tests/${getTestBaseId(test.id)}`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-1 h-[54px] w-full gap-2 rounded-[4px] bg-[#C192FF] px-6 text-base font-semibold text-[#000000] shadow-md ring-2 ring-[#C192FF]/30 hover:bg-[#ab7de8] [&_svg]:text-[#000000]"
            )}
          >
            <ExternalLink className="size-4" />
            Full report
          </Link>
          <Button variant="pill" size="default" className="gap-2 px-5">
            <RefreshCw className="size-4" />
            Run again
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
