import type { SystemType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { systemTypeConfig } from "@/lib/utils/system-types";

export function SystemTypeLabel({
  systemType,
  className,
  plain = false,
}: {
  systemType: SystemType;
  className?: string;
  plain?: boolean;
}) {
  const config = systemTypeConfig[systemType];

  if (plain) {
    return (
      <span
        className={cn("text-[13px] font-medium text-foreground", className)}
      >
        {config.label}
      </span>
    );
  }

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[13px] font-medium",
        config.textClassName,
        className
      )}
    >
      <Icon className={cn("size-4 shrink-0", config.iconClassName)} />
      {config.label}
    </span>
  );
}
