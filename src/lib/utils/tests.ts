import type { TestArea, TestRun } from "../types";
import { areaConfig } from "./format";

export const areaChipConfig = areaConfig;

export function getAreaScore(test: TestRun): number | undefined {
  if (test.area === "security") return test.security;
  if (test.area === "compliance") return test.compliance;
  return test.efficiency;
}

/** Base test id when rows are expanded per agent (e.g. test-1__agent-1 → test-1). */
export function getTestBaseId(id: string): string {
  return id.includes("__") ? id.split("__")[0]! : id;
}

/** One table row per agent — same test case may appear multiple times. */
export function expandTestsByAgent(tests: TestRun[]): TestRun[] {
  const rows: TestRun[] = [];

  for (const test of tests) {
    for (const agentId of test.agents) {
      rows.push({
        ...test,
        id: `${test.id}__${agentId}`,
        agents: [agentId],
      });
    }
  }

  const priorityOrder = { critical: 0, medium: 1, low: 2 };

  return rows.sort((a, b) => {
    const byPriority = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (byPriority !== 0) return byPriority;
    return (
      new Date(b.lastRunAt).getTime() - new Date(a.lastRunAt).getTime()
    );
  });
}

export function isRecurrentTest(test: TestRun): boolean {
  return Boolean(test.schedule);
}

/** Radar axes for a test row: tested area uses run score; others use agent baseline. */
export function getTestRadarAreas(
  test: TestRun,
  agentScores?: { security: number; compliance: number; efficiency: number }
): Record<TestArea, number> {
  const testScore = getAreaScore(test);
  const baseline = agentScores ?? {
    security: 0,
    compliance: 0,
    efficiency: 0,
  };

  return {
    security:
      test.area === "security" && testScore !== undefined
        ? testScore
        : baseline.security,
    compliance:
      test.area === "compliance" && testScore !== undefined
        ? testScore
        : baseline.compliance,
    efficiency:
      test.area === "efficiency" && testScore !== undefined
        ? testScore
        : baseline.efficiency,
  };
}
