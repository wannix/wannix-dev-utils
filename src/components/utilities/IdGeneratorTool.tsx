import { useState, useEffect, useCallback } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { generateBulkIds, idTypeInfo, IdType } from "@/lib/converters/idGenerator";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function IdGeneratorTool() {
  const [idType, setIdType] = useState<IdType>("uuid");
  const [uppercase, setUppercase] = useState(false);
  const [withHyphens, setWithHyphens] = useState(true);
  const [count, setCount] = useState(1);
  const [ids, setIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const { copyToClipboard } = useCopyToClipboard();

  const handleGenerate = useCallback(() => {
    try {
      const result = generateBulkIds({ type: idType, uppercase, withHyphens, count });
      setIds(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate IDs");
    }
  }, [idType, uppercase, withHyphens, count]);

  useEffect(() => {
    if (ids.length > 0) handleGenerate();
  }, [handleGenerate, ids.length]);

  return (
    <ToolCard title="ID Generator Suite" description="Generate UUID, ULID, and KSUID identifiers">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ID Type</Label>
            <Select value={idType} onValueChange={(v) => setIdType(v as IdType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(idTypeInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{idTypeInfo[idType].description}</p>
          </div>
          <div className="space-y-2">
            <Label>Count</Label>
            <Input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={uppercase} onCheckedChange={setUppercase} />
            <Label>Uppercase</Label>
          </div>
          {idType === 'uuid' && (
            <div className="flex items-center gap-2">
              <Switch checked={withHyphens} onCheckedChange={setWithHyphens} />
              <Label>With Hyphens</Label>
            </div>
          )}
        </div>

        <Button onClick={handleGenerate} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {ids.length > 0 ? "Regenerate" : "Generate"}
        </Button>

        {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

        {ids.length > 0 && (
          <div className="space-y-2">
            {ids.map((id, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-code-bg rounded font-mono text-sm">
                <span className="flex-1 break-all">{id}</span>
                <CopyButton text={id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  );
}
