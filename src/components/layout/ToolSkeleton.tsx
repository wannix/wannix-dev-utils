/**
 * Skeleton loader displayed while lazy-loaded tool components are being fetched.
 * Matches the ToolShell layout to prevent cumulative layout shift (CLS).
 */
export function ToolSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-muted/50" />
          <div className="h-7 w-48 rounded bg-muted/50" />
        </div>
        <div className="h-4 w-80 rounded bg-muted/30" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="h-5 w-24 rounded bg-muted/40" />
          <div className="h-64 rounded-md border border-border/30 bg-muted/20" />
        </div>
        <div className="space-y-3">
          <div className="h-5 w-24 rounded bg-muted/40" />
          <div className="h-64 rounded-md border border-border/30 bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
