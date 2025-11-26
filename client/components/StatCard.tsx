import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow duration-200",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-[#050A30] dark:text-white">
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.direction === "up"
                    ? "text-[#042d62]"
                    : "text-slate-500",
                )}
              >
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-[#042d62] opacity-40 flex-shrink-0">{icon}</div>
        )}
      </div>
    </div>
  );
}
