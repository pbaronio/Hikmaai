import { cn } from "@/lib/utils";

interface ScoreOutOf100Props {
  value: number;
  className?: string;
  valueClassName?: string;
  /** Same-size suffix, e.g. overview legend in Figma */
  uniform?: boolean;
}

export function ScoreOutOf100({
  value,
  className,
  valueClassName,
  uniform = false,
}: ScoreOutOf100Props) {
  if (uniform) {
    return (
      <span
        className={cn("font-medium tabular-nums tracking-tight", className)}
      >
        <span className={valueClassName}>{value}</span>/100
      </span>
    );
  }

  return (
    <span
      className={cn("font-semibold tabular-nums tracking-tight", className)}
    >
      <span className={valueClassName}>{value}</span>
      <span className="text-[0.45em] font-medium text-muted-foreground">
        /100
      </span>
    </span>
  );
}
