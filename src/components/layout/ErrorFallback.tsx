import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

/**
 * Fallback UI displayed when a tool encounters an unhandled error.
 * Shows the error message with a retry button to reset the component tree.
 */
export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center p-8">
      <div className="max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This tool encountered an unexpected error. You can try again or
            navigate to a different tool.
          </p>
        </div>
        <div className="rounded-md border border-border/50 bg-muted/30 p-3">
          <code className="text-xs text-muted-foreground break-all">
            {error.message}
          </code>
        </div>
        <Button onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
