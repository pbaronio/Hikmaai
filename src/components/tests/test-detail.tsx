"use client";

import Link from "next/link";
import { RefreshCw, Calendar, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import type { TestRun } from "@/lib/types";
import {
  priorityConfig,
  areaConfig,
  formatDate,
} from "@/lib/utils/format";
import { getAgentNames } from "@/lib/data/mock";
import { getScheduleLabelForTest } from "@/lib/utils/schedules";

interface TestDetailContentProps {
  test: TestRun;
}

function WhyThisMatters({ text }: { text: string }) {
  const paragraphs = text.split("\n\n").filter(Boolean);
  const intro = paragraphs[0] ?? "";
  const risks = paragraphs.slice(1);

  return (
    <section className="digest-block mb-8">
      <Accordion defaultValue={[]}>
        <AccordionItem value="why-this-matters" className="border-none">
          <AccordionTrigger className="py-0 hover:no-underline [&>svg]:size-4">
            <div className="flex flex-col items-start gap-1 pr-2 text-left">
              <span className="section-title">Why this matters</span>
              <span className="text-[13px] font-normal text-muted-foreground">
                {risks.length > 0
                  ? `${risks.length} business risk${risks.length === 1 ? "" : "s"} · expand to read`
                  : "Expand to read impact summary"}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{intro}</p>
            {risks.length > 0 && (
              <div className="mt-5 space-y-5">
                {risks.map((block, i) => {
                  const colonIdx = block.indexOf(": ");
                  const header = colonIdx >= 0 ? block.slice(0, colonIdx) : block;
                  const body = colonIdx >= 0 ? block.slice(colonIdx + 2) : "";
                  const dotIdx = header.indexOf(" · ");
                  const title = dotIdx >= 0 ? header.slice(0, dotIdx) : header;
                  const tag = dotIdx >= 0 ? header.slice(dotIdx + 3) : null;

                  return (
                    <div
                      key={i}
                      className="border-t border-border pt-5 first:border-t-0 first:pt-0"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {title}
                        {tag && (
                          <span className="ml-2 font-normal text-muted-foreground">
                            {tag}
                          </span>
                        )}
                      </p>
                      {body && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {body}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

export function TestDetailContent({ test }: TestDetailContentProps) {
  const agentNames = getAgentNames(test.agents);

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <Link
          href="/tests"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to tests
        </Link>

        <div className="mb-8">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={priorityConfig[test.priority].className}
            >
              {priorityConfig[test.priority].label}
            </Badge>
            <Badge variant="outline" className={areaConfig[test.area].className}>
              {areaConfig[test.area].label}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {test.testCase}
          </h1>
        </div>

        {test.whyThisMatters && (
          <WhyThisMatters text={test.whyThisMatters} />
        )}

        {test.findings.length > 0 ? (
          <section>
            <h2 className="section-title mb-4">
              Findings ({test.findings.length})
            </h2>
            <Accordion multiple defaultValue={[]}>
              {test.findings.map((finding) => (
                <AccordionItem key={finding.id} value={finding.id}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-3 pr-2">
                      <Badge
                        variant="outline"
                        className={priorityConfig[finding.severity].className}
                      >
                        {priorityConfig[finding.severity].label}
                      </Badge>
                      <span className="font-medium">{finding.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 pb-4">
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {finding.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {finding.description}
                    </p>

                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">
                        Impact
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {finding.impact}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Remediation
                      </h4>
                      <ol className="space-y-2.5">
                        {finding.remediation.map((step, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-medium text-foreground">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {finding.attackMethod && (
                      <div className="rounded-xl border border-border bg-muted/30 p-3">
                        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Attack method
                        </h4>
                        <code className="font-mono text-sm text-muted-foreground">
                          {finding.attackMethod}
                        </code>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : (
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-6 text-center">
              <p className="text-emerald-400">All checks passed</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No findings for this test run.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card/30">
        <div className="flex-1 overflow-y-auto p-5">
          <h3 className="mb-4 text-sm font-medium">Test overview</h3>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {test.overview}
          </p>

          <Separator className="my-4" />

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Last run</span>
              <p>{formatDate(test.lastRunAt)}</p>
            </div>
            {test.preset && (
              <div>
                <span className="text-muted-foreground">Preset</span>
                <p>{test.preset}</p>
              </div>
            )}
            {test.scheduleId && (
              <div>
                <span className="text-muted-foreground">Schedule</span>
                <p>{getScheduleLabelForTest(test.scheduleId)}</p>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div>
            <h4 className="mb-2 text-sm font-medium">Assets inspected</h4>
            <div className="space-y-1.5">
              {agentNames.map((name) => (
                <div
                  key={name}
                  className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-sm"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-border p-5">
          <Button className="h-12 w-full gap-2 rounded-[4px]">
            <RefreshCw className="size-4" />
            Refresh test
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full gap-2 rounded-[4px]"
          >
            <Calendar className="size-4" />
            Schedule
          </Button>
        </div>
      </aside>
    </div>
  );
}
