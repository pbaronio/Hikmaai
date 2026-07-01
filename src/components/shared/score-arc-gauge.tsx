"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TICK_COUNT = 28;
const DEFAULT_ACTIVE_COLOR = "#4FD1C5";
const INACTIVE_COLOR = "#3F3F46";

const sizeConfig = {
  default: {
    container: "h-[148px] w-[240px]",
    value: "text-[56px]",
  },
  compact: {
    container: "h-[108px] w-[172px]",
    value: "text-[32px]",
  },
} as const;

interface ScoreArcGaugeProps {
  value: number;
  open?: boolean;
  activeColor?: string;
  size?: keyof typeof sizeConfig;
  className?: string;
}

export function ScoreArcGauge({
  value,
  open = true,
  activeColor = DEFAULT_ACTIVE_COLOR,
  size = "default",
  className,
}: ScoreArcGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const styles = sizeConfig[size];

  useEffect(() => {
    if (!open) {
      setDisplayValue(0);
      return;
    }

    setDisplayValue(0);
    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, open]);

  const filledTicks = Math.round((displayValue / 100) * TICK_COUNT);
  const cx = 120;
  const cy = 108;
  const radius = 86;
  const tickLength = 20;
  const tickWidth = 5;

  return (
    <div
      className={cn(
        "relative mx-auto flex items-end justify-center",
        styles.container,
        className
      )}
    >
      <svg
        viewBox="0 0 240 130"
        className="absolute inset-x-0 top-0 w-full"
        aria-hidden
      >
        {Array.from({ length: TICK_COUNT }, (_, i) => {
          const angle = Math.PI + (i / (TICK_COUNT - 1)) * Math.PI;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          const rotation = (angle * 180) / Math.PI + 90;
          const filled = i < filledTicks;

          return (
            <rect
              key={i}
              x={-tickWidth / 2}
              y={-tickLength / 2}
              width={tickWidth}
              height={tickLength}
              rx={tickWidth / 2}
              fill={filled ? activeColor : INACTIVE_COLOR}
              transform={`translate(${x} ${y}) rotate(${rotation})`}
              style={{ transition: "fill 120ms ease-out" }}
            />
          );
        })}
      </svg>
      <p
        className={cn(
          "relative font-semibold leading-none tracking-tight text-foreground tabular-nums",
          styles.value
        )}
      >
        {displayValue}
      </p>
    </div>
  );
}
