import { ReactNode } from "react";

interface CodeDisplayProps {
  children: ReactNode;
  className?: string;
}

export function CodeDisplay({ children, className = "" }: CodeDisplayProps) {
  return (
    <pre className={`bg-code-bg border border-code-border rounded-md p-4 overflow-x-auto ${className}`}>
      <code className="text-sm font-mono text-foreground">{children}</code>
    </pre>
  );
}
