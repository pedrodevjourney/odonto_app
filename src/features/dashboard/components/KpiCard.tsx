import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  subtitle,
  trend,
  className,
}: KpiCardProps) {
  return (
    <Card size="sm" className={cn("relative overflow-hidden", className)}>
      <CardContent className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p
              className={cn(
                "mt-0.5 text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-500",
                (!trend || trend === "neutral") && "text-muted-foreground",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
