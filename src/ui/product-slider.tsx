import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { Button } from "@treyza/sdk/ui/button";
import type { Product } from "@treyza/sdk/types";
import { ProductCard } from "./product-card";

interface ProductSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product[];
  showAddToCart?: boolean;
  cardWidth?: number;
}

function ProductSlider({ products, showAddToCart, cardWidth = 220, className, ...props }: ProductSliderProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = cardWidth * 2;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <div className={cn("relative group", className)} {...props}>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-4 top-1/3 z-10 hidden rounded-full shadow-md group-hover:flex"
        onClick={() => scroll("left")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="m15 18-6-6 6-6" /></svg>
      </Button>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0" style={{ width: cardWidth }}>
            <ProductCard product={product} showAddToCart={showAddToCart} />
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-1/3 z-10 hidden rounded-full shadow-md group-hover:flex"
        onClick={() => scroll("right")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="m9 18 6-6-6-6" /></svg>
      </Button>
    </div>
  );
}

export { ProductSlider };
export type { ProductSliderProps };
