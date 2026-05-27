import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@treyza/sdk/ui/sheet";
import { Button } from "@treyza/sdk/ui/button";
import { Separator } from "@treyza/sdk/ui/separator";
import type { CartItem } from "@treyza/sdk/types";
import { removeFromCart, updateCartItem, navigate } from "@treyza/sdk/actions";
import { formatPrice } from "@treyza/sdk/utils";

interface CartDrawerLabels {
  title?: string;
  empty?: string;
  total?: string;
  checkout?: string;
}

const defaultCartDrawerLabels: CartDrawerLabels = {
  title: "Sepetim",
  empty: "Sepetiniz bos",
  total: "Toplam",
  checkout: "Odemeye Git",
};

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  total: string;
  labels?: CartDrawerLabels;
}

function CartDrawer({ open, onOpenChange, items, total, labels: _labels }: CartDrawerProps) {
  const labels = { ...defaultCartDrawerLabels, ..._labels };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{labels.title} ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">{labels.empty}</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}
                    <p className="text-sm font-semibold mt-0.5">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartItem(item.id, item.quantity - 1)}>
                        <span className="text-xs">-</span>
                      </Button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartItem(item.id, item.quantity + 1)}>
                        <span className="text-xs">+</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-muted-foreground" onClick={() => removeFromCart(item.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <SheetFooter className="flex-col gap-3 pt-4">
              <div className="flex justify-between text-base font-semibold w-full">
                <span>{labels.total}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full" onClick={() => { onOpenChange(false); navigate("/checkout"); }}>
                {labels.checkout}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { CartDrawer };
export type { CartDrawerProps };
