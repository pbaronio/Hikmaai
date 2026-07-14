"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreInfographic } from "@/components/shared/score-infographic";
import { AssociatedTestCard } from "@/components/shared/associated-test-card";
import type { Agent } from "@/lib/types";
import { formatDate, agentStatusConfig } from "@/lib/utils/format";
import { getTestsForAgent } from "@/lib/data/mock";

interface AssetDetailContentProps {
  agent: Agent;
}

const typeLabels = {
  agent: "AI Agent",
  mcp: "MCP Server",
  skill: "Skill",
};

export function AssetDetailContent({ agent }: AssetDetailContentProps) {
  const tests = getTestsForAgent(agent.id);

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <Link
          href="/assets"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to assets
        </Link>

        <div className="mb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{typeLabels[agent.type]}</Badge>
            <Badge variant="outline" className={agentStatusConfig[agent.status].className}>
              {agentStatusConfig[agent.status].label}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{agent.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{agent.description}</p>
        </div>

        <Card className="mb-6 border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Score breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreInfographic
              efficiency={agent.efficiency}
              compliance={agent.compliance}
              security={agent.security}
            />
          </CardContent>
        </Card>

        <h2 className="mb-4 text-lg font-medium">Associated tests</h2>
        <div className="space-y-3">
          {tests.map((test) => (
            <AssociatedTestCard key={test.id} test={test} />
          ))}
        </div>
      </div>

      <aside className="w-80 shrink-0 overflow-y-auto border-l border-border bg-card/30 p-5">
        <h3 className="mb-4 text-sm font-medium">Asset overview</h3>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Type</span>
            <p>{typeLabels[agent.type]}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <p>{agentStatusConfig[agent.status].label}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last tested</span>
            <p>{formatDate(agent.lastTestedAt)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Active tests</span>
            <p>{agent.activeTests}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
