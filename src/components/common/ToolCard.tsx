import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ToolCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolCard({ title, description, children }: ToolCardProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
