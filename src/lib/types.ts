export type TestArea = "security" | "compliance" | "efficiency";
export type SystemType = "security" | "eu-ai-act" | "mcp-security" | "skills";
export type Priority = "critical" | "medium" | "low";
export type TestStatus = "passed" | "failed" | "warning" | "running";

export interface Agent {
  id: string;
  name: string;
  type: "agent" | "mcp" | "skill";
  description: string;
  efficiency: number;
  compliance: number;
  security: number;
  status: "active" | "inactive" | "degraded";
  lastTestedAt: string;
  activeTests: number;
}

export interface TestFinding {
  id: string;
  title: string;
  severity: Priority;
  area: TestArea;
  tags: string[];
  description: string;
  impact: string;
  remediation: string[];
  attackMethod?: string;
}

export type ScheduleFrequency = "daily" | "weekly" | "monthly";
export type ScheduleDayOfWeek =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export interface Schedule {
  id: string;
  name: string;
  frequency: ScheduleFrequency;
  time: string;
  dayOfWeek?: ScheduleDayOfWeek;
  dayOfMonth?: number;
}

export interface TestRun {
  id: string;
  testCase: string;
  area: TestArea;
  systemType: SystemType;
  priority: Priority;
  status: TestStatus;
  agents: string[];
  efficiency?: number;
  compliance?: number;
  security?: number;
  scheduleId?: string;
  lastRunAt: string;
  preset?: string;
  overview: string;
  whyThisMatters?: string;
  takeaways: string[];
  criticalActions: string[];
  mediumActions: string[];
  findings: TestFinding[];
  runCount: number;
}

export interface Workspace {
  id: string;
  name: string;
}

export type EvaluationPreset = "Safety basics" | "LLM01" | "LLM02" | "Custom";

export interface Evaluation {
  id: string;
  name: string;
  category: string;
  preset: EvaluationPreset;
}
