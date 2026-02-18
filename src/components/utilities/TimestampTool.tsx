import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import { timestampToReadable, dateToTimestamp, getCurrentTimestamp, TimestampConversion } from "@/lib/converters/timestamp";

export function TimestampTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<TimestampConversion | null>(null);

  useEffect(() => {
    const fromTs = timestampToReadable(input);
    if (fromTs) { setResult(fromTs); return; }
    const fromDate = dateToTimestamp(input);
    if (fromDate) { setResult(fromDate); return; }
    setResult(null);
  }, [input]);

  const setNow = () => {
    const now = getCurrentTimestamp();
    setInput(String(now.unix));
  };

  return (
    <ToolCard title="Unix Timestamp Converter" description="Convert between Unix timestamps and human-readable dates">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter timestamp (1234567890) or date (2024-01-15)" className="font-mono" />
          <Button variant="outline" onClick={setNow}><RefreshCw className="h-4 w-4 mr-2" />Now</Button>
        </div>
        {result && (
          <div className="p-4 bg-code-bg rounded space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Unix (seconds):</span><div className="flex items-center gap-2"><span className="font-mono">{result.unix}</span><CopyButton text={String(result.unix)} /></div></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Unix (ms):</span><div className="flex items-center gap-2"><span className="font-mono">{result.unixMs}</span><CopyButton text={String(result.unixMs)} /></div></div>
            <div className="flex justify-between"><span className="text-muted-foreground">ISO 8601:</span><div className="flex items-center gap-2"><span className="font-mono">{result.iso}</span><CopyButton text={result.iso} /></div></div>
            <div className="flex justify-between"><span className="text-muted-foreground">UTC:</span><span className="font-mono">{result.utc}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Local:</span><span className="font-mono">{result.local}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Relative:</span><span className="text-primary font-medium">{result.relative}</span></div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
