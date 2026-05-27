import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import type { Product } from "@treyza/sdk/types";
import { ProductCard } from "./product-card";
import { Skeleton } from "@treyza/sdk/ui/skeleton";

interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
  showAddToCart?: boolean;
  loading?: boolean;
  skeletonCount?: number;
}

const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

function ProductGrid({ products, columns = 4, showAddToCart, loading, skeletonCount = 8, className, ...props }: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn("grid gap-4", colsMap[columns], className)} {...props}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", colsMap[columns], className)} {...props}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showAddToCart={showAddToCart} />
      ))}
    </div>
  );
}

export { ProductGrid };
export type { ProductGridProps };
