import * as React from "react";
import { cn } from "@treyza/sdk/lib/utils";
import { Button } from "@treyza/sdk/ui/button";

interface CartIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemCount: number;
}

function CartIcon({ itemCount, className, ...props }: CartIconProps) {
  return (
    <Button variant="ghost" size="icon" className={cn("relative", className)} {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}

export { CartIcon };
export type { CartIconProps };
