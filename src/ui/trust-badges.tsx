import * as React from "react";
import { cn } from "../lib/utils";

interface TrustBadge {
  icon: string;
  title: string;
  description?: string;
}

interface TrustBadgesProps {
  badges?: TrustBadge[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const DEFAULT_BADGES: TrustBadge[] = [
  { icon: "Shield", title: "Guvenli Odeme", description: "256-bit SSL sifreleme" },
  { icon: "Truck", title: "Ucretsiz Kargo", description: "250 TL uzeri siparislerde" },
  { icon: "RotateCcw", title: "Kolay Iade", description: "14 gun icinde iade" },
  { icon: "Headphones", title: "7/24 Destek", description: "Her zaman yaninizdayiz" },
];

const colsMap = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

export function TrustBadges({ badges = DEFAULT_BADGES, columns = 4, className }: TrustBadgesProps) {
  return (
    <div className={cn("grid gap-4", colsMap[columns], className)}>
      {badges.map((badge, i) => (
        <div key={i} className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
          <span className="text-2xl">{badge.icon}</span>
          <span className="text-sm font-medium">{badge.title}</span>
          {badge.description && (
            <span className="text-xs text-muted-foreground">{badge.description}</span>
          )}
        </div>
      ))}
    </div>
  );
}
