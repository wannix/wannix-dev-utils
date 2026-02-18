import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import * as Diff from "diff";

export function DiffCheckerTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diff, setDiff] = useState<Diff.Change[]>([]);

  useEffect(() => {
    setDiff(Diff.diffLines(left, right));
  }, [left, right]);

  return (
    <ToolCard title="Diff Checker" description="Compare two texts and highlight differences">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2"><Label>Original</Label><Textarea value={left} onChange={(e) => setLeft(e.target.value)} placeholder="Paste original text..." className="font-mono min-h-[200px]" /></div>
        <div className="space-y-2"><Label>Modified</Label><Textarea value={right} onChange={(e) => setRight(e.target.value)} placeholder="Paste modified text..." className="font-mono min-h-[200px]" /></div>
      </div>
      {diff.length > 0 && (left || right) && (
        <div className="space-y-2">
          <Label>Differences</Label>
          <div className="p-4 bg-code-bg rounded font-mono text-sm overflow-auto max-h-[300px]">
            {diff.map((part, i) => (
              <span key={i} className={part.added ? "bg-green-500/30 text-green-400" : part.removed ? "bg-red-500/30 text-red-400" : ""}>
                {part.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}
