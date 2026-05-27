import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { Card, CardContent } from "@treyza/sdk/ui/card";
import { Button } from "@treyza/sdk/ui/button";
import { Badge } from "@treyza/sdk/ui/badge";
import { PriceDisplay } from "./price-display";
import type { Product } from "@treyza/sdk/types";
import { addToCart, navigate } from "@treyza/sdk/actions";

interface ProductCardLabels {
  outOfStock?: string;
  sale?: string;
  addToCart?: string;
}

const defaultProductCardLabels: ProductCardLabels = {
  outOfStock: "Tukendi",
  sale: "Indirim",
  addToCart: "Sepete Ekle",
};

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  showAddToCart?: boolean;
  aspectRatio?: "square" | "portrait" | "landscape";
  labels?: ProductCardLabels;
}

const aspectMap = { square: "aspect-square", portrait: "aspect-[3/4]", landscape: "aspect-video" };

function ProductCard({ product, showAddToCart = true, aspectRatio = "portrait", labels: _labels, className, ...props }: ProductCardProps) {
  const labels = { ...defaultProductCardLabels, ..._labels };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(product.id);
  };

  return (
    <Card
      className={cn("group cursor-pointer overflow-hidden border-0 shadow-none", className)}
      onClick={() => navigate(`/products/${product.slug}`)}
      {...props}
    >
      <div className={cn("relative overflow-hidden rounded-lg bg-muted", aspectMap[aspectRatio])}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
          </div>
        )}
        {!product.inStock && (
          <Badge variant="secondary" className="absolute left-2 top-2">{labels.outOfStock}</Badge>
        )}
        {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
          <Badge variant="destructive" className="absolute right-2 top-2">{labels.sale}</Badge>
        )}
      </div>
      <CardContent className="px-1 pt-3">
        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" className="mt-1" />
        {showAddToCart && product.inStock && (
          <Button size="sm" variant="outline" className="mt-2 w-full" onClick={handleAddToCart}>
            {labels.addToCart}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export { ProductCard };
export type { ProductCardProps };
