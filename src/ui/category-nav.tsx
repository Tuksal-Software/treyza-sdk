import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { Button } from "@treyza/sdk/ui/button";
import type { Category } from "@treyza/sdk/types";
import { navigate } from "@treyza/sdk/actions";

interface CategoryNavProps extends React.HTMLAttributes<HTMLElement> {
  categories: Category[];
  activeCategoryId?: string;
}

function CategoryNav({ categories, activeCategoryId, className, ...props }: CategoryNavProps) {
  return (
    <nav className={cn("flex gap-1 overflow-x-auto scrollbar-hide", className)} {...props}>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={activeCategoryId === cat.id ? "default" : "ghost"}
          size="sm"
          className="flex-shrink-0"
          onClick={() => navigate(`/categories/${cat.slug}`)}
        >
          {cat.name}
        </Button>
      ))}
    </nav>
  );
}

export { CategoryNav };
export type { CategoryNavProps };
