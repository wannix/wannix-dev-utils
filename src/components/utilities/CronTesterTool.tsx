import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { parseCronExpression, commonCronExpressions } from "@/lib/converters/cron";

export function CronTesterTool() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<ReturnType<typeof parseCronExpression> | null>(null);

  useEffect(() => {
    if (!expression.trim()) { setResult(null); return; }
    setResult(parseCronExpression(expression));
  }, [expression]);

  return (
    <ToolCard title="Cron Expression Tester" description="Validate cron expressions and preview upcoming runs">
      <div className="space-y-4">
        <Input value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="*/5 * * * *" className="font-mono text-lg" />
        <div className="flex flex-wrap gap-2">
          {commonCronExpressions.map((c) => (
            <Button key={c.expression} variant="outline" size="sm" onClick={() => setExpression(c.expression)}>{c.description}</Button>
          ))}
        </div>
        {result && (
          result.isValid ? (
            <div className="p-4 bg-code-bg rounded space-y-3">
              <div className="flex items-center gap-2 text-green-400"><Check className="h-4 w-4" /><span className="font-semibold">Valid Expression</span></div>
              <div className="text-lg">{result.description}</div>
              {result.nextRuns && result.nextRuns.length > 0 && (
                <div className="space-y-1">
                  <span className="text-muted-foreground text-sm">Next runs:</span>
                  {result.nextRuns.map((d, i) => <div key={i} className="font-mono text-sm">{d.toLocaleString()}</div>)}
                </div>
              )}
            </div>
          ) : (
            <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{result.error}</AlertDescription></Alert>
          )
        )}
      </div>
    </ToolCard>
  );
}
