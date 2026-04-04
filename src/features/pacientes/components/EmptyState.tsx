interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted/60">
        <Icon className="size-5 text-muted-foreground/40" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground/60">{title}</p>
        <p className="text-xs text-muted-foreground/45">{description}</p>
      </div>
    </div>
  );
}
