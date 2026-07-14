import { Lightbulb, Scale, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SystemType } from "@/lib/types";

export const systemTypeConfig: Record<
  SystemType,
  {
    label: string;
    icon: LucideIcon;
    textClassName: string;
    iconClassName: string;
    tabActiveClassName: string;
  }
> = {
  security: {
    label: "Security",
    icon: Shield,
    textClassName: "text-foreground",
    iconClassName: "text-foreground fill-foreground/15",
    tabActiveClassName: "bg-muted text-foreground",
  },
  "eu-ai-act": {
    label: "EU AI Act",
    icon: Scale,
    textClassName: "text-violet-800 dark:text-violet-300",
    iconClassName: "text-violet-700 dark:text-violet-400",
    tabActiveClassName:
      "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  },
  "mcp-security": {
    label: "MCP Security",
    icon: Shield,
    textClassName: "text-muted-foreground",
    iconClassName: "text-muted-foreground",
    tabActiveClassName: "bg-muted text-foreground",
  },
  skills: {
    label: "Skills",
    icon: Lightbulb,
    textClassName: "text-muted-foreground",
    iconClassName: "text-muted-foreground",
    tabActiveClassName: "bg-muted text-foreground",
  },
};

export const systemTypeOrder: SystemType[] = [
  "security",
  "eu-ai-act",
  "mcp-security",
  "skills",
];
