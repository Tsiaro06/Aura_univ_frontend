import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "muted";
}) {
  const accentMap = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    muted: "bg-muted text-muted-foreground",
  };
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="card-elevated p-5 group">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
          <p className="text-[26px] font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
            accentMap[accent],
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
      {typeof delta === "number" && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
              positive ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
            )}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}
            {delta}%
          </span>
          <span className="text-[11px] text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
