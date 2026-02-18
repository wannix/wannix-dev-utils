import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { testRegex, commonPatterns, RegexFlags } from "@/lib/converters/regex";

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState<RegexFlags>({ global: true, caseInsensitive: false, multiline: false, dotAll: false, unicode: false });
  const [result, setResult] = useState<ReturnType<typeof testRegex> | null>(null);

  useEffect(() => { setResult(testRegex(pattern, testString, flags)); }, [pattern, testString, flags]);

  return (
    <ToolCard title="Regex Tester" description="Test regular expressions with real-time matching">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Pattern</Label>
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="[a-z]+" className="font-mono" />
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((p) => <Button key={p.name} variant="outline" size="sm" onClick={() => setPattern(p.pattern)}>{p.name}</Button>)}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {(Object.keys(flags) as (keyof RegexFlags)[]).map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Switch checked={flags[f]} onCheckedChange={(v) => setFlags({ ...flags, [f]: v })} />
              <Label className="text-xs">{f.replace(/([A-Z])/g, ' $1').trim()}</Label>
            </div>
          ))}
        </div>
        <div className="space-y-2"><Label>Test String</Label><Textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Enter text to test against..." className="min-h-[100px]" /></div>
        {result && !result.isValid && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{result.error}</AlertDescription></Alert>}
        {result && result.isValid && result.matches && result.matches.length > 0 && (
          <div className="p-4 bg-code-bg rounded space-y-2">
            <div className="text-sm text-muted-foreground">{result.matchCount} match{result.matchCount !== 1 ? "es" : ""} found</div>
            {result.matches.map((m, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-sm">
                <span className="text-muted-foreground">[{m.index}]</span>
                <span className="bg-primary/30 px-1 rounded">{m.match}</span>
                <CopyButton text={m.match} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  );
}
