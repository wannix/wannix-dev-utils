import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeftRight, AlertCircle } from "lucide-react";
import { jsonToYaml, yamlToJson } from "@/lib/converters/jsonYaml";

export function JsonYamlTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");

  useEffect(() => {
    const result = mode === "json-to-yaml" ? jsonToYaml(left) : yamlToJson(left);
    if (result.success) {
      setRight(result.result || "");
      setError("");
    } else {
      setError(result.error || "Conversion error");
      setRight("");
    }
  }, [left, mode]);

  const toggleMode = () => {
    setMode(m => m === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
    setLeft(right);
    setRight("");
  };

  return (
    <ToolCard title="JSON ↔ YAML Converter" description="Convert between JSON and YAML formats in real-time">
      <div className="flex items-center justify-center mb-4">
        <Button variant="outline" onClick={toggleMode} className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          {mode === "json-to-yaml" ? "JSON → YAML" : "YAML → JSON"}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{mode === "json-to-yaml" ? "JSON" : "YAML"}</label>
          <Textarea value={left} onChange={(e) => setLeft(e.target.value)} placeholder={mode === "json-to-yaml" ? '{"key": "value"}' : "key: value"} className="font-mono min-h-[300px]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">{mode === "json-to-yaml" ? "YAML" : "JSON"}</label>
            <CopyButton text={right} />
          </div>
          <Textarea value={right} readOnly className="font-mono min-h-[300px] bg-code-bg text-foreground" />
        </div>
      </div>
      {error && <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
    </ToolCard>
  );
}
