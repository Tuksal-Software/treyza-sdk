import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { formatPrice } from "@treyza/sdk/utils";
import { Separator } from "@treyza/sdk/ui/separator";

interface CartSummaryLabels {
  subtotal?: string;
  shipping?: string;
  freeShipping?: string;
  tax?: string;
  total?: string;
}

const defaultCartSummaryLabels: CartSummaryLabels = {
  subtotal: "Ara Toplam",
  shipping: "Kargo",
  freeShipping: "Ucretsiz",
  tax: "Vergi",
  total: "Toplam",
};

interface CartSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  subtotal: string;
  itemCount: number;
  shipping?: string;
  tax?: string;
  labels?: CartSummaryLabels;
}

function CartSummary({ subtotal, itemCount, shipping, tax, labels: _labels, className, ...props }: CartSummaryProps) {
  const labels = { ...defaultCartSummaryLabels, ..._labels };
  const shippingAmount = shipping ? parseFloat(shipping) : 0;
  const taxAmount = tax ? parseFloat(tax) : 0;
  const total = parseFloat(subtotal) + shippingAmount + taxAmount;

  return (
    <div className={cn("space-y-2 text-sm", className)} {...props}>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{labels.subtotal} ({itemCount})</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {shipping && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{labels.shipping}</span>
          <span>{shippingAmount === 0 ? labels.freeShipping : formatPrice(shipping)}</span>
        </div>
      )}
      {tax && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">{labels.tax}</span>
          <span>{formatPrice(tax)}</span>
        </div>
      )}
      <Separator />
      <div className="flex justify-between font-semibold text-base">
        <span>{labels.total}</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

export { CartSummary };
export type { CartSummaryProps };
