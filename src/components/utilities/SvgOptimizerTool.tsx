import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { optimize } from "svgo/browser";

export function SvgOptimizerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; optimized: number; saved: number } | null>(null);

  useEffect(() => {
    if (!input.trim()) { setOutput(""); setStats(null); return; }
    try {
      const result = optimize(input, { multipass: true });
      setOutput(result.data);
      const saved = ((input.length - result.data.length) / input.length) * 100;
      setStats({ original: input.length, optimized: result.data.length, saved });
    } catch { setOutput(""); setStats(null); }
  }, [input]);

  return (
    <ToolCard title="SVG Optimizer" description="Optimize SVG files by removing unnecessary metadata">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Input SVG</Label><Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="<svg>...</svg>" className="font-mono min-h-[250px]" /></div>
        <div className="space-y-2">
          <div className="flex justify-between items-center"><Label>Optimized SVG</Label><CopyButton text={output} /></div>
          <Textarea value={output} readOnly className="font-mono min-h-[250px] bg-code-bg text-foreground" />
        </div>
      </div>
      {stats && (
        <div className="mt-4 p-3 bg-code-bg rounded flex gap-6 text-sm">
          <div><span className="text-muted-foreground">Original:</span> {stats.original.toLocaleString()} bytes</div>
          <div><span className="text-muted-foreground">Optimized:</span> {stats.optimized.toLocaleString()} bytes</div>
          <div className="text-green-400">Saved: {stats.saved.toFixed(1)}%</div>
        </div>
      )}
    </ToolCard>
  );
}
