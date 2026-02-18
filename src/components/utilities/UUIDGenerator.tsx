import { useState, useEffect, useCallback } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { generateBulkUUIDs } from "@/lib/converters/uuid";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [withHyphens, setWithHyphens] = useState(true);
  const [error, setError] = useState("");
  const { copyToClipboard } = useCopyToClipboard();

  const handleGenerate = useCallback(() => {
    setError("");
    try {
      const options = { uppercase, withHyphens };
      const newUuids = generateBulkUUIDs(count, options);
      setUuids(newUuids);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate UUIDs");
    }
  }, [count, uppercase, withHyphens]);

  // Auto-regenerate when options change and UUIDs exist
  useEffect(() => {
    if (uuids.length > 0) {
      handleGenerate();
    }
  }, [handleGenerate, uuids.length]);

  const handleCopyAll = () => {
    copyToClipboard(uuids.join("\n"), "All UUIDs copied");
  };

  return (
    <ToolCard
      title="UUID Generator"
      description="Generate cryptographically secure UUID v4 identifiers. Customize format and generate multiple UUIDs at once."
    >
      <div className="space-y-4">
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="count">Number of UUIDs</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            />
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Uppercase</Label>
              <Switch
                id="uppercase"
                checked={uppercase}
                onCheckedChange={setUppercase}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="hyphens">Include Hyphens</Label>
              <Switch
                id="hyphens"
                checked={withHyphens}
                onCheckedChange={setWithHyphens}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleGenerate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {uuids.length > 0 ? "Regenerate" : "Generate"}
          </Button>
          {uuids.length > 1 && (
            <Button variant="outline" onClick={handleCopyAll}>
              Copy All
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Generated UUIDs */}
        {uuids.length > 0 && (
          <div className="space-y-2">
            <Label>Generated UUIDs ({uuids.length})</Label>
            <div className="border border-border rounded-md divide-y divide-border max-h-[400px] overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                >
                  <code className="text-sm font-mono text-foreground flex-1">
                    {uuid}
                  </code>
                  <CopyButton text={uuid} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
