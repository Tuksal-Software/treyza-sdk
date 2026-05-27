import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import type { ProductVariant } from "@treyza/sdk/types";

interface VariantSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onVariantChange: (variant: ProductVariant) => void;
}

function VariantSelector({ variants, selectedVariantId, onVariantChange, className, ...props }: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          disabled={!variant.inStock}
          onClick={() => onVariantChange(variant)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            selectedVariantId === variant.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary",
            !variant.inStock && "cursor-not-allowed opacity-50",
          )}
        >
          {variant.name}
        </button>
      ))}
    </div>
  );
}

export { VariantSelector };
export type { VariantSelectorProps };
