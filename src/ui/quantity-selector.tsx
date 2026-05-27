import * as React from "react";
import { cn } from "../lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, className }: QuantitySelectorProps) {
  return (
    <div className={cn("inline-flex items-center rounded-md border", className)}>
      <button
        type="button"
        className="flex size-8 items-center justify-center text-sm hover:bg-muted disabled:opacity-50"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        -
      </button>
      <span className="flex size-8 items-center justify-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        className="flex size-8 items-center justify-center text-sm hover:bg-muted disabled:opacity-50"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
