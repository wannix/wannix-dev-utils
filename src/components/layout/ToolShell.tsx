import { type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ToolShellProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  className?: string;
  children: ReactNode;
  headerActions?: ReactNode;
}

export function ToolShell({
  title,
  description,
  icon: Icon,
  className,
  children,
  headerActions,
}: ToolShellProps): JSX.Element {
  return (
    <div className={cn("mx-auto max-w-5xl space-y-6", className)}>
      <Card className="border-border/50 bg-card shadow-xl">
        <CardHeader className="border-b border-border/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-card-foreground">
                  {title}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1 text-base">
                  {description}
                </CardDescription>
              </div>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </CardHeader>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
