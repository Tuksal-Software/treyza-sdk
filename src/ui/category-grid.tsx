import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { Card, CardContent } from "@treyza/sdk/ui/card";
import type { Category } from "@treyza/sdk/types";
import { navigate } from "@treyza/sdk/actions";

interface CategoryGridLabels {
  productCount?: string;
}

const defaultCategoryGridLabels: CategoryGridLabels = {
  productCount: "urun",
};

interface CategoryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: Category[];
  columns?: 2 | 3 | 4 | 6;
  labels?: CategoryGridLabels;
}

const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
  6: "grid-cols-3 md:grid-cols-6",
};

function CategoryGrid({ categories, columns = 4, labels: _labels, className, ...props }: CategoryGridProps) {
  const labels = { ...defaultCategoryGridLabels, ..._labels };

  return (
    <div className={cn("grid gap-4", colsMap[columns], className)} {...props}>
      {categories.map((cat) => (
        <Card
          key={cat.id}
          className="group cursor-pointer overflow-hidden"
          onClick={() => navigate(`/categories/${cat.slug}`)}
        >
          {cat.image && (
            <div className="aspect-video overflow-hidden">
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
            </div>
          )}
          <CardContent className="p-3 text-center">
            <h3 className="text-sm font-medium">{cat.name}</h3>
            {cat.productCount !== undefined && (
              <p className="text-xs text-muted-foreground mt-0.5">{cat.productCount} {labels.productCount}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { CategoryGrid };
export type { CategoryGridProps };
