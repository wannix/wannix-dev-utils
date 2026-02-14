import { useState, useCallback, useEffect } from "react";
import {
  RotateCcw,
  Clock,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ToolShell } from "@/components/layout/ToolShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { parseCron, EXAMPLES } from "./cron.utils";
import type { CronResult } from "./cron.types";

export default function CronTool() {
  const [expression, setExpression] = useState("*/5 * * * *");
  const [result, setResult] = useState<CronResult | null>(null);

  const calculateCron = useCallback(() => {
    if (!expression.trim()) {
      setResult(null);
      return;
    }
    setResult(parseCron(expression));
  }, [expression]);

  useEffect(() => {
    calculateCron();
  }, [calculateCron]);

  const handleClear = () => {
    setExpression("");
    setResult(null);
  };

  return (
    <ToolShell
      title="Cron Tester"
      description="Validate cron expressions (standard & Quartz 7-field) and preview upcoming runs."
    >
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Input Area */}
        <Card className="border-border/50 bg-card shadow-sm">
          <CardHeader className="py-4 px-6 border-b border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Cron Expression
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Input
              className="font-mono text-lg py-6"
              placeholder="* * * * *"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
            {/* Syntax hint */}
            <div className="text-xs text-muted-foreground font-mono bg-muted/30 rounded-md px-3 py-2">
              <span className="text-foreground/70 font-semibold">
                Formats:{" "}
              </span>
              min hour dom month dow | sec min hour dom month dow | sec min hour
              dom month dow year
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground py-1 mr-1">
                Presets:
              </span>
              {EXAMPLES.map((example) => (
                <Badge
                  key={example.label}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted transition-colors font-normal"
                  onClick={() => setExpression(example.expression)}
                >
                  {example.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Area */}
        {result && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status & Description */}
            <Card
              className={`border-l-4 ${result.isValid ? "border-l-green-500 shadow-green-500/5" : "border-l-destructive shadow-destructive/5"} border-border/50 bg-card shadow-sm h-full`}
            >
              <CardHeader className="py-4 px-6 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  {result.isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {result.isValid ? (
                  <div className="space-y-4">
                    <div className="text-2xl font-medium tracking-tight text-foreground">
                      {result.description || "Valid expression"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      The expression is valid cron syntax.
                    </div>
                  </div>
                ) : (
                  <div className="text-destructive font-medium">
                    {result.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Runs */}
            <Card className="border-border/50 bg-card shadow-sm">
              <CardHeader className="py-4 px-6 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Next 5 Runs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {result.isValid && result.nextRuns.length > 0 ? (
                  <ul className="divide-y divide-border/40">
                    {result.nextRuns.map((run, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 py-3 px-6 text-sm font-mono text-muted-foreground bg-muted/5 first:bg-transparent"
                      >
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        {run}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-sm text-muted-foreground italic">
                    {result.isValid
                      ? "No future runs calculated."
                      : "Fix errors to see next runs."}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
