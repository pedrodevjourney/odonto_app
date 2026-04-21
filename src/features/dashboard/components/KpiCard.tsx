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
    <Card
      size="sm"
      className={cn(
        "relative overflow-hidden transition-shadow duration-200 hover:shadow-sm",
        className,
      )}
    >
      {/* Left accent strip */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-primary/50 rounded-l-xl" />

      <CardContent className="pl-5 pr-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-1.5 text-2xl font-bold tabular-nums leading-none tracking-tight text-foreground">
              {value}
            </p>
            {subtitle && (
              <p
                className={cn(
                  "mt-1.5 text-[11px] font-medium",
                  trend === "up" && "text-emerald-600",
                  trend === "down" && "text-red-500",
                  (!trend || trend === "neutral") && "text-muted-foreground",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
