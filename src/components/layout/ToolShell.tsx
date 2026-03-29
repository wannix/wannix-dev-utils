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
  headerClassName?: string;
  contentClassName?: string;
  headerContent?: ReactNode;
  children: ReactNode;
  headerActions?: ReactNode;
}

export function ToolShell({
  title,
  description,
  icon: Icon,
  className,
  headerClassName,
  contentClassName,
  headerContent,
  children,
  headerActions,
}: ToolShellProps): JSX.Element {
  return (
    <div className={cn("mx-auto max-w-[1400px] w-full space-y-4", className)}>
      <Card className="border-border/50 bg-card shadow-xl">
        <CardHeader
          className={cn("border-b border-border/50 pb-4", headerClassName)}
        >
          <div className="flex items-center justify-between">
            {headerContent ?? (
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-card-foreground">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-0.5 text-sm">
                    {description}
                  </CardDescription>
                </div>
              </div>
            )}
            {headerActions && <div>{headerActions}</div>}
          </div>
        </CardHeader>
        <CardContent className={cn("p-4 pt-5", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
