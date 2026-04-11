import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

function CardSkeleton({ height }: { height: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <Pulse className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Pulse className={height} />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Pulse className="h-8 w-48" />
          <Pulse className="h-4 w-72" />
        </div>

        {/* Row 1: 4 KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4">
                <Pulse className="size-12 rounded-lg!" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-3 w-20" />
                  <Pulse className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CardSkeleton height="h-[160px]" />
          <CardSkeleton height="h-[160px]" />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CardSkeleton height="h-[220px]" />
          <CardSkeleton height="h-[220px]" />
        </div>
      </div>
    </div>
  );
}
