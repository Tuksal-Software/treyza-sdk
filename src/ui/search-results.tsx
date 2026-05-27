import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import type { SearchResult } from "@treyza/sdk/types";
import { ProductGrid } from "./product-grid";
import { Badge } from "@treyza/sdk/ui/badge";
import { navigate } from "@treyza/sdk/actions";

interface SearchResultsLabels {
  resultsFound?: string;
  noResults?: string;
}

const defaultSearchResultsLabels: SearchResultsLabels = {
  resultsFound: "sonuc bulundu",
  noResults: "icin sonuc bulunamadi",
};

interface SearchResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  searchResults: SearchResult | null;
  loading?: boolean;
  query: string;
  labels?: SearchResultsLabels;
}

function SearchResults({ searchResults, loading, query, labels: _labels, className, ...props }: SearchResultsProps) {
  const results = searchResults;
  const labels = { ...defaultSearchResultsLabels, ..._labels };

  if (loading) {
    return <ProductGrid products={[]} loading columns={4} className={className} />;
  }

  if (!results || !query) return null;

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {results.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {results.categories.map((cat) => (
            <Badge
              key={cat.id}
              variant="outline"
              className="cursor-pointer"
              onClick={() => navigate(`/categories/${cat.slug}`)}
            >
              {cat.name} {cat.productCount !== undefined && `(${cat.productCount})`}
            </Badge>
          ))}
        </div>
      )}
      {results.products.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">{results.totalCount} {labels.resultsFound}</p>
          <ProductGrid products={results.products} columns={4} />
        </>
      ) : (
        <p className="text-center text-muted-foreground py-12">"{query}" {labels.noResults}</p>
      )}
    </div>
  );
}

export { SearchResults };
export type { SearchResultsProps };
