import * as React from "react";
import { cn } from "../lib/utils";

interface CountdownTimerProps {
  targetDate: string;
  labels?: { days?: string; hours?: string; minutes?: string; seconds?: string; expired?: string };
  className?: string;
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  React.useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      };
    }
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export function CountdownTimer({ targetDate, labels, className }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, expired } = useCountdown(targetDate);
  const l = { days: "Gun", hours: "Saat", minutes: "Dk", seconds: "Sn", expired: "Sure doldu", ...labels };

  if (expired) return <p className={cn("text-sm text-muted-foreground", className)}>{l.expired}</p>;

  const units = [
    { value: days, label: l.days },
    { value: hours, label: l.hours },
    { value: minutes, label: l.minutes },
    { value: seconds, label: l.seconds },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {units.map((u, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center rounded-md bg-muted px-3 py-2">
            <span className="text-2xl font-bold tabular-nums">{String(u.value).padStart(2, "0")}</span>
            <span className="text-[10px] uppercase text-muted-foreground">{u.label}</span>
          </div>
          {i < units.length - 1 && <span className="text-xl font-bold text-muted-foreground">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
