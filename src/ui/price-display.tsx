import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { formatPrice } from "@treyza/sdk/utils";

interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  price: string | number;
  compareAtPrice?: string | number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };

function PriceDisplay({ price, compareAtPrice, currency, size = "md", className, ...props }: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && parseFloat(String(compareAtPrice)) > parseFloat(String(price));

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <span className={cn("font-semibold", sizeMap[size], hasDiscount && "text-red-600")}>
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <span className="text-muted-foreground line-through text-sm">
          {formatPrice(compareAtPrice, currency)}
        </span>
      )}
    </div>
  );
}

export { PriceDisplay };
export type { PriceDisplayProps };
